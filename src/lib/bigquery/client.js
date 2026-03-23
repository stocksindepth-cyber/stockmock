/**
 * BigQuery Client — Server-Side Only
 *
 * Auth strategy:
 *   When BIGQUERY_CREDENTIALS_JSON is set (production/Vercel), we bypass
 *   google-auth-library JWT signing entirely.  The standard path uses jwa →
 *   crypto.createSign().sign(pemString) → OpenSSL DECODER, which throws
 *   DECODER routines::unsupported on Node 24 / OpenSSL 3 for PKCS#1 RSA keys.
 *
 *   Instead we implement the full OAuth2 service-account JWT flow ourselves:
 *     1. Convert PKCS#1 DER → PKCS#8 DER in pure JS (zero OpenSSL)
 *     2. Import via crypto.subtle.importKey('pkcs8', der) — uses EVP_PKEY_fromdata,
 *        a completely different code path that doesn't touch OSSL_DECODER
 *     3. Sign with subtle.sign('RSASSA-PKCS1-v1_5', keyObj, data)
 *     4. Exchange self-signed JWT for a Google access token
 *     5. Cache the token (1 h) and inject it into every BigQuery request
 *        via a minimal authClient adapter
 *
 *   Local dev (no BIGQUERY_CREDENTIALS_JSON): uses ADC / GOOGLE_APPLICATION_CREDENTIALS
 *   as before — no changes needed locally.
 */

import crypto from "crypto";
import { BigQuery } from "@google-cloud/bigquery";

// ── Pure-JS PKCS#1 DER → PKCS#8 DER ─────────────────────────────────────────
// PKCS#8 PrivateKeyInfo (RFC 5958) wraps PKCS#1 RSAPrivateKey in:
//   SEQUENCE { INTEGER 0, SEQUENCE { OID rsaEncryption, NULL }, OCTET STRING { <pkcs1> } }

function asn1TLV(tag, value) {
  const len = value.length;
  let header;
  if (len < 0x80)        header = Buffer.from([tag, len]);
  else if (len < 0x100)  header = Buffer.from([tag, 0x81, len]);
  else                   header = Buffer.from([tag, 0x82, len >> 8, len & 0xff]);
  return Buffer.concat([header, value]);
}

function pkcs1DerToPkcs8Der(pkcs1Der) {
  // OID 1.2.840.113549.1.1.1 (rsaEncryption) + NULL — fixed 13-byte payload
  const oidPayload = Buffer.from("06092a864886f70d010101050000", "hex");
  // Wait — that's wrong. Let me build it correctly:
  // OID TLV: 06 09 2a864886f70d010101  (11 bytes)
  // NULL TLV: 05 00                    (2 bytes)
  // AlgId SEQUENCE wraps these 13 bytes: 30 0d ...
  const algId  = Buffer.from("300d06092a864886f70d0101010500", "hex"); // 15 bytes
  const ver    = Buffer.from([0x02, 0x01, 0x00]);                      // INTEGER 0
  const privK  = asn1TLV(0x04, pkcs1Der);                              // OCTET STRING
  const inner  = Buffer.concat([ver, algId, privK]);
  return asn1TLV(0x30, inner);                                         // outer SEQUENCE
}

function extractDerFromPem(pem, label) {
  const re = new RegExp(`-----BEGIN ${label}-----([\\s\\S]+?)-----END ${label}-----`);
  const m  = pem.match(re);
  if (!m) throw new Error(`PEM label "${label}" not found`);
  return Buffer.from(m[1].replace(/\s/g, ""), "base64");
}

// ── Access-token cache ────────────────────────────────────────────────────────
let _cachedToken  = null;
let _tokenExpires = 0;   // Unix seconds

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  if (_cachedToken && now < _tokenExpires - 60) return _cachedToken;

  const iat = now;
  const exp = now + 3600;

  const hdr = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const pay = Buffer.from(JSON.stringify({
    iss:   credentials.client_email,
    sub:   credentials.client_email,
    aud:   "https://oauth2.googleapis.com/token",
    scope: "https://www.googleapis.com/auth/bigquery",
    iat, exp,
  })).toString("base64url");
  const toSign = `${hdr}.${pay}`;

  // ── Determine PKCS#8 DER (zero OpenSSL decoder involvement) ──────────────
  const pem = (credentials.private_key || "").replace(/\\n/g, "\n");
  let pkcs8Der;

  if (pem.includes("BEGIN RSA PRIVATE KEY")) {
    // PKCS#1 → wrap in PKCS#8 shell (pure JS Buffer ops)
    const pkcs1Der = extractDerFromPem(pem, "RSA PRIVATE KEY");
    pkcs8Der = pkcs1DerToPkcs8Der(pkcs1Der);
    console.log(`[BigQuery] PKCS#1→PKCS#8 (pure-JS) len=${pkcs8Der.length}`);
  } else {
    // Already PKCS#8 PEM — extract DER directly
    pkcs8Der = extractDerFromPem(pem, "PRIVATE KEY");
    console.log(`[BigQuery] PKCS#8 DER extracted len=${pkcs8Der.length}`);
  }

  // ── Sign via SubtleCrypto (EVP_PKEY_fromdata path, not OSSL_DECODER) ─────
  // crypto.subtle.importKey uses a different internal code path than
  // createSign().sign(pemString) and avoids DECODER routines::unsupported.
  const keyObj = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8Der,                                  // raw DER buffer — no PEM parsing
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuf = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyObj,
    Buffer.from(toSign)
  );
  const sig = Buffer.from(sigBuf).toString("base64url");
  const jwt = `${toSign}.${sig}`;

  // ── Exchange self-signed JWT for Google access token ─────────────────────
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[BigQuery] Token exchange failed (${res.status}): ${errText}`);
  }

  const tokenData = await res.json();
  _cachedToken  = tokenData.access_token;
  _tokenExpires = exp;
  console.log("[BigQuery] Access token obtained via SubtleCrypto ✓");
  return _cachedToken;
}

// ── Minimal authClient adapter for @google-cloud/bigquery ────────────────────
// BigQuery SDK calls authClient.getRequestHeaders() for every request.
// We also implement request() which @google-cloud/common uses in some paths.
function makeAuthClient(credentials) {
  // Lazy-load gaxios (it's a dep of google-auth-library, always present)
  let _gaxios = null;
  function gaxios() {
    if (!_gaxios) _gaxios = require("gaxios");
    return _gaxios;
  }

  return {
    projectId: credentials.project_id,

    async getRequestHeaders(_url) {
      const token = await getAccessToken(credentials);
      return { Authorization: `Bearer ${token}` };
    },

    async getAccessToken() {
      const token = await getAccessToken(credentials);
      return { token, res: null };
    },

    async request(opts) {
      const token = await getAccessToken(credentials);
      opts.headers = Object.assign({}, opts.headers, { Authorization: `Bearer ${token}` });
      return gaxios().request(opts);
    },
  };
}

// ── Client singleton ──────────────────────────────────────────────────────────
let _client = null;

export function getBigQueryClient() {
  if (_client) return _client;

  const projectId = process.env.BIGQUERY_PROJECT_ID;
  if (!projectId) throw new Error("BIGQUERY_PROJECT_ID is not set. Add it to .env.local");

  const credentialsJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (credentialsJson) {
    let credentials;
    try {
      credentials = JSON.parse(credentialsJson);
    } catch {
      throw new Error("BIGQUERY_CREDENTIALS_JSON is not valid JSON");
    }

    // Pass our custom authClient — completely bypasses google-auth-library's
    // JWT signing and OpenSSL's DECODER infrastructure.
    _client = new BigQuery({ projectId, authClient: makeAuthClient(credentials) });
    console.log("[BigQuery] Client initialised with SubtleCrypto auth ✓");
  } else {
    _client = new BigQuery({ projectId }); // ADC for local dev
  }

  return _client;
}

export const DATASET    = process.env.BIGQUERY_DATASET    || "optionsgyani";
export const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;

export function isBigQueryConfigured() {
  return !!(
    process.env.BIGQUERY_PROJECT_ID &&
    (process.env.BIGQUERY_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS)
  );
}

/**
 * Run a parameterised BigQuery query and return rows.
 */
export async function runQuery(sql, params = {}) {
  const bq = getBigQueryClient();

  const queryParams = {};
  const types       = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "number") {
      if (Number.isInteger(value)) { queryParams[key] = value; types[key] = "INT64"; }
      else                         { queryParams[key] = value; types[key] = "FLOAT64"; }
    } else if (value instanceof Date) {
      queryParams[key] = value.toISOString().split("T")[0]; types[key] = "DATE";
    } else if (Array.isArray(value)) {
      queryParams[key] = value;
      if (value.length > 0)
        types[key] = { type: "ARRAY", arrayType: typeof value[0] === "number" ? "FLOAT64" : "STRING" };
    } else {
      queryParams[key] = value; types[key] = "STRING";
    }
  }

  const queryOpts = { query: sql, params: queryParams, types };
  const location  = process.env.BIGQUERY_LOCATION;
  if (location) queryOpts.location = location;
  const [rows] = await bq.query(queryOpts);
  return rows;
}

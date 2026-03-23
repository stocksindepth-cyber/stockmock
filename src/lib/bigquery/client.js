/**
 * BigQuery Client — Server-Side Only
 *
 * Credentials priority:
 *   1. BIGQUERY_CREDENTIALS_JSON  — full JSON key as env var (production/Vercel)
 *   2. GOOGLE_APPLICATION_CREDENTIALS — path to key file (local dev)
 *   3. Application Default Credentials — GCP managed environments
 *
 * Set in .env.local:
 *   BIGQUERY_PROJECT_ID=optionsindepth
 *   BIGQUERY_DATASET=optionsgyani
 *   BIGQUERY_CREDENTIALS_JSON={"type":"service_account",...}
 *
 * OpenSSL 3.0 note (Node 18+):
 *   google-auth-library's jwa dependency calls crypto.createSign().sign(pemString)
 *   which throws ERR_OSSL_UNSUPPORTED (DECODER routines::unsupported) when the
 *   PEM string is passed directly on OpenSSL 3.  We bypass jwa entirely and
 *   implement JWT signing manually using crypto.createPrivateKey() → KeyObject
 *   → createSign().sign(keyObject).  A KeyObject skips the re-decode step and
 *   works correctly on all OpenSSL versions.
 */

import crypto from "crypto";
import { BigQuery } from "@google-cloud/bigquery";

// ── Manual JWT / OAuth2 token generation ─────────────────────────────────────
// Cached access token to avoid a round-trip on every query
let _accessToken   = null;
let _tokenExpiryTs = 0;   // Unix seconds

function b64url(buf) {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function fetchAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  // Return cached token if it still has >60 s of life
  if (_accessToken && now < _tokenExpiryTs - 60) return _accessToken;

  const iat = now;
  const exp = now + 3600;

  const header  = b64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = b64url(Buffer.from(JSON.stringify({
    iss:   credentials.client_email,
    sub:   credentials.client_email,
    aud:   "https://oauth2.googleapis.com/token",
    scope: "https://www.googleapis.com/auth/bigquery",
    iat,
    exp,
  })));

  const signingInput = `${header}.${payload}`;

  // ── KEY FIX: createPrivateKey() returns a KeyObject; passing a KeyObject to
  // ── signer.sign() bypasses OpenSSL 3's PEM decoder and avoids the
  // ── "DECODER routines::unsupported" error that occurs when a raw PEM string
  // ── is passed to .sign() on Node 18+ / OpenSSL 3.x.
  const privateKey = crypto.createPrivateKey({
    key:    credentials.private_key,
    format: "pem",
  });

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = b64url(signer.sign(privateKey));

  const jwt = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[BigQuery] Token exchange failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  _accessToken   = data.access_token;
  _tokenExpiryTs = exp;
  console.log("[BigQuery] Access token refreshed ✓");
  return _accessToken;
}

// ── Auth client passed to BigQuery SDK ───────────────────────────────────────
function makeAuthClient(credentials) {
  return {
    // BigQuery SDK calls this to get the Authorization header
    async getRequestHeaders() {
      const token = await fetchAccessToken(credentials);
      return { Authorization: `Bearer ${token}` };
    },
    // Required stub — SDK may call this during initialisation
    async getClient() { return this; },
  };
}

// ── Client singleton ──────────────────────────────────────────────────────────
let _client = null;

export function getBigQueryClient() {
  if (_client) return _client;

  const projectId = process.env.BIGQUERY_PROJECT_ID;
  if (!projectId) {
    throw new Error("BIGQUERY_PROJECT_ID is not set. Add it to .env.local");
  }

  const credentialsJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (credentialsJson) {
    // Production: parse credentials and build a manual auth client that uses
    // KeyObject-based JWT signing (OpenSSL 3.0 compatible).
    let credentials;
    try {
      credentials = JSON.parse(credentialsJson);
    } catch {
      throw new Error("BIGQUERY_CREDENTIALS_JSON is not valid JSON");
    }
    // Fix any literal \n sequences that Vercel may inject when storing the env var
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }

    _client = new BigQuery({ projectId, authClient: makeAuthClient(credentials) });
  } else {
    // Local dev: uses GOOGLE_APPLICATION_CREDENTIALS path or ADC
    _client = new BigQuery({ projectId });
  }

  return _client;
}

export const DATASET = process.env.BIGQUERY_DATASET || "optionsgyani";
export const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;

/**
 * Check if BigQuery is configured (credentials + project available)
 */
export function isBigQueryConfigured() {
  return !!(
    process.env.BIGQUERY_PROJECT_ID &&
    (process.env.BIGQUERY_CREDENTIALS_JSON ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS)
  );
}

/**
 * Run a parameterised BigQuery query and return rows.
 * @param {string} sql
 * @param {Object} params  — named params used with @param_name in SQL
 * @returns {Promise<Array>}
 */
export async function runQuery(sql, params = {}) {
  const bq = getBigQueryClient();

  const queryParams = {};
  const types = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        queryParams[key] = value;
        types[key] = "INT64";
      } else {
        queryParams[key] = value;
        types[key] = "FLOAT64";
      }
    } else if (value instanceof Date) {
      queryParams[key] = value.toISOString().split("T")[0];
      types[key] = "DATE";
    } else if (Array.isArray(value)) {
      queryParams[key] = value;
      // Infer array element type from first element
      if (value.length > 0) {
        if (typeof value[0] === "number") {
          types[key] = { type: "ARRAY", arrayType: "FLOAT64" };
        } else {
          types[key] = { type: "ARRAY", arrayType: "STRING" };
        }
      }
    } else {
      queryParams[key] = value;
      types[key] = "STRING";
    }
  }

  const options = {
    query: sql,
    params: queryParams,
    types,
    location: "asia-south1", // Mumbai — closest to NSE data
  };

  const [rows] = await bq.query(options);
  return rows;
}

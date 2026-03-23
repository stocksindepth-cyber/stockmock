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
 * Key format note:
 *   Google sometimes issues PKCS#1 RSA keys ("-----BEGIN RSA PRIVATE KEY-----").
 *   OpenSSL 3.0 on Linux / Node 18+ (Vercel) cannot use PKCS#1 keys when a raw
 *   PEM string is passed to crypto.createSign().sign() — it throws:
 *     error:1E08010C:DECODER routines::unsupported  (ERR_OSSL_UNSUPPORTED)
 *   macOS (LibreSSL / older OpenSSL) handles PKCS#1 fine, so this only fails on
 *   Vercel.  Fix: detect PKCS#1 and convert → PKCS#8 ("BEGIN PRIVATE KEY") using
 *   crypto.createPrivateKey() + keyObject.export(), which OpenSSL 3 supports.
 */

import crypto from "crypto";
import { BigQuery } from "@google-cloud/bigquery";

// ── Pure-JS PKCS#1 → PKCS#8 conversion ───────────────────────────────────────
// OpenSSL 3 (Node 18+, Node 24 on Vercel) rejects PKCS#1 RSA keys
// ("BEGIN RSA PRIVATE KEY") both when passed to createSign().sign() AND when
// loading with createPrivateKey() — the legacy provider is disabled by default.
//
// Fix: wrap the raw PKCS#1 DER bytes in a PKCS#8 ASN.1 shell using only
// Buffer operations. No OpenSSL calls → works on every Node version.
//
// PKCS#8 PrivateKeyInfo structure (RFC 5958):
//   SEQUENCE {
//     INTEGER 0                       -- version
//     SEQUENCE {                      -- AlgorithmIdentifier
//       OID 1.2.840.113549.1.1.1      -- rsaEncryption
//       NULL
//     }
//     OCTET STRING { <pkcs1 DER> }    -- privateKey
//   }

function asn1Len(tag, len) {
  if (len < 0x80)   return Buffer.from([tag, len]);
  if (len < 0x100)  return Buffer.from([tag, 0x81, len]);
  return Buffer.from([tag, 0x82, len >> 8, len & 0xff]);
}

function pkcs1ToPkcs8(pkcs1Der) {
  // AlgorithmIdentifier for rsaEncryption (fixed 15-byte sequence)
  const algId   = Buffer.from("300d06092a864886f70d0101010500", "hex");
  const ver     = Buffer.from([0x02, 0x01, 0x00]);                      // INTEGER 0
  const octet   = Buffer.concat([asn1Len(0x04, pkcs1Der.length), pkcs1Der]);
  const inner   = Buffer.concat([ver, algId, octet]);
  return Buffer.concat([asn1Len(0x30, inner.length), inner]);
}

function normalizePrivateKey(pem) {
  if (!pem) return pem;
  const fixed = pem.replace(/\\n/g, "\n");
  const isPKCS1 = fixed.includes("BEGIN RSA PRIVATE KEY");
  console.log(`[BigQuery] key: ${isPKCS1 ? "PKCS#1→converting" : "PKCS#8 ok"} Node ${process.version}`);
  if (!isPKCS1) return fixed;

  // Extract raw DER (strip PEM header/footer, decode base64)
  const b64     = fixed.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const der     = Buffer.from(b64, "base64");
  const pkcs8   = pkcs1ToPkcs8(der);
  const wrapped = pkcs8.toString("base64").match(/.{1,64}/g).join("\n");
  console.log("[BigQuery] PKCS#1→PKCS#8 (pure-JS) done ✓");
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
}

let _client = null;

export function getBigQueryClient() {
  if (_client) return _client;

  const projectId = process.env.BIGQUERY_PROJECT_ID;
  if (!projectId) {
    throw new Error("BIGQUERY_PROJECT_ID is not set. Add it to .env.local");
  }

  const credentialsJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (credentialsJson) {
    let credentials;
    try {
      credentials = JSON.parse(credentialsJson);
    } catch {
      throw new Error("BIGQUERY_CREDENTIALS_JSON is not valid JSON");
    }
    credentials.private_key = normalizePrivateKey(credentials.private_key);
    _client = new BigQuery({ projectId, credentials });
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

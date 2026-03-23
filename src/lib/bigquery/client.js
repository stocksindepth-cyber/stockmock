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

/**
 * If the private_key is in PKCS#1 format ("BEGIN RSA PRIVATE KEY"), convert it
 * to PKCS#8 ("BEGIN PRIVATE KEY") so OpenSSL 3.0 on Node 18+ can use it.
 * PKCS#8 is supported by OpenSSL 3's default provider; PKCS#1 is not.
 */
function normalizePrivateKey(pem) {
  if (!pem) return pem;
  // Fix any literal \n sequences Vercel may inject
  const fixed = pem.replace(/\\n/g, "\n");
  if (!fixed.includes("BEGIN RSA PRIVATE KEY")) return fixed; // already PKCS#8
  // Convert PKCS#1 → PKCS#8
  const keyObj = crypto.createPrivateKey({ key: fixed, format: "pem" });
  const pkcs8  = keyObj.export({ type: "pkcs8", format: "pem" }).toString();
  console.log("[BigQuery] Converted PKCS#1 key → PKCS#8 for OpenSSL 3 compatibility");
  return pkcs8;
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

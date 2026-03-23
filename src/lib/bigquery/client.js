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
 */

import { BigQuery } from "@google-cloud/bigquery";

let _client = null;

export function getBigQueryClient() {
  if (_client) return _client;

  const projectId = process.env.BIGQUERY_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "BIGQUERY_PROJECT_ID is not set. Add it to .env.local"
    );
  }

  const credentialsJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (credentialsJson) {
    // Production: credentials stored as JSON string in env var
    let credentials;
    try {
      credentials = JSON.parse(credentialsJson);
    } catch {
      throw new Error("BIGQUERY_CREDENTIALS_JSON is not valid JSON");
    }
    // Vercel stores env vars as plain strings — escaped \n in the private key
    // become literal backslash-n, which breaks OpenSSL's key parser (ERR_OSSL_UNSUPPORTED).
    // Replace any remaining literal \n sequences with real newlines.
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }
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

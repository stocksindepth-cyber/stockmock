/**
 * Unified market data router — Yahoo Finance for all symbols.
 *
 * Yahoo Finance works from any IP (no Akamai bot protection like NSE).
 * Data is ~15 min delayed during market hours on the free tier.
 *
 * Supported: NIFTY, BANKNIFTY, FINNIFTY, SENSEX
 *
 * NOTE: fetchOptionChain now takes (symbol, expiry) — Yahoo requires the
 * expiry to fetch the right chain; it does not return all expiries in one call.
 * transformChain takes only (raw) — no expiry filtering needed server-side.
 */

import {
  YAHOO_UNDERLYING,
  fetchExpiryList  as yahooExpiries,
  fetchSpot        as yahooSpot,
  fetchOptionChain as yahooChain,
  transformChain   as yahooTransform,
} from "./yahooApi";

// lotSize lookup for downstream consumers
export const UNDERLYING = Object.fromEntries(
  Object.entries(YAHOO_UNDERLYING).map(([k, v]) => [k, { lotSize: v.lotSize }])
);

export async function fetchExpiryList(symbol) {
  return yahooExpiries(symbol);
}

export async function fetchSpot(symbol) {
  return yahooSpot(symbol);
}

// expiry: ISO date string "2025-05-29"
export async function fetchOptionChain(symbol, expiry) {
  return yahooChain(symbol, expiry);
}

export function transformChain(raw) {
  return yahooTransform(raw);
}

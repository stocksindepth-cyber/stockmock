/**
 * Unified market data router — NSE (NIFTY family) and BSE (SENSEX/BANKEX).
 *
 * All consumers import from here.  The router tags raw responses with _src
 * so transformChain can pick the right parser without callers needing to
 * know which exchange a symbol belongs to.
 *
 *   NSE symbols: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY
 *   BSE symbols: SENSEX, BANKEX
 */

import {
  UNDERLYING as NSE_UNDERLYING,
  fetchOptionChain as nseChain,
  fetchExpiryList  as nseExpiries,
  fetchSpot        as nseSpot,
  transformChain   as nseTransform,
} from "./nseApi";

import {
  BSE_UNDERLYING,
  fetchOptionChain as bseChain,
  fetchExpiryList  as bseExpiries,
  fetchSpot        as bseSpot,
  transformChain   as bseTransform,
} from "./bseApi";

// Combined symbol registry for validation and lot-size lookup
export const UNDERLYING = { ...NSE_UNDERLYING, ...BSE_UNDERLYING };

const isBSE = (symbol) => symbol in BSE_UNDERLYING;

// ── Option chain ──────────────────────────────────────────────────────────────
// Returns a tagged wrapper so transformChain can dispatch correctly
export async function fetchOptionChain(symbol) {
  if (isBSE(symbol)) {
    return { _src: "bse", raw: await bseChain(symbol) };
  }
  return { _src: "nse", raw: await nseChain(symbol) };
}

// ── Expiry list ───────────────────────────────────────────────────────────────
export async function fetchExpiryList(symbol) {
  return isBSE(symbol) ? bseExpiries(symbol) : nseExpiries(symbol);
}

// ── Spot price ────────────────────────────────────────────────────────────────
export async function fetchSpot(symbol) {
  return isBSE(symbol) ? bseSpot(symbol) : nseSpot(symbol);
}

// ── Transform ─────────────────────────────────────────────────────────────────
// tagged is the object returned by fetchOptionChain above
export function transformChain(tagged, expiry) {
  if (tagged._src === "bse") return bseTransform(tagged.raw, expiry);
  return nseTransform(tagged.raw, expiry);
}

/**
 * Dhan API v2 — Server-Side Integration
 * 
 * Based on official docs: https://dhanhq.co/docs/v2/
 * 
 * This module runs ONLY on the server (Route Handlers).
 * The access token never reaches the client.
 */

const DHAN_BASE = "https://api.dhan.co/v2";

// ── Token management ─────────────────────────────────────────────────────────
// Token is read from env var first; if absent, fetched from Firestore admin/dhan
// This lets you update the token without redeploying.
let _tokenCache    = null;
let _tokenCachedAt = 0;
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // re-read Firestore every 5 min

export function invalidateDhanTokenCache() {
  _tokenCache    = null;
  _tokenCachedAt = 0;
}

async function getToken() {
  // 1. Env var (local dev / Vercel env)
  if (process.env.DHAN_ACCESS_TOKEN) return process.env.DHAN_ACCESS_TOKEN;

  // 2. In-memory cache
  if (_tokenCache && Date.now() - _tokenCachedAt < TOKEN_CACHE_TTL) return _tokenCache;

  // 3. Firestore admin/dhan document
  try {
    const { getAdminFirestore } = await import("../firebase/admin.js");
    const db  = getAdminFirestore();
    const doc = await db.doc("admin/dhan").get();
    if (doc.exists && doc.data()?.accessToken) {
      _tokenCache    = doc.data().accessToken;
      _tokenCachedAt = Date.now();
      return _tokenCache;
    }
  } catch (err) {
    console.error("[Dhan] Failed to read token from Firestore:", err.message);
  }

  throw new Error("Dhan access token not configured. Set DHAN_ACCESS_TOKEN or update admin/dhan in Firestore.");
}

async function headers() {
  const token    = await getToken();
  const clientId = process.env.NEXT_PUBLIC_DHAN_CLIENT_ID;
  if (!clientId) throw new Error("NEXT_PUBLIC_DHAN_CLIENT_ID not set");
  return {
    "Content-Type":  "application/json",
    "Accept":        "application/json",
    "access-token":  token,
    "client-id":     clientId,
  };
}

async function dhanPost(endpoint, body) {
  const res = await fetch(`${DHAN_BASE}${endpoint}`, {
    method:  "POST",
    headers: await headers(),
    body:    JSON.stringify(body),
    cache:   "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dhan API ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Security ID mapping (Dhan-specific) ──
export const UNDERLYING = {
  NIFTY:     { secId: 13,  seg: "IDX_I", lotSize: 75 },
  BANKNIFTY: { secId: 25,  seg: "IDX_I", lotSize: 15 },
  FINNIFTY:  { secId: 27,  seg: "IDX_I", lotSize: 25 },
  MIDCPNIFTY:{ secId: 442, seg: "IDX_I", lotSize: 50 },
  SENSEX:    { secId: 1,   seg: "IDX_I", lotSize: 10 },
};

// Index equity security IDs for LTP (NSE_EQ segment)
export const INDEX_EQ_IDS = {
  NIFTY: 13,
  BANKNIFTY: 25,
  FINNIFTY: 27,
};

// ── 1. Option Chain ──
export async function fetchOptionChain(symbol, expiry) {
  const ul = UNDERLYING[symbol];
  if (!ul) throw new Error(`Unknown symbol: ${symbol}`);
  return dhanPost("/optionchain", {
    UnderlyingScrip: ul.secId,
    UnderlyingSeg: ul.seg,
    Expiry: expiry,
  });
}

// ── 2. Expiry List ──
export async function fetchExpiryList(symbol) {
  const ul = UNDERLYING[symbol];
  if (!ul) throw new Error(`Unknown symbol: ${symbol}`);
  return dhanPost("/optionchain/expirylist", {
    UnderlyingScrip: ul.secId,
    UnderlyingSeg: ul.seg,
  });
}

// ── 3. Ticker (LTP) ──
export async function fetchLTP(segmentMap) {
  // segmentMap: { "NSE_EQ": [13], "NSE_FNO": [49081] }
  return dhanPost("/marketfeed/ltp", segmentMap);
}

// ── 4. OHLC ──
export async function fetchOHLC(segmentMap) {
  return dhanPost("/marketfeed/ohlc", segmentMap);
}

// ── 5. Market Depth (full quote) ──
export async function fetchMarketDepth(segmentMap) {
  return dhanPost("/marketfeed/quote", segmentMap);
}

// ── Transform Dhan option chain → our internal format ──
export function transformChain(dhanRes) {
  if (dhanRes.status !== "success" || !dhanRes.data) {
    throw new Error("Invalid Dhan response");
  }

  const spot = dhanRes.data.last_price;
  const ocData = dhanRes.data.oc;
  const chain = [];

  for (const [strikeStr, sides] of Object.entries(ocData)) {
    const strike = parseFloat(strikeStr);
    const ce = sides.ce || {};
    const pe = sides.pe || {};

    chain.push({
      strike,
      ce: {
        ltp: ce.last_price || 0,
        iv: parseFloat((ce.implied_volatility || 0).toFixed(2)),
        oi: ce.oi || 0,
        oiChange: (ce.oi || 0) - (ce.previous_oi || 0),
        volume: ce.volume || 0,
        delta: ce.greeks?.delta ? parseFloat(ce.greeks.delta.toFixed(4)) : 0,
        gamma: ce.greeks?.gamma ? parseFloat(ce.greeks.gamma.toFixed(5)) : 0,
        theta: ce.greeks?.theta ? parseFloat(ce.greeks.theta.toFixed(2)) : 0,
        vega: ce.greeks?.vega ? parseFloat(ce.greeks.vega.toFixed(2)) : 0,
        bidPrice: ce.top_bid_price || 0,
        askPrice: ce.top_ask_price || 0,
        bidQty: ce.top_bid_quantity || 0,
        askQty: ce.top_ask_quantity || 0,
        securityId: ce.security_id || 0,
      },
      pe: {
        ltp: pe.last_price || 0,
        iv: parseFloat((pe.implied_volatility || 0).toFixed(2)),
        oi: pe.oi || 0,
        oiChange: (pe.oi || 0) - (pe.previous_oi || 0),
        volume: pe.volume || 0,
        delta: pe.greeks?.delta ? parseFloat(pe.greeks.delta.toFixed(4)) : 0,
        gamma: pe.greeks?.gamma ? parseFloat(pe.greeks.gamma.toFixed(5)) : 0,
        theta: pe.greeks?.theta ? parseFloat(pe.greeks.theta.toFixed(2)) : 0,
        vega: pe.greeks?.vega ? parseFloat(pe.greeks.vega.toFixed(2)) : 0,
        bidPrice: pe.top_bid_price || 0,
        askPrice: pe.top_ask_price || 0,
        bidQty: pe.top_bid_quantity || 0,
        askQty: pe.top_ask_quantity || 0,
        securityId: pe.security_id || 0,
      },
      isATM: false,
    });
  }

  // Sort by strike
  chain.sort((a, b) => a.strike - b.strike);

  // Mark ATM
  let atmStrike = chain[0]?.strike || spot;
  let minDiff = Infinity;
  for (const row of chain) {
    const diff = Math.abs(row.strike - spot);
    if (diff < minDiff) {
      minDiff = diff;
      atmStrike = row.strike;
    }
  }
  const atmRow = chain.find((r) => r.strike === atmStrike);
  if (atmRow) atmRow.isATM = true;

  return { spot, chain, atmStrike };
}

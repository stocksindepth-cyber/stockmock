/**
 * Yahoo Finance — Option Chain, Expiry List, Spot Price
 *
 * Works from any IP (no Akamai bot protection).
 * Data is ~15 min delayed during market hours on the free tier.
 *
 * Supported symbols: NIFTY, BANKNIFTY, FINNIFTY, SENSEX
 */

const YAHOO_BASE = "https://query1.finance.yahoo.com";

export const YAHOO_UNDERLYING = {
  NIFTY:     { yahooSymbol: "^NSEI",    lotSize: 75 },
  BANKNIFTY: { yahooSymbol: "^NSEBANK", lotSize: 15 },
  FINNIFTY:  { yahooSymbol: "^CNXFIN",  lotSize: 25 },
  SENSEX:    { yahooSymbol: "^BSESN",   lotSize: 10 },
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
};

async function yahooGet(yahooSymbol, expiryTs, timeoutMs = 10_000) {
  const encoded = encodeURIComponent(yahooSymbol);
  const url = expiryTs
    ? `${YAHOO_BASE}/v7/finance/options/${encoded}?date=${expiryTs}&formatted=false`
    : `${YAHOO_BASE}/v7/finance/options/${encoded}?formatted=false`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ISO date "2025-05-29" → Unix timestamp (Yahoo uses UTC midnight)
function isoToTs(expiry) {
  return Math.floor(new Date(expiry + "T00:00:00Z").getTime() / 1000);
}

// Unix timestamp → ISO date
function tsToIso(ts) {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

// ── Expiry list ───────────────────────────────────────────────────────────────
export async function fetchExpiryList(symbol) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);

  const data = await yahooGet(ul.yahooSymbol);
  const result = data?.optionChain?.result?.[0];

  if (!result) {
    const desc = data?.optionChain?.error?.description ?? "No data returned";
    throw new Error(`Yahoo Finance: ${desc} (${symbol})`);
  }

  const expiries = (result.expirationDates ?? []).map(tsToIso).sort();
  if (!expiries.length) throw new Error(`Yahoo returned no expiry dates for ${symbol}`);
  return expiries;
}

// ── Spot price ────────────────────────────────────────────────────────────────
export async function fetchSpot(symbol) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);

  const data = await yahooGet(ul.yahooSymbol);
  const spot = data?.optionChain?.result?.[0]?.quote?.regularMarketPrice;
  if (!spot) throw new Error(`Yahoo returned no spot price for ${symbol}`);
  return spot;
}

// ── Option chain ──────────────────────────────────────────────────────────────
// expiry: ISO date "2025-05-29" (required)
export async function fetchOptionChain(symbol, expiry) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);
  return yahooGet(ul.yahooSymbol, expiry ? isoToTs(expiry) : undefined);
}

// ── Transform ─────────────────────────────────────────────────────────────────
const emptySide = () => ({
  ltp: 0, iv: 0, oi: 0, oiChange: 0, volume: 0,
  delta: 0, gamma: 0, theta: 0, vega: 0,
  bidPrice: 0, askPrice: 0, bidQty: 0, askQty: 0, securityId: 0,
});

export function transformChain(yahooData) {
  const result = yahooData?.optionChain?.result?.[0];
  if (!result) throw new Error("No Yahoo Finance option chain data");

  const spot    = result.quote?.regularMarketPrice ?? 0;
  const options = result.options?.[0];
  if (!options) throw new Error("Yahoo Finance returned no options for this expiry");

  const calls = options.calls ?? [];
  const puts  = options.puts  ?? [];

  const strikeMap = new Map();

  for (const c of calls) {
    const s = c.strike;
    if (!strikeMap.has(s)) strikeMap.set(s, { strike: s, ce: emptySide(), pe: emptySide(), isATM: false });
    strikeMap.get(s).ce = {
      ltp:      c.lastPrice ?? 0,
      iv:       parseFloat(((c.impliedVolatility ?? 0) * 100).toFixed(2)),
      oi:       c.openInterest ?? 0,
      oiChange: 0,
      volume:   c.volume  ?? 0,
      delta: 0, gamma: 0, theta: 0, vega: 0,
      bidPrice: c.bid ?? 0,
      askPrice: c.ask ?? 0,
      bidQty: 0, askQty: 0, securityId: 0,
    };
  }

  for (const p of puts) {
    const s = p.strike;
    if (!strikeMap.has(s)) strikeMap.set(s, { strike: s, ce: emptySide(), pe: emptySide(), isATM: false });
    strikeMap.get(s).pe = {
      ltp:      p.lastPrice ?? 0,
      iv:       parseFloat(((p.impliedVolatility ?? 0) * 100).toFixed(2)),
      oi:       p.openInterest ?? 0,
      oiChange: 0,
      volume:   p.volume  ?? 0,
      delta: 0, gamma: 0, theta: 0, vega: 0,
      bidPrice: p.bid ?? 0,
      askPrice: p.ask ?? 0,
      bidQty: 0, askQty: 0, securityId: 0,
    };
  }

  if (!strikeMap.size) throw new Error("Yahoo Finance returned no option strikes");

  const chain = [...strikeMap.values()].sort((a, b) => a.strike - b.strike);

  // ATM
  let atmStrike = chain[0]?.strike ?? spot;
  let minDiff = Infinity;
  for (const row of chain) {
    const d = Math.abs(row.strike - spot);
    if (d < minDiff) { minDiff = d; atmStrike = row.strike; }
  }
  const atm = chain.find((r) => r.strike === atmStrike);
  if (atm) atm.isATM = true;

  return { spot, chain, atmStrike };
}

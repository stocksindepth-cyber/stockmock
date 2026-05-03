/**
 * NSE India — Option Chain, Expiry List, and Spot Price
 *
 * NSE's public API requires a browser-like session (cookies + Referer).
 * We establish a session by visiting the homepage, then reuse its cookies
 * for up to 90 seconds before refreshing. On 401/403/429 we force a
 * re-auth and retry once.
 *
 * Supported symbols: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY
 * (SENSEX is on BSE — not available via NSE)
 */

const NSE_BASE = "https://www.nseindia.com";

// Lot sizes are exchange-defined and change rarely (update manually when NSE revises them).
// SENSEX/BANKEX are BSE symbols — handled by bseApi.js, not here.
export const UNDERLYING = {
  NIFTY:      { lotSize: 75  },
  BANKNIFTY:  { lotSize: 15  },
  FINNIFTY:   { lotSize: 25  },
  MIDCPNIFTY: { lotSize: 50  },
};

// NSE allIndices field name for each symbol
const INDEX_NAMES = {
  NIFTY:      "NIFTY 50",
  BANKNIFTY:  "NIFTY BANK",
  FINNIFTY:   "NIFTY FIN SERVICE",
  MIDCPNIFTY: "NIFTY MIDCAP SELECT",
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:          "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Referer:         "https://www.nseindia.com/",
  Connection:      "keep-alive",
};

// ── Session (in-process cookie cache) ────────────────────────────────────────
let _cookies  = "";
let _sessionAt = 0;
let _refreshing = null; // deduplicate concurrent session refreshes
const SESSION_TTL = 90_000; // NSE sessions last ~90 s

function extractCookies(headers) {
  // Node 18+ / undici exposes getSetCookie(); fall back to raw header split
  const vals =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") ?? "").split(/,(?=\s*[A-Za-z_-]+=)/);
  return vals.map((c) => c.split(";")[0].trim()).filter(Boolean).join("; ");
}

async function doRefresh() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const r1 = await fetch(`${NSE_BASE}/`, {
      headers: HEADERS,
      cache: "no-store",
      signal: controller.signal,
    });
    _cookies = extractCookies(r1.headers);

    // Warm-up: NSE expects at least one page visit before accepting API calls
    await fetch(`${NSE_BASE}/market-data/live-equity-market?symbol=NIFTY`, {
      headers: { ...HEADERS, Cookie: _cookies },
      cache: "no-store",
      signal: controller.signal,
    });
    _sessionAt = Date.now();
  } finally {
    clearTimeout(timer);
    _refreshing = null;
  }
}

async function getSession() {
  if (_cookies && Date.now() - _sessionAt < SESSION_TTL) return _cookies;
  if (!_refreshing) _refreshing = doRefresh();
  await _refreshing;
  return _cookies;
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function nseGet(path, timeoutMs = 12_000) {
  const doFetch = async (cookies) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(`${NSE_BASE}${path}`, {
        headers: { ...HEADERS, Cookie: cookies },
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  let res = await doFetch(await getSession());

  // On auth / rate-limit errors, force a fresh session and retry once
  if (res.status === 401 || res.status === 403 || res.status === 429) {
    _sessionAt = 0;
    res = await doFetch(await getSession());
  }

  if (!res.ok) throw new Error(`NSE HTTP ${res.status}`);
  return res.json();
}

// ── Date helpers ──────────────────────────────────────────────────────────────
const MONTH_NUM = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4,  May: 5,  Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
const MONTH_ABBR = Object.keys(MONTH_NUM);

// "24-Apr-2025" → "2025-04-24"
function nseToIso(d) {
  const [day, mon, yr] = d.split("-");
  return `${yr}-${String(MONTH_NUM[mon]).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// "2025-04-24" → "24-Apr-2025"
function isoToNse(d) {
  const [yr, mo, day] = d.split("-");
  return `${day}-${MONTH_ABBR[parseInt(mo) - 1]}-${yr}`;
}

// ── Option chain ──────────────────────────────────────────────────────────────
// NSE returns ALL expiries in a single call; caller must pass expiry to transformChain
export async function fetchOptionChain(symbol) {
  const ul = UNDERLYING[symbol];
  if (!ul) throw new Error(`Unknown symbol: ${symbol}`);
  if (ul.bse) throw new Error(`${symbol} is listed on BSE — use BSE API for its option chain`);
  return nseGet(`/api/option-chain-indices?symbol=${encodeURIComponent(symbol)}`);
}

// ── Expiry list ───────────────────────────────────────────────────────────────
export async function fetchExpiryList(symbol) {
  const res = await fetchOptionChain(symbol);
  return (res?.records?.expiryDates ?? []).map(nseToIso).sort();
}

// ── Spot price (lightweight — uses allIndices, not full option chain) ─────────
export async function fetchSpot(symbol) {
  const indexName = INDEX_NAMES[symbol];
  if (!indexName) throw new Error(`No NSE index mapping for ${symbol}`);
  const res = await nseGet("/api/allIndices");
  const row = (res?.data ?? []).find(
    (d) => d.index === indexName || d.indexSymbol === indexName
  );
  if (!row) throw new Error(`${indexName} not found in NSE allIndices response`);
  // NSE uses 'last' in allIndices
  const spot = row.last ?? row.lastPrice ?? row.indexClosePrice;
  if (!spot) throw new Error(`No last price for ${indexName}`);
  return spot;
}

// ── Transform NSE response → internal chain format ────────────────────────────
const emptySide = () => ({
  ltp: 0, iv: 0, oi: 0, oiChange: 0, volume: 0,
  delta: 0, gamma: 0, theta: 0, vega: 0,
  bidPrice: 0, askPrice: 0, bidQty: 0, askQty: 0, securityId: 0,
});

export function transformChain(nseRes, expiry) {
  const allData = nseRes?.records?.data ?? [];
  const spot    = nseRes?.records?.underlyingValue ?? 0;
  const target  = expiry ? isoToNse(expiry) : null;

  const rows = target ? allData.filter((r) => r.expiryDate === target) : allData;

  const strikeMap = new Map();
  for (const row of rows) {
    const s = row.strikePrice;
    if (!strikeMap.has(s)) {
      strikeMap.set(s, { strike: s, ce: emptySide(), pe: emptySide(), isATM: false });
    }
    const entry = strikeMap.get(s);

    if (row.CE) {
      const c = row.CE;
      entry.ce = {
        ltp:        c.lastPrice             || 0,
        iv:         parseFloat((c.impliedVolatility  || 0).toFixed(2)),
        oi:         c.openInterest          || 0,
        oiChange:   c.changeinOpenInterest  || 0,
        volume:     c.totalTradedVolume     || 0,
        delta: 0, gamma: 0, theta: 0, vega: 0,
        bidPrice:   c.bidprice              || 0,
        askPrice:   c.askPrice              || 0,
        bidQty:     c.bidQty                || 0,
        askQty:     c.askQty                || 0,
        securityId: 0,
      };
    }
    if (row.PE) {
      const p = row.PE;
      entry.pe = {
        ltp:        p.lastPrice             || 0,
        iv:         parseFloat((p.impliedVolatility  || 0).toFixed(2)),
        oi:         p.openInterest          || 0,
        oiChange:   p.changeinOpenInterest  || 0,
        volume:     p.totalTradedVolume     || 0,
        delta: 0, gamma: 0, theta: 0, vega: 0,
        bidPrice:   p.bidprice              || 0,
        askPrice:   p.askPrice              || 0,
        bidQty:     p.bidQty                || 0,
        askQty:     p.askQty                || 0,
        securityId: 0,
      };
    }
  }

  if (strikeMap.size === 0) {
    throw new Error(`NSE returned no option chain data${target ? ` for expiry ${expiry}` : ""}`);
  }

  const chain = [...strikeMap.values()].sort((a, b) => a.strike - b.strike);

  // Mark ATM strike
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

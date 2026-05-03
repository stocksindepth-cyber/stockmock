/**
 * Yahoo Finance — Option Chain, Expiry List, Spot Price
 *
 * Yahoo requires crumb + cookie authentication (since 2023).
 * Session is established by hitting finance.yahoo.com once, then
 * fetching the crumb. Works from any IP; no Akamai block.
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
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

// ── Session / crumb management ─────────────────────────────────────────────────
let _cookies   = "";
let _crumb     = "";
let _sessionAt = 0;
let _refreshing = null;

const SESSION_TTL = 55 * 60_000; // refresh crumb every 55 min

function extractCookies(headers) {
  const vals =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") ?? "").split(/,(?=\s*[A-Za-z_-]+=)/);
  return vals.map((c) => c.split(";")[0].trim()).filter(Boolean).join("; ");
}

async function doRefresh() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15_000);
  try {
    // fc.yahoo.com is Yahoo's dedicated first-cookie endpoint — sets the A1/A3
    // API cookies directly without a GDPR consent wall (unlike finance.yahoo.com)
    const r1 = await fetch("https://fc.yahoo.com", {
      headers: HEADERS,
      signal: ctrl.signal,
    });
    const jar = extractCookies(r1.headers);

    // Fetch crumb; try query1 first, fall back to query2
    const fetchCrumb = async (base) => {
      const r = await fetch(`${base}/v1/test/getcrumb`, {
        headers: { ...HEADERS, Cookie: jar },
        signal: ctrl.signal,
      });
      return (await r.text()).trim();
    };

    let crumb = await fetchCrumb(YAHOO_BASE);
    if (!crumb || crumb.startsWith("<") || crumb.startsWith("{") || crumb.length < 5) {
      crumb = await fetchCrumb("https://query2.finance.yahoo.com");
    }
    if (!crumb || crumb.startsWith("<") || crumb.startsWith("{") || crumb.length < 5) {
      throw new Error(`Yahoo crumb unavailable (got: ${crumb.slice(0, 60)})`);
    }

    _cookies   = jar;
    _crumb     = crumb;
    _sessionAt = Date.now();
  } finally {
    clearTimeout(t);
    _refreshing = null;
  }
}

async function getSession() {
  if (_crumb && _cookies && Date.now() - _sessionAt < SESSION_TTL) {
    return { cookies: _cookies, crumb: _crumb };
  }
  if (!_refreshing) _refreshing = doRefresh();
  await _refreshing;
  return { cookies: _cookies, crumb: _crumb };
}

// ── HTTP helper ────────────────────────────────────────────────────────────────
async function yahooGet(yahooSymbol, expiryTs, timeoutMs = 12_000) {
  const { cookies, crumb } = await getSession();
  const encoded = encodeURIComponent(yahooSymbol);
  const crumbQ  = `&crumb=${encodeURIComponent(crumb)}`;
  const base    = expiryTs
    ? `${YAHOO_BASE}/v7/finance/options/${encoded}?date=${expiryTs}&formatted=false${crumbQ}`
    : `${YAHOO_BASE}/v7/finance/options/${encoded}?formatted=false${crumbQ}`;

  const doFetch = (url, jar) => {
    const ctrl = new AbortController();
    const t    = setTimeout(() => ctrl.abort(), timeoutMs);
    return fetch(url, {
      headers: { ...HEADERS, Cookie: jar },
      cache: "no-store",
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));
  };

  let res = await doFetch(base, cookies);

  // Crumb expired — force a new session and retry once
  if (res.status === 401) {
    _sessionAt = 0;
    const { cookies: c2, crumb: cr2 } = await getSession();
    const url2 = base.replace(
      `crumb=${encodeURIComponent(crumb)}`,
      `crumb=${encodeURIComponent(cr2)}`
    );
    res = await doFetch(url2, c2);
  }

  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
  return res.json();
}

// ── Date helpers ───────────────────────────────────────────────────────────────
const isoToTs = (expiry) =>
  Math.floor(new Date(expiry + "T00:00:00Z").getTime() / 1000);

const tsToIso = (ts) => new Date(ts * 1000).toISOString().slice(0, 10);

// ── Expiry list ────────────────────────────────────────────────────────────────
export async function fetchExpiryList(symbol) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);

  const data   = await yahooGet(ul.yahooSymbol);
  const result = data?.optionChain?.result?.[0];
  if (!result) {
    const desc = data?.optionChain?.error?.description ?? "No data";
    throw new Error(`Yahoo Finance: ${desc} (${symbol})`);
  }

  const expiries = (result.expirationDates ?? []).map(tsToIso).sort();
  if (!expiries.length) throw new Error(`Yahoo returned no expiry dates for ${symbol}`);
  return expiries;
}

// ── Spot price ─────────────────────────────────────────────────────────────────
export async function fetchSpot(symbol) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);

  const data = await yahooGet(ul.yahooSymbol);
  const spot = data?.optionChain?.result?.[0]?.quote?.regularMarketPrice;
  if (!spot) throw new Error(`Yahoo returned no spot price for ${symbol}`);
  return spot;
}

// ── Option chain ───────────────────────────────────────────────────────────────
export async function fetchOptionChain(symbol, expiry) {
  const ul = YAHOO_UNDERLYING[symbol];
  if (!ul) throw new Error(`No Yahoo Finance mapping for ${symbol}`);
  return yahooGet(ul.yahooSymbol, expiry ? isoToTs(expiry) : undefined);
}

// ── Transform ──────────────────────────────────────────────────────────────────
const emptySide = () => ({
  ltp: 0, iv: 0, oi: 0, oiChange: 0, volume: 0,
  delta: 0, gamma: 0, theta: 0, vega: 0,
  bidPrice: 0, askPrice: 0, bidQty: 0, askQty: 0, securityId: 0,
});

export function transformChain(yahooData) {
  const result  = yahooData?.optionChain?.result?.[0];
  if (!result)   throw new Error("No Yahoo Finance option chain data");

  const spot    = result.quote?.regularMarketPrice ?? 0;
  const options = result.options?.[0];
  if (!options)  throw new Error("Yahoo Finance returned no options for this expiry");

  const calls = options.calls ?? [];
  const puts  = options.puts  ?? [];
  const strikeMap = new Map();

  for (const c of calls) {
    const s = c.strike;
    if (!strikeMap.has(s)) strikeMap.set(s, { strike: s, ce: emptySide(), pe: emptySide(), isATM: false });
    strikeMap.get(s).ce = {
      ltp:      c.lastPrice          ?? 0,
      iv:       parseFloat(((c.impliedVolatility ?? 0) * 100).toFixed(2)),
      oi:       c.openInterest       ?? 0,
      oiChange: 0,
      volume:   c.volume             ?? 0,
      delta: 0, gamma: 0, theta: 0, vega: 0,
      bidPrice: c.bid  ?? 0,
      askPrice: c.ask  ?? 0,
      bidQty: 0, askQty: 0, securityId: 0,
    };
  }

  for (const p of puts) {
    const s = p.strike;
    if (!strikeMap.has(s)) strikeMap.set(s, { strike: s, ce: emptySide(), pe: emptySide(), isATM: false });
    strikeMap.get(s).pe = {
      ltp:      p.lastPrice          ?? 0,
      iv:       parseFloat(((p.impliedVolatility ?? 0) * 100).toFixed(2)),
      oi:       p.openInterest       ?? 0,
      oiChange: 0,
      volume:   p.volume             ?? 0,
      delta: 0, gamma: 0, theta: 0, vega: 0,
      bidPrice: p.bid  ?? 0,
      askPrice: p.ask  ?? 0,
      bidQty: 0, askQty: 0, securityId: 0,
    };
  }

  if (!strikeMap.size) throw new Error("Yahoo Finance returned no option strikes");

  const chain = [...strikeMap.values()].sort((a, b) => a.strike - b.strike);

  let atmStrike = chain[0]?.strike ?? spot;
  let minDiff   = Infinity;
  for (const row of chain) {
    const d = Math.abs(row.strike - spot);
    if (d < minDiff) { minDiff = d; atmStrike = row.strike; }
  }
  const atm = chain.find((r) => r.strike === atmStrike);
  if (atm) atm.isATM = true;

  return { spot, chain, atmStrike };
}

/**
 * BSE India — Option Chain, Expiry List, and Spot Price
 *
 * BSE's public REST API does not require session cookie management like NSE.
 * We send browser-like headers (Origin + Referer) to satisfy their CORS policy
 * on server-side requests, and retry once on transient errors.
 *
 * Supported symbols: SENSEX, BANKEX
 *
 * BSE field naming conventions:
 *   CA_*   = Call / CE side
 *   PA_*   = Put  / PE side
 *   INDX_PRC = underlying index price at time of snapshot
 */

const BSE_API = "https://api.bseindia.com/BseIndiaAPI/api";

export const BSE_UNDERLYING = {
  SENSEX: { scripcode: 1,   lotSize: 10, productType: "IO" },
  BANKEX: { scripcode: 989, lotSize: 15, productType: "IO" },
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:          "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Origin:          "https://www.bseindia.com",
  Referer:         "https://www.bseindia.com/",
  Connection:      "keep-alive",
};

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function bseGet(path, timeoutMs = 12_000) {
  const doFetch = () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(`${BSE_API}${path}`, {
      headers: HEADERS,
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
  };

  let res = await doFetch();

  // One retry on transient server errors
  if (res.status >= 500 || res.status === 429) {
    await new Promise((r) => setTimeout(r, 1500));
    res = await doFetch();
  }

  if (!res.ok) throw new Error(`BSE HTTP ${res.status}`);
  return res.json();
}

// ── Date helpers ──────────────────────────────────────────────────────────────
// BSE returns dates as "09 May 2025" or "09-May-2025" or "09-MAY-2025"
const MONTH_NUM = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4,  May: 5,  Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
const MONTH_ABBR = Object.keys(MONTH_NUM);

function bseToIso(d) {
  if (!d) return null;
  const s = d.trim();
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // "09 May 2025" | "09-May-2025" | "09-MAY-2025"
  const [day, rawMon, yr] = s.split(/[\s-]+/);
  const mon = rawMon.charAt(0).toUpperCase() + rawMon.slice(1).toLowerCase();
  const num = MONTH_NUM[mon];
  if (!num) return null;
  return `${yr}-${String(num).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function isoToBse(iso) {
  const [yr, mo, day] = iso.split("-");
  return `${day} ${MONTH_ABBR[parseInt(mo) - 1]} ${yr}`;
}

// ── Option chain ──────────────────────────────────────────────────────────────
export async function fetchOptionChain(symbol) {
  const ul = BSE_UNDERLYING[symbol];
  if (!ul) throw new Error(`Unknown BSE symbol: ${symbol}`);
  return bseGet(
    `/GetOptionChain/w?scripcode=${ul.scripcode}&optionType=both` +
    `&strikePrice=&mktcap=&Exp=&productType=${ul.productType}`
  );
}

// ── Expiry list ───────────────────────────────────────────────────────────────
export async function fetchExpiryList(symbol) {
  const res = await fetchOptionChain(symbol);

  // Table1 carries the expiry list; if absent, derive from unique dates in Table
  const raw =
    res?.Table1?.length > 0
      ? res.Table1.map((r) => r.EXPDT ?? r.Expdt ?? r.expdt)
      : [...new Set((res?.Table ?? []).map((r) => r.EXPDT).filter(Boolean))];

  const expiries = raw.filter(Boolean).map(bseToIso).filter(Boolean);
  if (!expiries.length) throw new Error(`BSE returned no expiry dates for ${symbol}`);
  return expiries.sort();
}

// ── Spot price ────────────────────────────────────────────────────────────────
// Embedded in every row of the option chain as INDX_PRC
export async function fetchSpot(symbol) {
  const res = await fetchOptionChain(symbol);
  const rows = res?.Table ?? [];
  if (!rows.length) throw new Error(`BSE option chain empty for ${symbol}`);
  const spot = parseFloat(rows[0]?.INDX_PRC);
  if (!spot || !Number.isFinite(spot)) throw new Error(`No spot price in BSE response for ${symbol}`);
  return spot;
}

// ── Transform BSE response → internal chain format ────────────────────────────
const emptySide = () => ({
  ltp: 0, iv: 0, oi: 0, oiChange: 0, volume: 0,
  delta: 0, gamma: 0, theta: 0, vega: 0,
  bidPrice: 0, askPrice: 0, bidQty: 0, askQty: 0, securityId: 0,
});

export function transformChain(bseRes, expiry) {
  const rows   = bseRes?.Table ?? [];
  const target = expiry ? isoToBse(expiry) : null;

  const filtered = target
    ? rows.filter((r) => {
        // Normalise the row date for comparison (BSE may vary casing/separators)
        const rowIso = bseToIso(r.EXPDT ?? "");
        const tgtIso = expiry;
        return rowIso === tgtIso;
      })
    : rows;

  if (!filtered.length) {
    throw new Error(`BSE returned no option data${target ? ` for expiry ${expiry}` : ""}`);
  }

  const spot = parseFloat(filtered[0]?.INDX_PRC) || 0;

  const chain = filtered
    .map((row) => {
      const ce = emptySide();
      const pe = emptySide();

      ce.ltp      = parseFloat(row.CA_LTP)      || 0;
      ce.iv       = parseFloat((parseFloat(row.CA_IV)    || 0).toFixed(2));
      ce.oi       = parseInt(row.CA_OI,   10)   || 0;
      ce.oiChange = parseInt(row.CA_CHNG_OI, 10)|| 0;
      ce.volume   = parseInt(row.CA_TOTAL_QTY, 10) || parseInt(row.CA_VOL, 10) || 0;
      ce.bidPrice = parseFloat(row.CA_BID_PRC)  || 0;
      ce.askPrice = parseFloat(row.CA_ASK_PRC)  || 0;
      ce.bidQty   = parseInt(row.CA_BID_QTY, 10)|| 0;
      ce.askQty   = parseInt(row.CA_ASK_QTY, 10)|| 0;

      pe.ltp      = parseFloat(row.PA_LTP)      || 0;
      pe.iv       = parseFloat((parseFloat(row.PA_IV)    || 0).toFixed(2));
      pe.oi       = parseInt(row.PA_OI,   10)   || 0;
      pe.oiChange = parseInt(row.PA_CHNG_OI, 10)|| 0;
      pe.volume   = parseInt(row.PA_TOTAL_QTY, 10) || parseInt(row.PA_VOL, 10) || 0;
      pe.bidPrice = parseFloat(row.PA_BID_PRC)  || 0;
      pe.askPrice = parseFloat(row.PA_ASK_PRC)  || 0;
      pe.bidQty   = parseInt(row.PA_BID_QTY, 10)|| 0;
      pe.askQty   = parseInt(row.PA_ASK_QTY, 10)|| 0;

      return { strike: parseFloat(row.STRIKE_PRC) || 0, ce, pe, isATM: false };
    })
    .filter((r) => r.strike > 0)
    .sort((a, b) => a.strike - b.strike);

  if (!chain.length) {
    throw new Error(`BSE chain has no valid strikes for ${expiry}`);
  }

  // Mark ATM
  let atmStrike = chain[0].strike;
  let minDiff   = Infinity;
  for (const row of chain) {
    const d = Math.abs(row.strike - spot);
    if (d < minDiff) { minDiff = d; atmStrike = row.strike; }
  }
  const atm = chain.find((r) => r.strike === atmStrike);
  if (atm) atm.isATM = true;

  return { spot, chain, atmStrike };
}

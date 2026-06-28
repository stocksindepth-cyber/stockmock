/**
 * Option chain cache — Dhan API primary, synthetic fallback.
 *
 * Dhan returns real exchange data: live LTP, real OI, real IV, exchange-computed
 * Greeks. When Dhan is unavailable (token expired, weekend, off-hours) we fall
 * back to the synthetic Black-Scholes engine so the UI is always functional.
 *
 * TTL: 15 s during market hours, 5 min outside (same as before).
 * Dedup: concurrent requests for the same key share one build.
 * Rate-limit guard: min 3 s between live fetches per symbol+expiry.
 */

import {
  fetchOptionChain as dhanFetch,
  transformChain   as dhanTransform,
  fetchExpiryList  as dhanExpiryList,
  UNDERLYING       as DHAN_UNDERLYING,
} from "./dhanApi";
import {
  SYMBOL_CONFIG,
  generateExpiries,
  buildChain,
  baselineSpot,
} from "./syntheticChain";
import { LOT_SIZES } from "../nse/constants";

// Re-export UNDERLYING shape so callers (e.g. /api/chain) don't need to know
// which source is active.
export const UNDERLYING = Object.fromEntries(
  Object.keys(SYMBOL_CONFIG).map((k) => [k, { lotSize: LOT_SIZES[k] ?? 50 }])
);

const cache     = new Map(); // key → { data, source, timestamp }
const pending   = new Map(); // key → Promise
const lastFetch = new Map(); // key → timestamp

const MIN_FETCH_INTERVAL_MS = 3_000;

function isMarketOpen() {
  const ist = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

/**
 * Fetch and transform a real Dhan option chain.
 * Returns { data, source: "dhan" } on success.
 * Throws if Dhan is unavailable so the caller can fall back to synthetic.
 */
async function fetchDhan(symbol, expiry) {
  const raw  = await dhanFetch(symbol, expiry);
  const data = dhanTransform(raw);
  return { data, source: "dhan" };
}

/**
 * Build a synthetic chain (Black-Scholes, real spot anchor).
 */
async function fetchSynthetic(symbol, expiry) {
  // Try to anchor on a real Yahoo spot; fall back to baseline if unavailable.
  let spot;
  try {
    const { YAHOO_UNDERLYING, fetchSpot: yahooSpot } = await import("./yahooApi");
    if (YAHOO_UNDERLYING[symbol]) {
      const s = await yahooSpot(symbol);
      if (Number.isFinite(s) && s > 0) spot = s;
    }
  } catch {
    /* fall through */
  }
  spot = spot ?? baselineSpot(symbol);
  const data = buildChain(symbol, expiry, spot);
  return { data, source: "simulated" };
}

/**
 * Returns { data, source, fromCache, cacheAgeSeconds }.
 * Never throws — worst case returns a synthetic chain.
 */
export async function getChain(symbol, expiry) {
  if (!SYMBOL_CONFIG[symbol] && !DHAN_UNDERLYING[symbol]) {
    throw new Error(`Unknown symbol: ${symbol}`);
  }

  const key = `${symbol}_${expiry}`;
  const now = Date.now();
  const ttl = isMarketOpen() ? 15_000 : 5 * 60_000;

  // 1. Fresh cache hit
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < ttl) {
    return {
      data: cached.data,
      fromCache: true,
      source: cached.source + "-cached",
      cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000),
    };
  }

  // 2. Dedup in-flight builds
  if (pending.has(key)) return pending.get(key);

  // 3. Rate-limit guard
  const last = lastFetch.get(key) ?? 0;
  if (now - last < MIN_FETCH_INTERVAL_MS && cached) {
    return {
      data: cached.data,
      fromCache: true,
      source: cached.source + "-cached",
      cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000),
    };
  }

  const fetchPromise = (async () => {
    lastFetch.set(key, Date.now());
    try {
      // Primary: Dhan real data
      const { data, source } = await fetchDhan(symbol, expiry);
      cache.set(key, { data, source, timestamp: Date.now() });
      return { data, fromCache: false, source, cacheAgeSeconds: 0 };
    } catch (dhanErr) {
      console.warn(`[chain] Dhan fetch failed (${dhanErr.message}); falling back to synthetic`);
      try {
        // Fallback: synthetic engine
        const { data, source } = await fetchSynthetic(symbol, expiry);
        cache.set(key, { data, source, timestamp: Date.now() });
        return { data, fromCache: false, source, cacheAgeSeconds: 0 };
      } catch (synErr) {
        // Last resort: serve stale cache if any
        const stale = cache.get(key);
        if (stale) {
          console.warn(`[chain] Synthetic also failed (${synErr.message}); serving stale cache`);
          return {
            data: stale.data,
            fromCache: true,
            source: stale.source + "-stale",
            cacheAgeSeconds: Math.round((Date.now() - stale.timestamp) / 1000),
          };
        }
        throw synErr;
      }
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, fetchPromise);
  return fetchPromise;
}

/**
 * Returns sorted ISO expiry list.
 * Tries Dhan first; falls back to synthetic calendar.
 */
export async function getExpiryList(symbol) {
  try {
    const res = await dhanExpiryList(symbol);
    // Dhan returns { status, data: ["2026-06-26", ...] } or similar
    const raw = res?.data ?? res?.expiryList ?? [];
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map((d) => {
          // Normalise: could be ISO already or "26-Jun-2026" style
          if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
          // "26-Jun-2026" → ISO
          const MONTH_NUM = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
          const [day, mon, yr] = d.split("-");
          return `${yr}-${String(MONTH_NUM[mon]).padStart(2,"0")}-${day.padStart(2,"0")}`;
        })
        .sort();
    }
  } catch (err) {
    console.warn(`[expiries] Dhan expiry list failed (${err.message}); using synthetic calendar`);
  }
  return generateExpiries(symbol);
}

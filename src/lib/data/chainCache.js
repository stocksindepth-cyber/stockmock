/**
 * Shared in-memory option chain cache — NSE/BSE primary, stale cache secondary.
 *
 * On error: serve stale cache (real data, slightly old).
 * On no stale data: throw → caller returns 503. No mock data, ever.
 *
 * TTL: 15 s during market hours, 5 min outside.
 * Dedup: concurrent requests for the same key share one fetch.
 * Rate-limit guard: min 3 s between live calls per symbol+expiry.
 */

import {
  UNDERLYING,
  fetchOptionChain as marketFetch,
  transformChain   as marketTransform,
} from "./marketApi";

const cache     = new Map(); // key → { data, timestamp }
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
 * Returns { data, fromCache, source, cacheAgeSeconds }.
 * Throws only when no data is available (caller should return 503).
 */
export async function getChain(symbol, expiry) {
  if (!UNDERLYING[symbol]) throw new Error(`Unknown symbol: ${symbol}`);

  const key = `${symbol}_${expiry}`;
  const now = Date.now();
  const ttl = isMarketOpen() ? 15_000 : 5 * 60_000;

  // 1. Fresh cache
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < ttl) {
    return { data: cached.data, fromCache: true, source: "live-cached",
             cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000) };
  }

  // 2. Dedup in-flight fetches
  if (pending.has(key)) return pending.get(key);

  // 3. Rate-limit guard
  const last = lastFetch.get(key) ?? 0;
  if (now - last < MIN_FETCH_INTERVAL_MS && cached) {
    return { data: cached.data, fromCache: true, source: "live-cached",
             cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000) };
  }

  // 4. Live fetch
  const fetchPromise = (async () => {
    lastFetch.set(key, Date.now());
    try {
      const raw  = await marketFetch(symbol, expiry);
      const data = marketTransform(raw);
      cache.set(key, { data, timestamp: Date.now() });
      return { data, fromCache: false, source: "live", cacheAgeSeconds: 0 };
    } catch (err) {
      // Stale cache beats an error — serve real (if slightly old) data
      const stale = cache.get(key);
      if (stale) {
        console.warn(`[chain] Fetch failed (${err.message}); serving stale cache`);
        return { data: stale.data, fromCache: true, source: "stale",
                 cacheAgeSeconds: Math.round((Date.now() - stale.timestamp) / 1000) };
      }
      throw err; // → 503
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, fetchPromise);
  return fetchPromise;
}

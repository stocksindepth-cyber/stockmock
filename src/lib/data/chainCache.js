/**
 * Shared in-memory option chain cache.
 *
 * Used by /api/chain (REST) and /api/feed (SSE/WebSocket) so they never
 * both hit the exchange APIs simultaneously.
 *
 * NSE/BSE are rate-sensitive; keep a 3 s minimum between calls per key.
 * OI data updates slowly — no point refreshing faster than ~15 s.
 *
 * TTL: 15 s during market hours, 5 min outside.
 * Deduplication: concurrent requests for the same key share one API call.
 *
 * Fallback strategy: stale cache only — no mock data.
 * If the exchange is unreachable and no stale data exists, the error
 * propagates so the client receives a proper 503, not fabricated numbers.
 */

import { fetchOptionChain, transformChain, UNDERLYING } from "./marketApi";

const cache     = new Map(); // cacheKey → { data, timestamp }
const pending   = new Map(); // cacheKey → Promise  (dedup concurrent fetches)
const lastFetch = new Map(); // cacheKey → timestamp of last API call

// Minimum interval between live API calls per symbol+expiry key
const MIN_FETCH_INTERVAL_MS = 3_000;

function isMarketOpen() {
  const ist = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

/**
 * Returns cached chain data if fresh, otherwise fetches from the exchange.
 * Falls back to stale cache on errors. Throws if no data is available at all.
 *
 * @returns {{ data, fromCache: boolean, source: string, cacheAgeSeconds: number }}
 */
export async function getChain(symbol, expiry) {
  if (!UNDERLYING[symbol]) throw new Error(`Unknown symbol: ${symbol}`);

  const key = `${symbol}_${expiry}`;
  const now = Date.now();
  const ttl = isMarketOpen() ? 15_000 : 5 * 60_000;

  // 1. Fresh cache hit
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < ttl) {
    return {
      data:            cached.data,
      fromCache:       true,
      source:          "live-cached",
      cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000),
    };
  }

  // 2. Dedup: if a fetch is already in-flight for this key, piggyback on it
  if (pending.has(key)) return pending.get(key);

  // 3. Rate-limit guard: serve stale cache rather than hammering the exchange
  const last = lastFetch.get(key) ?? 0;
  if (now - last < MIN_FETCH_INTERVAL_MS && cached) {
    return {
      data:            cached.data,
      fromCache:       true,
      source:          "live-cached",
      cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000),
    };
  }

  // 4. Kick off a fresh fetch
  const fetchPromise = (async () => {
    lastFetch.set(key, Date.now());
    try {
      const raw  = await fetchOptionChain(symbol);
      const data = transformChain(raw, expiry);
      cache.set(key, { data, timestamp: Date.now() });
      return { data, fromCache: false, source: "live", cacheAgeSeconds: 0 };
    } catch (err) {
      // Stale cache is real data — always prefer it over an error
      const stale = cache.get(key);
      if (stale) {
        console.warn(`[chainCache] ${symbol}/${expiry} fetch failed (${err.message}); serving stale cache`);
        return {
          data:            stale.data,
          fromCache:       true,
          source:          "stale",
          cacheAgeSeconds: Math.round((Date.now() - stale.timestamp) / 1000),
        };
      }
      // No stale data — propagate the error so the API returns 503
      throw err;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, fetchPromise);
  return fetchPromise;
}

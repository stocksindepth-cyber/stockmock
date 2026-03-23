/**
 * Shared in-memory option chain cache.
 *
 * Used by /api/chain (REST) and /api/feed (SSE/WebSocket) so they never
 * both hit the Dhan API simultaneously, preventing 429 rate-limit errors.
 *
 * Rate limit: Dhan Option Chain API allows 1 request per 3 seconds.
 * OI data updates slowly compared to LTP — no point refreshing faster than ~15s.
 *
 * TTL: 15 s during market hours (well above the 3s rate-limit floor), 5 min outside.
 * Deduplication: concurrent requests for the same key share one Dhan call.
 */

import { fetchOptionChain, transformChain, UNDERLYING } from "./dhanApi";
import { generateMockChain } from "./mockData";

const cache      = new Map(); // cacheKey → { data, timestamp }
const pending    = new Map(); // cacheKey → Promise  (dedup concurrent fetches)
const lastFetch  = new Map(); // cacheKey → timestamp of last Dhan API call

// Dhan Option Chain API rate limit: 1 request per 3 seconds
const DHAN_MIN_INTERVAL_MS = 3_000;

function isMarketOpen() {
  const ist = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

/**
 * Returns cached chain data if fresh, otherwise fetches from Dhan and caches.
 * Falls back to stale cache or mock data on errors.
 *
 * @returns {{ data, fromCache: boolean, source: string, cacheAgeSeconds: number }}
 */
export async function getChain(symbol, expiry) {
  const ul = UNDERLYING[symbol];
  if (!ul) throw new Error(`Unknown symbol: ${symbol}`);

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

  // 3. Rate-limit guard: never call Dhan API faster than once per 3s
  const last = lastFetch.get(key) ?? 0;
  if (now - last < DHAN_MIN_INTERVAL_MS) {
    const stale = cache.get(key);
    if (stale) {
      return {
        data:            stale.data,
        fromCache:       true,
        source:          "live-cached",
        cacheAgeSeconds: Math.round((now - stale.timestamp) / 1000),
      };
    }
  }

  // 4. Start a new fetch and register in pending map
  const fetchPromise = (async () => {
    lastFetch.set(key, Date.now());
    try {
      const raw  = await fetchOptionChain(symbol, expiry);
      const data = transformChain(raw);
      cache.set(key, { data, timestamp: Date.now() });
      return { data, fromCache: false, source: "live", cacheAgeSeconds: 0 };
    } catch (err) {
      // a. Stale cache is better than nothing
      const stale = cache.get(key);
      if (stale) {
        return {
          data:            stale.data,
          fromCache:       true,
          source:          "stale",
          cacheAgeSeconds: Math.round((Date.now() - stale.timestamp) / 1000),
        };
      }
      // b. Last resort: mock data with correct numeric spot and proper format
      const mockSpot  = symbol === "BANKNIFTY" ? 52000 : symbol === "FINNIFTY" ? 24000 : 22500;
      const raw       = generateMockChain(mockSpot, ul.lotSize, 40);
      const atmStrike = raw.chain.reduce(
        (best, row) => Math.abs(row.strike - mockSpot) < Math.abs(best - mockSpot) ? row.strike : best,
        raw.chain[0]?.strike ?? mockSpot
      );
      const data = {
        spot: mockSpot,
        atmStrike,
        chain: raw.chain.map((row) => ({
          strike: row.strike,
          isATM:  row.strike === atmStrike,
          ce: {
            ltp: row.ce.lastPrice,    iv: row.ce.impliedVolatility,
            oi:  row.ce.openInterest, oiChange: 0, volume: row.ce.volume,
            delta: 0, gamma: 0, theta: 0, vega: 0,
            bidPrice: row.ce.bid,  askPrice: row.ce.ask,
            bidQty:   row.ce.totalBuyQuantity, askQty: row.ce.totalSellQuantity,
            securityId: 0,
          },
          pe: {
            ltp: row.pe.lastPrice,    iv: row.pe.impliedVolatility,
            oi:  row.pe.openInterest, oiChange: 0, volume: row.pe.volume,
            delta: 0, gamma: 0, theta: 0, vega: 0,
            bidPrice: row.pe.bid,  askPrice: row.pe.ask,
            bidQty:   row.pe.totalBuyQuantity, askQty: row.pe.totalSellQuantity,
            securityId: 0,
          },
        })),
      };
      return { data, fromCache: false, source: "mock-fallback", cacheAgeSeconds: 0 };
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, fetchPromise);
  return fetchPromise;
}

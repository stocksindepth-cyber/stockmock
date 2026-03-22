import { NextResponse } from "next/server";
import { fetchOptionChain, transformChain, UNDERLYING } from "@/lib/data/dhanApi";
import { generateMockChain } from "@/lib/data/mockData";

// Simple in-memory cache for the latest option chain results to prevent 429 Rate Limits
// Structure: { "NIFTY_2024-03-24": { data: {...}, timestamp: 123456789 } }
const chainCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NIFTY";
  const expiry = searchParams.get("expiry") || "2026-03-24";

  const cacheKey = `${symbol}_${expiry}`;
  const now = Date.now();

  // 1. Check Cache
  if (chainCache.has(cacheKey)) {
    const cachedEntry = chainCache.get(cacheKey);
    if (now - cachedEntry.timestamp < CACHE_TTL_MS) {
      console.log(`[API /chain] Serving ${cacheKey} from memory cache.`);
      return NextResponse.json({ ...cachedEntry.data, source: "live-cached" });
    }
  }

  // 2. Fetch Live
  try {
    const raw = await fetchOptionChain(symbol, expiry);
    const data = transformChain(raw);

    // Save to cache
    chainCache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json({ ...data, source: "live" });
  } catch (err) {
    console.error("[API /chain] Dhan error:", err.message);

    // If any error occurs, gracefully fallback to mocked calculations
    const mockChain = generateMockChain(UNDERLYING[symbol], symbol === "BANKNIFTY" ? 100 : 50, 40);
    return NextResponse.json({ ...mockChain, source: "mock-fallback" });
  }
}

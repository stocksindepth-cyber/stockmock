/**
 * GET /api/paper-trade/price?symbol=NIFTY&expiry=2025-03-27
 *
 * Returns the full option chain for a symbol+expiry so the client can
 * price individual legs. Cached 30 s; serves stale on Dhan errors.
 */
import { NextResponse } from "next/server";
import { fetchOptionChain, transformChain, UNDERLYING } from "@/lib/data/dhanApi";

const _cache = new Map(); // key → { data, at }
const CACHE_TTL = 30_000;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();
  const expiry = searchParams.get("expiry") || "";

  if (!expiry) return NextResponse.json({ error: "expiry required" }, { status: 400 });
  if (!UNDERLYING[symbol]) return NextResponse.json({ error: `Unknown symbol: ${symbol}` }, { status: 400 });

  const key = `${symbol}_${expiry}`;
  const now = Date.now();
  const hit = _cache.get(key);
  if (hit && now - hit.at < CACHE_TTL) {
    return NextResponse.json({ ...hit.data, cached: true });
  }

  try {
    const raw  = await fetchOptionChain(symbol, expiry);
    const data = transformChain(raw);
    _cache.set(key, { data, at: now });
    return NextResponse.json({ ...data, cached: false });
  } catch (err) {
    if (hit) return NextResponse.json({ ...hit.data, cached: true, stale: true });
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}

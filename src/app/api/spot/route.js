/**
 * GET /api/spot?symbol=NIFTY
 *
 * Lightweight endpoint: fetches only the index LTP from Dhan.
 * Much faster than /api/chain — used for the real-time spot line.
 * Cache: 5s during market hours, 5min outside.
 */

import { NextResponse } from "next/server";
import { fetchLTP, UNDERLYING } from "@/lib/data/dhanApi";

const spotCache = new Map(); // symbol → { spot, timestamp }

function isMarketOpen() {
  const ist = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NIFTY";
  const ul = UNDERLYING[symbol];
  if (!ul) return NextResponse.json({ error: "Unknown symbol" }, { status: 400 });

  const now = Date.now();
  const ttl = isMarketOpen() ? 5_000 : 5 * 60_000;

  const cached = spotCache.get(symbol);
  if (cached && now - cached.timestamp < ttl) {
    return NextResponse.json({ symbol, spot: cached.spot, source: "cached" });
  }

  try {
    const res = await fetchLTP({ IDX_I: [ul.secId] });
    // Dhan LTP response: { data: { IDX_I: { "13": { last_price: 22550 } } } }
    const spotData = res?.data?.IDX_I?.[String(ul.secId)];
    const spot = spotData?.last_price;
    if (!spot) throw new Error("No LTP in response");

    spotCache.set(symbol, { spot, timestamp: now });
    return NextResponse.json({ symbol, spot, source: "live" });
  } catch (err) {
    // Fall back to cached value if available (even if stale)
    if (cached) {
      return NextResponse.json({ symbol, spot: cached.spot, source: "stale" });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

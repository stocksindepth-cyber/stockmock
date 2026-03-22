import { NextResponse } from "next/server";

// Yahoo Finance symbols for NSE indices
const YF_SYMBOLS = [
  { symbol: "^NSEI",             name: "NIFTY 50",   key: "NIFTY"     },
  { symbol: "^NSEBANK",          name: "BANK NIFTY",  key: "BANKNIFTY" },
  { symbol: "NIFTY_FIN_SERVICE.NS", name: "FIN NIFTY", key: "FINNIFTY"  },
];

// Server-side cache — 60 s TTL prevents hammering Yahoo on rapid reloads
let _cache   = null;
let _cachedAt = 0;
const CACHE_TTL = 60_000;

async function fetchYahooQuote(yfSymbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yfSymbol)}?interval=1m&range=1d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OptionsGyani/1.0)",
      "Accept": "application/json",
    },
    next: { revalidate: 0 }, // never cache at Next.js layer; we manage our own cache
  });
  if (!res.ok) throw new Error(`Yahoo ${res.status} for ${yfSymbol}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta in Yahoo response for ${yfSymbol}`);
  return meta;
}

export async function GET() {
  // Serve from cache if fresh
  if (_cache && Date.now() - _cachedAt < CACHE_TTL) {
    return NextResponse.json({ ..._cache, cached: true });
  }

  // Fetch all three in parallel; allow partial success
  const results = await Promise.allSettled(
    YF_SYMBOLS.map(({ symbol, name, key }) =>
      fetchYahooQuote(symbol).then((meta) => ({
        key,
        name,
        price:         meta.regularMarketPrice   || 0,
        open:          meta.regularMarketOpen     || 0,
        high:          meta.regularMarketDayHigh  || 0,
        low:           meta.regularMarketDayLow   || 0,
        close:         meta.previousClose         || meta.regularMarketPrice || 0,
        change:        parseFloat(((meta.regularMarketPrice || 0) - (meta.previousClose || 0)).toFixed(2)),
        changePercent: meta.previousClose
          ? `${meta.regularMarketPrice >= meta.previousClose ? "+" : ""}${(((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100).toFixed(2)}%`
          : "0.00%",
      }))
    )
  );

  const indices = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  if (indices.length === 0) {
    console.error("[API /indices] All Yahoo Finance fetches failed");
    if (_cache) return NextResponse.json({ ..._cache, source: "cached_stale" });
    return NextResponse.json({ indices: [], source: "error" });
  }

  _cache   = { indices, source: "live" };
  _cachedAt = Date.now();
  return NextResponse.json(_cache);
}

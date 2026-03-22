import { NextResponse } from "next/server";
import { fetchOHLC, UNDERLYING } from "@/lib/data/dhanApi";

// ── Server-side cache (module-level, survives requests within the same process) ──
// Prevents Dhan 429s from rapid successive calls (React StrictMode double-mount,
// multiple browser tabs, etc.)
let _cache       = null; // { indices: [...], source: "live" }
let _cachedAt    = 0;
let _cacheSource = null; // track the source of the cached response
const CACHE_TTL  = 60_000; // 60 seconds

function freshCache(indices, source) {
  _cache       = { indices, source };
  _cachedAt    = Date.now();
  _cacheSource = source;
  return _cache;
}

function getCached() {
  if (_cache && Date.now() - _cachedAt < CACHE_TTL) return _cache;
  return null;
}

const INDEX_DISPLAY = {
  13: "NIFTY 50",
  25: "BANK NIFTY",
  27: "FIN NIFTY",
};

export async function GET() {
  // ── 1. No credentials ───────────────────────────────────────────────────────
  if (!process.env.DHAN_ACCESS_TOKEN || !process.env.NEXT_PUBLIC_DHAN_CLIENT_ID) {
    return NextResponse.json({ indices: [], source: "no_credentials" });
  }

  // ── 2. Serve from cache if still fresh ──────────────────────────────────────
  const cached = getCached();
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // ── 3. Fetch from Dhan ──────────────────────────────────────────────────────
  try {
    const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
    const ids     = symbols.map((s) => UNDERLYING[s].secId);
    const ohlcRes = await fetchOHLC({ IDX_I: ids });

    // Dhan shape: { data: { IDX_I: { "13": { last_price, ohlc: {open,high,low,close} } } } }
    const segData = ohlcRes?.data?.IDX_I || {};

    const indices = symbols.map((sym) => {
      const secId = UNDERLYING[sym].secId;
      const item  = segData[String(secId)] || {};
      const ltp   = item.last_price || 0;
      const ohlc  = item.ohlc || {};
      const prev  = ohlc.close || ltp;
      const change    = parseFloat((ltp - prev).toFixed(2));
      const changePct = prev
        ? `${change >= 0 ? "+" : ""}${((change / prev) * 100).toFixed(2)}%`
        : "0.00%";

      return {
        name:          INDEX_DISPLAY[secId] || sym,
        price:         ltp,
        open:          ohlc.open  || 0,
        high:          ohlc.high  || 0,
        low:           ohlc.low   || 0,
        close:         prev,
        change,
        changePercent: changePct,
      };
    });

    const payload = freshCache(indices, "live");
    return NextResponse.json(payload);

  } catch (err) {
    const msg = err.message || "";

    // ── 4. Distinguish error types ────────────────────────────────────────────

    // 401 — wrong token or client ID
    if (msg.includes("401")) {
      console.error("[API /indices] Dhan 401 — token or client ID invalid. Check DHAN_ACCESS_TOKEN and NEXT_PUBLIC_DHAN_CLIENT_ID.");
      // If we have stale cache, serve it rather than showing an error
      if (_cache) return NextResponse.json({ ..._cache, source: "cached_stale" });
      return NextResponse.json({ indices: [], source: "auth_error" });
    }

    // 429 — rate limited
    if (msg.includes("429")) {
      console.warn("[API /indices] Dhan 429 — rate limited. Serving stale cache if available.");
      if (_cache) return NextResponse.json({ ..._cache, source: "cached_stale" });
      return NextResponse.json({ indices: [], source: "rate_limited" });
    }

    // Other errors — serve stale cache if available
    console.error("[API /indices] Dhan error:", msg);
    if (_cache) return NextResponse.json({ ..._cache, source: "cached_stale" });
    return NextResponse.json({ indices: [], source: "error" });
  }
}

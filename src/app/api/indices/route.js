import { NextResponse } from "next/server";
import { fetchOHLC, UNDERLYING } from "@/lib/data/dhanApi";

// Map secId → display name
const INDEX_DISPLAY = {
  13: "NIFTY 50",
  25: "BANK NIFTY",
  27: "FIN NIFTY",
};

export async function GET() {
  if (!process.env.DHAN_ACCESS_TOKEN || !process.env.NEXT_PUBLIC_DHAN_CLIENT_ID) {
    // Credentials not configured — return empty set, not 500
    return NextResponse.json({ indices: [], source: "unavailable" });
  }

  try {
    const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
    const ids = symbols.map((s) => UNDERLYING[s].secId);
    const segMap = { IDX_I: ids };

    const ohlcRes = await fetchOHLC(segMap);

    // Dhan response shape: { data: { IDX_I: { "13": { last_price, ohlc: { open, high, low, close } } } } }
    const segData = ohlcRes?.data?.IDX_I || {};

    const indices = symbols.map((sym) => {
      const secId = UNDERLYING[sym].secId;
      const item  = segData[String(secId)] || {};
      const ltp   = item.last_price || 0;
      const ohlc  = item.ohlc || {};
      const prev  = ohlc.close || ltp;
      const change    = parseFloat((ltp - prev).toFixed(2));
      const changePct = prev ? `${change >= 0 ? "+" : ""}${((change / prev) * 100).toFixed(2)}%` : "0.00%";

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

    return NextResponse.json({ indices, source: "live" });
  } catch (err) {
    console.error("[API /indices] Dhan error:", err.message);
    return NextResponse.json({ indices: [], source: "unavailable" });
  }
}

import { NextResponse } from "next/server";
import { fetchLTP, fetchOHLC, INDEX_EQ_IDS } from "@/lib/data/dhanApi";

export async function GET() {
  if (process.env.DHAN_ACCESS_TOKEN && process.env.NEXT_PUBLIC_DHAN_CLIENT_ID) {
    try {
      // Fetch LTP & OHLC for NIFTY, BANKNIFTY, FINNIFTY
      const ids = Object.values(INDEX_EQ_IDS);
      const segMap = { IDX_I: ids };

      const ohlcRes = await fetchOHLC(segMap);

      const indices = [];
      for (const [name, secId] of Object.entries(INDEX_EQ_IDS)) {
        const item = ohlcRes?.data?.IDX_I?.[String(secId)] || {};
        const ltp = item.last_price || 0;
        const ohlc = item.ohlc || {};
        const change = ltp - (ohlc.close || ltp);
        const changePct = ohlc.close ? ((change / ohlc.close) * 100).toFixed(2) : "0.00";

        indices.push({
          name: name === "NIFTY" ? "NIFTY 50" : name === "BANKNIFTY" ? "BANK NIFTY" : "FIN NIFTY",
          price: ltp,
          open: ohlc.open || 0,
          high: ohlc.high || 0,
          low: ohlc.low || 0,
          close: ohlc.close || 0,
          change: parseFloat(change.toFixed(2)),
          changePercent: `${change >= 0 ? "+" : ""}${changePct}%`,
        });
      }

      return NextResponse.json({ indices, source: "live" });
    } catch (err) {
      console.error("[API /indices] Dhan error:", err.message);
      return NextResponse.json({ error: "Failed to fetch live data from Dhan API" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Dhan API credentials missing" }, { status: 500 });
  }
}

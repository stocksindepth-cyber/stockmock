import { NextResponse } from "next/server";
import { fetchExpiryList } from "@/lib/data/marketApi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();

  try {
    const expiries = await fetchExpiryList(symbol);
    if (!expiries.length) {
      return NextResponse.json({ error: "No expiry dates returned from NSE" }, { status: 500 });
    }
    return NextResponse.json({ expiries, source: "nse-live" });
  } catch (err) {
    console.error("[API /expiries] NSE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

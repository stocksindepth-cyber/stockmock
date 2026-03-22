import { NextResponse } from "next/server";
import { fetchExpiryList, UNDERLYING } from "@/lib/data/dhanApi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NIFTY";

  try {
    const res = await fetchExpiryList(symbol);
    if (res.status === "success" && res.data?.length > 0) {
      return NextResponse.json({ expiries: res.data, source: "live" });
    }
    return NextResponse.json({ error: "Failed to fetch live data from Dhan API" }, { status: 500 });
  } catch (err) {
    console.error("[API /expiries] Dhan error:", err.message);
    return NextResponse.json({ error: "Failed to fetch live data from Dhan API" }, { status: 500 });
  }
}

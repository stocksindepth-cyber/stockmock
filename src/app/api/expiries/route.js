import { NextResponse } from "next/server";
import { fetchExpiryList } from "@/lib/data/dhanApi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();

  try {
    const res = await fetchExpiryList(symbol);
    if (res?.status === "success" && res.data?.length) {
      return NextResponse.json({ expiries: res.data, source: "dhan-live" });
    }
    return NextResponse.json({ error: "No expiry dates returned from Dhan" }, { status: 503 });
  } catch (err) {
    console.error("[/api/expiries] Dhan error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}

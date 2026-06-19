import { NextResponse } from "next/server";
import { fetchExpiryList } from "@/lib/data/marketApi";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();

  try {
    const expiries = await fetchExpiryList(symbol);
    if (!expiries?.length) {
      return NextResponse.json({ error: "No expiry dates returned" }, { status: 503 });
    }
    return NextResponse.json({ expiries, source: "generated" });
  } catch (err) {
    console.error("[/api/expiries] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}

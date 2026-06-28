import { NextResponse } from "next/server";
import { getExpiryList } from "@/lib/data/chainCache";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();

  try {
    const expiries = await getExpiryList(symbol);
    if (!expiries?.length) {
      return NextResponse.json({ error: "No expiry dates returned" }, { status: 503 });
    }
    const source = expiries._source ?? "dhan";
    return NextResponse.json({ expiries, source });
  } catch (err) {
    console.error("[/api/expiries] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}

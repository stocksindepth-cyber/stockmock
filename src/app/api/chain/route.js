import { NextResponse } from "next/server";
import { getChain } from "@/lib/data/chainCache";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NIFTY";
  const expiry = searchParams.get("expiry") || "2026-03-24";

  try {
    const { data, source, cacheAgeSeconds } = await getChain(symbol, expiry);
    return NextResponse.json({ ...data, source, cacheAgeSeconds });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

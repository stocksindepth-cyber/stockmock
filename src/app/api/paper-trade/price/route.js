/**
 * GET /api/paper-trade/price?symbol=NIFTY&expiry=2025-03-27
 *
 * Primary: reads from Firestore marketSnapshot/{SYMBOL}_{EXPIRY} (written by poll-chains cron).
 * Fallback: if no snapshot exists or it's stale (>10 min), fetches from Dhan directly.
 *
 * Users never hit Dhan directly. The cron is the single Dhan consumer.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getChain } from "@/lib/data/chainCache";
import { UNDERLYING } from "@/lib/data/marketApi";

const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes — fallback to Dhan if no fresh snapshot

function deriveOiWalls(chain) {
  let maxCallOI = 0, maxCallOIStrike = null;
  let maxPutOI  = 0, maxPutOIStrike  = null;
  for (const row of chain ?? []) {
    if ((row.ce?.oi ?? 0) > maxCallOI) { maxCallOI = row.ce.oi; maxCallOIStrike = row.strike; }
    if ((row.pe?.oi ?? 0) > maxPutOI)  { maxPutOI  = row.pe.oi; maxPutOIStrike  = row.strike; }
  }
  return { maxCallOIStrike, maxPutOIStrike, maxCallOI, maxPutOI };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();
  const expiry = searchParams.get("expiry") || "";

  if (!expiry) return NextResponse.json({ error: "expiry required" }, { status: 400 });
  if (!UNDERLYING[symbol]) return NextResponse.json({ error: `Unknown symbol: ${symbol}` }, { status: 400 });

  const docId = `${symbol}_${expiry}`;

  // ── 1. Try Firestore snapshot first ──────────────────────────────────────────
  try {
    const db = getAdminFirestore();
    const snap = await db.collection("marketSnapshot").doc(docId).get();

    if (snap.exists) {
      const data = snap.data();
      const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
      const ageMs = updatedAt ? Date.now() - updatedAt.getTime() : Infinity;

      if (ageMs < STALE_THRESHOLD_MS) {
        // Fresh snapshot — return immediately
        return NextResponse.json({
          spot:    data.spot,
          chain:   data.chain,
          source:  data.source ?? "firestore",
          updatedAt: data.updatedAt,
          maxCallOIStrike: data.maxCallOIStrike,
          maxPutOIStrike:  data.maxPutOIStrike,
          maxCallOI:       data.maxCallOI,
          maxPutOI:        data.maxPutOI,
          fromCache: true,
        });
      }
      // Stale — fall through to Dhan
      console.warn(`[paper-trade/price] Snapshot for ${docId} is ${Math.round(ageMs/60000)}min old — falling back to Dhan`);
    }
  } catch (err) {
    console.warn("[paper-trade/price] Firestore read failed:", err.message);
  }

  // ── 2. Fallback: fetch from Dhan directly ────────────────────────────────────
  try {
    const data = await getChain(symbol, expiry);
    const walls = deriveOiWalls(data.chain);

    return NextResponse.json({
      ...data,
      ...walls,
      fromCache: false,
    });
  } catch (err) {
    console.error("[paper-trade/price]", err.message);
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}

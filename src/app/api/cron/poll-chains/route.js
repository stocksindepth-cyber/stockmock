/**
 * GET /api/cron/poll-chains
 *
 * Runs every 3 minutes. During market hours (9:15–15:30 IST, Mon–Fri):
 *   1. Finds all (symbol, expiry) pairs with open paper positions in Firestore
 *   2. Always includes nearest NIFTY + BANKNIFTY expiry as baseline
 *   3. Fetches each chain from Dhan (1 req/3s rate limit → 500ms gap between calls)
 *   4. Writes results to Firestore: marketSnapshot/{SYMBOL}_{EXPIRY}
 *
 * User-facing APIs read from marketSnapshot — they never hit Dhan directly.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { fetchOptionChain, transformChain } from "@/lib/data/dhanApi";
import { getExpiryList } from "@/lib/data/chainCache";

const CRON_SECRET = process.env.EMAIL_CRON_SECRET; // reuse same secret

// Symbols always polled regardless of open positions
const BASELINE_SYMBOLS = ["NIFTY", "BANKNIFTY", "FINNIFTY"];

function nowIST() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function isMarketHours() {
  const ist = nowIST();
  const day = ist.getDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;
  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function deriveOiWalls(chain) {
  let maxCallOI = 0, maxCallOIStrike = null;
  let maxPutOI  = 0, maxPutOIStrike  = null;
  for (const row of chain ?? []) {
    if ((row.ce?.oi ?? 0) > maxCallOI) { maxCallOI = row.ce.oi; maxCallOIStrike = row.strike; }
    if ((row.pe?.oi ?? 0) > maxPutOI)  { maxPutOI  = row.pe.oi; maxPutOIStrike  = row.strike; }
  }
  return { maxCallOIStrike, maxPutOIStrike, maxCallOI, maxPutOI };
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMarketHours()) {
    return NextResponse.json({ skipped: true, reason: "outside market hours" });
  }

  const db = getAdminFirestore();
  const results = { fetched: [], failed: [], skipped: 0 };

  // ── 1. Find symbols+expiries needed by open paper positions ──────────────────
  const needed = new Map(); // `SYMBOL_EXPIRY` → { symbol, expiry }

  try {
    // Query all open positions across all users
    const openSnap = await db.collectionGroup("paper_trades")
      .where("status", "==", "OPEN")
      .get();

    for (const doc of openSnap.docs) {
      const d = doc.data();
      if (d.indexKey && d.expiry) {
        const key = `${d.indexKey}_${d.expiry}`;
        needed.set(key, { symbol: d.indexKey, expiry: d.expiry });
      }
    }
  } catch (err) {
    console.warn("[poll-chains] collectionGroup query failed:", err.message);
  }

  // ── 2. Add baseline symbols (nearest 2 expiries each) ────────────────────────
  for (const symbol of BASELINE_SYMBOLS) {
    try {
      const expiries = await getExpiryList(symbol);
      const nearest = (Array.isArray(expiries) ? expiries : []).slice(0, 2);
      for (const expiry of nearest) {
        const key = `${symbol}_${expiry}`;
        if (!needed.has(key)) needed.set(key, { symbol, expiry });
      }
    } catch (err) {
      console.warn(`[poll-chains] expiry list failed for ${symbol}:`, err.message);
    }
    await sleep(400); // stay within Dhan rate limit
  }

  // ── 3. Fetch each chain and write to Firestore ───────────────────────────────
  for (const { symbol, expiry } of needed.values()) {
    try {
      const raw  = await fetchOptionChain(symbol, expiry);
      const data = transformChain(raw);
      const walls = await deriveOiWalls(data.chain);

      const docId = `${symbol}_${expiry}`;
      await db.collection("marketSnapshot").doc(docId).set({
        symbol,
        expiry,
        spot:   data.spot,
        chain:  data.chain,
        source: data.source ?? "dhan",
        updatedAt: new Date().toISOString(),
        ...walls,
      });

      results.fetched.push(docId);
    } catch (err) {
      console.error(`[poll-chains] Failed ${symbol}/${expiry}:`, err.message);
      results.failed.push({ key: `${symbol}_${expiry}`, error: err.message });
    }

    await sleep(500); // ~1 req/0.5s — well within 1 req/3s Dhan limit
  }

  console.log("[poll-chains]", JSON.stringify(results));
  return NextResponse.json({ success: true, ...results });
}

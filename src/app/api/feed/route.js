/**
 * GET /api/feed?symbol=NIFTY&expiry=2026-03-24
 *
 * SSE endpoint — streams real-time tick updates from Dhan's WebSocket feed.
 *
 * Flow:
 *  1. Fetch the option chain via REST to get all security IDs + initial snapshot.
 *  2. Init the singleton Dhan WebSocket (no-op if already running).
 *  3. Subscribe the chain's security IDs to the singleton.
 *  4. Stream SSE events to the browser until it disconnects.
 *
 * Events emitted:
 *  • "snapshot" — full chain data (sent once on connect, same shape as /api/chain)
 *  • "tick"     — { secId, ltp, oi?, volume? }  (streamed on every WS message)
 *  • "status"   — { connected: bool }            (WS state info)
 */

import { NextResponse } from "next/server";
import { UNDERLYING } from "@/lib/data/dhanApi";
import { getChain } from "@/lib/data/chainCache";
import {
  initDhanFeed,
  subscribe,
  unsubscribe,
  latestTicks,
  isConnected,
} from "@/lib/data/dhanFeed";

export const dynamic = "force-dynamic";

// ── Credentials helper (mirrors dhanApi.js token logic) ──────────────────────
async function getCredentials() {
  const token    = process.env.DHAN_ACCESS_TOKEN;
  const clientId = process.env.NEXT_PUBLIC_DHAN_CLIENT_ID;
  if (token && clientId) return { token, clientId };

  try {
    const { getAdminFirestore } = await import("@/lib/firebase/admin.js");
    const db  = getAdminFirestore();
    const doc = await db.doc("admin/dhan").get();
    if (doc.exists && doc.data()?.accessToken && clientId) {
      return { token: doc.data().accessToken, clientId };
    }
  } catch {}

  return null;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NIFTY";
  const expiry = searchParams.get("expiry") || "";
  const ul     = UNDERLYING[symbol];

  if (!ul) return NextResponse.json({ error: "Unknown symbol" }, { status: 400 });

  // 1. Get chain data from shared cache (avoids double-hitting Dhan API)
  let chainData;
  try {
    const result = await getChain(symbol, expiry);
    chainData = result.data;
  } catch (err) {
    console.error("[/api/feed] Chain fetch failed:", err.message);
    return NextResponse.json({ error: "Chain fetch failed" }, { status: 500 });
  }

  // 2. Build instrument map: secId (number) → exchange segment string
  const instruments = new Map();
  instruments.set(ul.secId, "IDX_I"); // underlying index for spot
  for (const row of chainData.chain) {
    if (row.ce.securityId) instruments.set(row.ce.securityId, "NSE_FNO");
    if (row.pe.securityId) instruments.set(row.pe.securityId, "NSE_FNO");
  }

  // 3. Start/reuse singleton Dhan WebSocket
  const creds = await getCredentials();
  if (creds) {
    initDhanFeed(creds.clientId, creds.token);
  } else {
    console.warn("[/api/feed] No Dhan credentials — WS feed unavailable");
  }

  // 4. SSE stream
  const encoder = new TextEncoder();
  let listenerId = null;

  function sse(event, data) {
    return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial snapshot immediately
      controller.enqueue(sse("snapshot", {
        chain:           chainData.chain,
        spot:            chainData.spot,
        atmStrike:       chainData.atmStrike,
        underlyingSecId: ul.secId,
      }));

      // Send WS connection status
      controller.enqueue(sse("status", { connected: isConnected() }));

      // Register tick listener
      listenerId = subscribe(instruments, (tick) => {
        try {
          controller.enqueue(sse("tick", {
            secId:  tick.secId,
            ltp:    tick.ltp,
            ...(tick.oi       !== undefined && { oi:       tick.oi }),
            ...(tick.oiChange !== undefined && { oiChange: tick.oiChange }),
            ...(tick.volume   !== undefined && { volume:   tick.volume }),
          }));
        } catch {
          // Controller closed — client disconnected
        }
      });
    },

    cancel() {
      // Client disconnected — clean up listener
      if (listenerId !== null) unsubscribe(listenerId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no", // disable nginx buffering if proxied
    },
  });
}

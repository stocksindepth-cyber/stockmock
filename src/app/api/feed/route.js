/**
 * GET /api/feed?symbol=NIFTY&expiry=2025-03-27
 *
 * SSE endpoint — streams option chain snapshots polled from NSE/BSE.
 *
 * Events emitted:
 *  • "snapshot" — full chain data (on connect + every poll interval)
 *  • "status"   — { connected: bool }
 *
 * Poll interval: 15 s market hours, 5 min outside.
 * Self-closes at 55 s; browser SSE auto-reconnects via retry:3000.
 */

import { fetchOptionChain, transformChain, UNDERLYING } from "@/lib/data/marketApi";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const MARKET_POLL_MS  = 15_000;
const CLOSED_POLL_MS  = 5 * 60_000;
const GRACEFUL_CLOSE_MS = 55_000;
const HEARTBEAT_MS    = 10_000;

function isMarketOpen() {
  const ist = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000);
  const day = ist.getUTCDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return mins >= 9 * 60 + 15 && mins < 15 * 60 + 30;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();
  const expiry = searchParams.get("expiry") || "";

  if (!UNDERLYING[symbol]) {
    return Response.json({ error: "Unknown symbol" }, { status: 400 });
  }
  if (!expiry) {
    return Response.json({ error: "expiry required" }, { status: 400 });
  }

  // Fetch initial snapshot before opening the stream
  let chainData;
  try {
    const raw = await fetchOptionChain(symbol);
    chainData = transformChain(raw, expiry);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 503 });
  }

  const encoder = new TextEncoder();

  function sse(event, data) {
    return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  // Shared state accessible by both start() and cancel()
  let heartbeatTimer = null;
  let pollTimer      = null;
  let gracefulTimer  = null;
  let closed         = false;

  function cleanup() {
    closed = true;
    if (heartbeatTimer) { clearInterval(heartbeatTimer);  heartbeatTimer = null; }
    if (pollTimer)      { clearTimeout(pollTimer);        pollTimer      = null; }
    if (gracefulTimer)  { clearTimeout(gracefulTimer);    gracefulTimer  = null; }
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      // Tell client we're live — stops its 15s REST fallback polling
      controller.enqueue(sse("status", { connected: true }));
      // Initial full snapshot
      controller.enqueue(sse("snapshot", {
        chain:     chainData.chain,
        spot:      chainData.spot,
        atmStrike: chainData.atmStrike,
      }));

      function scheduleNextPoll() {
        if (closed) return;
        const delay = isMarketOpen() ? MARKET_POLL_MS : CLOSED_POLL_MS;
        pollTimer = setTimeout(async () => {
          if (closed) return;
          try {
            const raw  = await fetchOptionChain(symbol);
            const data = transformChain(raw, expiry);
            controller.enqueue(sse("snapshot", {
              chain:     data.chain,
              spot:      data.spot,
              atmStrike: data.atmStrike,
            }));
          } catch {
            // Silent — stale display beats an error message mid-stream
          }
          scheduleNextPoll();
        }, delay);
      }

      // Keep connection alive
      heartbeatTimer = setInterval(() => {
        try { controller.enqueue(encoder.encode(": ping\n\n")); }
        catch { cleanup(); }
      }, HEARTBEAT_MS);

      // Graceful self-close so Vercel doesn't hard-kill the function
      gracefulTimer = setTimeout(() => {
        try {
          controller.enqueue(sse("status", { connected: false, reconnecting: true }));
          controller.close();
        } catch { /* already closed */ }
        cleanup();
      }, GRACEFUL_CLOSE_MS);

      scheduleNextPoll();
    },

    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

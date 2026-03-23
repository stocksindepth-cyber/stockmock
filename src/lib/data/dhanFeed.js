/**
 * Dhan Market Feed — Singleton WebSocket Manager
 *
 * Opens ONE WebSocket connection to Dhan's live feed per Node process.
 * All SSE clients share this single connection — zero extra cost.
 *
 * Works on local dev and any self-hosted deployment.
 * On Vercel serverless, each cold start gets its own WS; the SSE
 * endpoint will reconnect automatically.
 */

import Ws from "ws";

const FEED_URL = "wss://api-feed.dhan.co";

// ── Singleton state ───────────────────────────────────────────────────────────
let ws = null;
let wsState = "closed"; // "closed" | "connecting" | "open"
let reconnectTimer  = null;
let reconnectCount  = 0;
const MAX_RECONNECTS = 5;
let _clientId = null;
let _token    = null;

// All instruments currently subscribed: secId (number) → segment string
const subscribedInstruments = new Map();

// Latest tick snapshot: secId → { ltp, oi, volume, high, low, open, close }
export const latestTicks = new Map();

// SSE listener registry: id → { callback, instruments: Set<number> }
const listeners = new Map();
let _nextId = 0;

// ── Binary packet parser ──────────────────────────────────────────────────────
// Dhan market feed v2 binary format (little-endian):
//
// Byte  0     : packet_type  (uint8)
// Byte  1     : exchange_seg (uint8)
// Bytes 2-5   : security_id  (uint32 LE)
// Bytes 6-9   : LTP          (float32 LE)
// Bytes 10-13 : LTT          (uint32 LE)   — last trade time epoch ms
// Bytes 14-17 : avg_price    (float32 LE)
// Bytes 18-21 : volume       (uint32 LE)
// Bytes 22-25 : total_sell   (uint32 LE)
// Bytes 26-29 : total_buy    (uint32 LE)
// Bytes 30-33 : open         (float32 LE)
// Bytes 34-37 : close        (float32 LE)
// Bytes 38-41 : high         (float32 LE)
// Bytes 42-45 : low          (float32 LE)
// Bytes 46-49 : change       (float32 LE)
// Bytes 50-53 : change_pct   (float32 LE)
// Bytes 54-57 : OI           (uint32 LE)   — FNO only
// Bytes 58-61 : OI_change    (uint32 LE)   — FNO only

function parseBinaryPacket(raw) {
  try {
    const b = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    if (b.length < 10) return null;

    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const packetType = view.getUint8(0);
    const secId = view.getUint32(2, true);
    const ltp = view.getFloat32(6, true);

    if (!Number.isFinite(ltp) || ltp <= 0) return null;

    const tick = { packetType, secId, ltp };

    if (b.length >= 46) {
      tick.volume   = view.getUint32(18, true);
      tick.open     = view.getFloat32(30, true);
      tick.close    = view.getFloat32(34, true);
      tick.high     = view.getFloat32(38, true);
      tick.low      = view.getFloat32(42, true);
    }
    if (b.length >= 62) {
      tick.oi       = view.getUint32(54, true);
      tick.oiChange = view.getUint32(58, true);
    }

    return tick;
  } catch {
    return null;
  }
}

// ── Subscription message builder ──────────────────────────────────────────────
// RequestCode 21 = subscribe, 22 = unsubscribe
function buildSubMsg(instruments, code = 21) {
  const list = [];
  for (const [secId, seg] of instruments) {
    list.push({ ExchangeSegment: seg, SecurityId: String(secId) });
  }
  return JSON.stringify({
    RequestCode: code,
    InstrumentCount: list.length,
    InstrumentList: list,
  });
}

// ── Listener notification ─────────────────────────────────────────────────────
function notifyListeners(tick) {
  for (const [, listener] of listeners) {
    if (listener.instruments.has(tick.secId)) {
      try { listener.callback(tick); } catch {}
    }
  }
}

// ── WebSocket lifecycle ───────────────────────────────────────────────────────
function connect() {
  if (!_clientId || !_token) return;
  if (wsState !== "closed") return;

  wsState = "connecting";
  // Dhan v2: auth via URL query params (some versions use headers, some query params)
  const url = `${FEED_URL}?version=2&token=${encodeURIComponent(_token)}&clientId=${encodeURIComponent(_clientId)}`;
  console.log("[DhanFeed] Connecting…");

  ws = new Ws(url, {
    headers: {
      version:  "2",
      token:    _token,
      clientId: _clientId,
    },
  });

  ws.on("open", () => {
    wsState = "open";
    reconnectCount = 0; // reset on successful connection
    console.log("[DhanFeed] Connected ✓");
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

    // Dhan v2: send login message immediately after open
    const loginMsg = JSON.stringify({
      LoginReq: { MsgCode: 42, ClientId: _clientId, Token: _token },
      UserType: "SELF",
    });
    ws.send(loginMsg);

    // Subscribe all pending instruments
    if (subscribedInstruments.size > 0) {
      // Small delay after login before subscribing
      setTimeout(() => {
        if (wsState === "open") {
          ws.send(buildSubMsg(subscribedInstruments));
          console.log("[DhanFeed] Subscribed", subscribedInstruments.size, "instruments");
        }
      }, 500);
    }
  });

  ws.on("message", (data) => {
    // Dhan sends binary frames; ignore any text pings/acks
    if (typeof data === "string") return;
    const tick = parseBinaryPacket(data);
    if (!tick) return;
    const existing = latestTicks.get(tick.secId) || {};
    latestTicks.set(tick.secId, { ...existing, ...tick });
    notifyListeners(tick);
  });

  ws.on("close", (code, reason) => {
    wsState = "closed";
    reconnectCount++;
    if (reconnectCount <= MAX_RECONNECTS) {
      const delay = Math.min(3000 * reconnectCount, 30_000);
      console.log(`[DhanFeed] Closed (${code}) — reconnect ${reconnectCount}/${MAX_RECONNECTS} in ${delay / 1000}s`);
      reconnectTimer = setTimeout(connect, delay);
    } else {
      console.warn("[DhanFeed] Max reconnects reached — WS feed disabled. Check Dhan token validity.");
    }
  });

  ws.on("error", (err) => {
    console.error("[DhanFeed] Error:", err.message);
    // 'close' will fire after this and trigger reconnect
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call once with Dhan credentials to start the WebSocket.
 * Safe to call multiple times — only opens one connection.
 */
export function initDhanFeed(clientId, token) {
  const tokenChanged = token !== _token || clientId !== _clientId;
  _clientId = clientId;
  _token    = token;
  if (tokenChanged) reconnectCount = 0; // fresh token → reset backoff
  if (wsState === "closed" && reconnectCount <= MAX_RECONNECTS) connect();
}

/**
 * Subscribe to a set of instruments and receive tick callbacks.
 * @param {Map<number, string>} instruments  secId → exchange segment
 * @param {(tick) => void}      callback
 * @returns {number}  listener ID — pass to unsubscribe() on cleanup
 */
export function subscribe(instruments, callback) {
  const id  = ++_nextId;
  const ids = new Set(instruments.keys());
  listeners.set(id, { callback, instruments: ids });

  // Find instruments not yet subscribed to
  const fresh = new Map();
  for (const [secId, seg] of instruments) {
    if (!subscribedInstruments.has(secId)) {
      subscribedInstruments.set(secId, seg);
      fresh.set(secId, seg);
    }
  }
  if (fresh.size > 0 && wsState === "open") {
    ws.send(buildSubMsg(fresh));
  }

  return id;
}

/** Remove a listener registered with subscribe(). */
export function unsubscribe(id) {
  listeners.delete(id);
}

export function isConnected() {
  return wsState === "open";
}

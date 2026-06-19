/**
 * Synthetic Option Chain Engine — Black-Scholes priced, real-spot anchored.
 *
 * Why this exists: live NSE/Yahoo option-chain scraping is fragile (Akamai
 * blocks, expiring broker tokens, 15-min delays, empty weekend data). For a
 * practice / paper-trading product, what matters is that premiums and Greeks
 * are *realistic and internally consistent*, not tick-perfect. So we generate
 * the full chain ourselves:
 *
 *   • Strikes        — real strike intervals around a real spot price
 *   • Premiums       — Black-Scholes (src/lib/options/greeks.js)
 *   • IV             — a volatility smile/skew (richer OTM puts, far-OTM smile)
 *   • Greeks         — real delta/gamma/theta/vega, move correctly with spot/T
 *   • OI / volume    — ATM-peaked, put-support / call-resistance distribution
 *   • Expiries       — generated NSE-style weekly/monthly calendar
 *
 * Premiums and Greeks track the real spot live; OI/volume are seeded
 * deterministically per (symbol, expiry, strike, side) so they stay stable
 * across refreshes instead of flickering. Output shape matches the canonical
 * { spot, chain:[{strike, ce, pe, isATM}], atmStrike } used everywhere else.
 *
 * This is labelled "simulated" downstream — we never present it as a live feed.
 */

import { allGreeks } from "../options/greeks";
import { LOT_SIZES, STRIKE_INTERVALS } from "../nse/constants";

// Risk-free rate (India ~6.5%) and the NSE/BSE price tick.
const R = 0.065;
const TICK = 0.05;

// Per-symbol simulation parameters.
//   baselineSpot — fallback spot if the live spot fetch fails
//   atmIV        — at-the-money implied volatility (decimal)
//   oiBase       — peak open-interest scale near the OI hump
//   weekly       — true if the index has weekly expiries, else monthly-only
//   weeklyDay    — JS weekday of expiry (0=Sun … 4=Thu). SENSEX is Tuesday.
export const SYMBOL_CONFIG = {
  NIFTY:      { baselineSpot: 25500, atmIV: 0.12, oiBase: 3_500_000, weekly: true,  weeklyDay: 4 },
  BANKNIFTY:  { baselineSpot: 57000, atmIV: 0.15, oiBase: 1_200_000, weekly: false, weeklyDay: 4 },
  FINNIFTY:   { baselineSpot: 25500, atmIV: 0.14, oiBase:   900_000, weekly: false, weeklyDay: 4 },
  MIDCPNIFTY: { baselineSpot: 13500, atmIV: 0.16, oiBase:   700_000, weekly: false, weeklyDay: 4 },
  SENSEX:     { baselineSpot: 84000, atmIV: 0.12, oiBase: 1_500_000, weekly: true,  weeklyDay: 2 },
};

const cfgOf = (symbol) => SYMBOL_CONFIG[symbol] || SYMBOL_CONFIG.NIFTY;

export function baselineSpot(symbol) {
  return cfgOf(symbol).baselineSpot;
}

// ── Deterministic seeded RNG (FNV-1a hash → mulberry32) ──────────────────────
// Stable per (symbol, expiry, strike, side) so OI/volume don't jitter on refresh.
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seeded = (...parts) => mulberry32(hashStr(parts.join("|")));

// ── Date / expiry helpers (IST) ──────────────────────────────────────────────
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const pad = (n) => String(n).padStart(2, "0");

// Calendar parts for a UTC ms instant, viewed in IST.
function istParts(ms) {
  const d = new Date(ms + IST_OFFSET_MS);
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(), wd: d.getUTCDay() };
}

// The expiry instant: 15:30 IST = 10:00 UTC on the expiry date.
function expiryInstantMs(y, mo /* 0-based */, d) {
  return Date.UTC(y, mo, d, 10, 0, 0);
}

/**
 * Generate an NSE-style expiry calendar for a symbol — weekly indices get the
 * next ~8 weekly expiries; monthly-only indices get the next ~6 month-end
 * expiries. Only future (un-expired) dates are returned, ascending ISO.
 */
export function generateExpiries(symbol) {
  const cfg = cfgOf(symbol);
  const now = Date.now();
  const want = cfg.weekly ? 8 : 6;
  const out = [];

  for (let i = 0; i < 200 && out.length < want; i++) {
    const ms = now + i * 86_400_000;
    const { y, mo, d, wd } = istParts(ms);
    if (wd !== cfg.weeklyDay) continue;

    // Monthly-only symbols: keep only the last matching weekday of the month.
    if (!cfg.weekly) {
      const nextWeek = istParts(ms + 7 * 86_400_000);
      if (nextWeek.mo === mo) continue;
    }

    const exMs = expiryInstantMs(y, mo, d);
    if (exMs <= now) continue; // already expired today

    out.push(`${y}-${pad(mo + 1)}-${pad(d)}`);
  }

  return out;
}

// Time to expiry in years, floored to a tiny positive so 0DTE stays well-defined.
function yearsToExpiry(expiry) {
  if (!expiry) return 7 / 365;
  const [y, mo, d] = expiry.split("-").map(Number);
  const exMs = expiryInstantMs(y, (mo || 1) - 1, d || 1);
  const T = (exMs - Date.now()) / (365 * 24 * 3600 * 1000);
  return Math.max(T, 0.0001);
}

// ── Pricing pieces ───────────────────────────────────────────────────────────
// Round to the 0.05 tick and to 2 decimals (avoids float artifacts in payloads).
const roundTick = (p) => Number(Math.max(TICK, Math.round(p / TICK) * TICK).toFixed(2));

// Volatility smile: OTM puts richer (equity skew), both wings curve up, clamped.
function ivForStrike(cfg, spot, strike, T) {
  const m = Math.log(strike / spot); // log-moneyness
  const skew = m < 0 ? 0.7 * -m : 0; // puts (m<0) carry a vol premium
  const smile = 8 * m * m; // visible convexity across the wings
  const termBump = T < 0.02 ? 0.02 : 0; // near-expiry vols firm up slightly
  const iv = cfg.atmIV + skew + smile + termBump;
  return Math.min(0.9, Math.max(0.06, iv));
}

function buildSide(symbol, expiry, strike, type, spot, T, cfg, lotSize, peak, oiSigma) {
  const rng = seeded(symbol, expiry, strike, type);

  const iv = ivForStrike(cfg, spot, strike, T);
  const g = allGreeks(spot, strike, T, R, iv, type);
  const ltp = roundTick(g.price);

  // Open interest: gaussian hump around the side-specific peak strike.
  const dist = (strike - peak) / oiSigma;
  const oiShape = Math.exp(-0.5 * dist * dist);
  const oi = Math.round((cfg.oiBase * oiShape * (0.55 + 0.6 * rng())) / lotSize) * lotSize;
  const oiChange = Math.round(((rng() - 0.45) * 0.3 * oi) / lotSize) * lotSize;
  const volume = Math.round(oi * (0.15 + 0.5 * rng()));

  // Bid/ask: spread widens with distance from ATM and for cheap, illiquid options.
  const moneyness = Math.abs(Math.log(strike / spot));
  const spreadPct = Math.min(0.08, 0.005 + moneyness * 0.15 + (ltp < 2 ? 0.05 : 0));
  const half = Math.max(TICK / 2, (ltp * spreadPct) / 2);

  return {
    ltp,
    iv: Number((iv * 100).toFixed(2)),
    oi,
    oiChange,
    volume,
    delta: Number(g.delta.toFixed(4)),
    gamma: Number(g.gamma.toFixed(6)),
    theta: Number(g.theta.toFixed(3)),
    vega: Number(g.vega.toFixed(3)),
    bidPrice: roundTick(Math.max(TICK, ltp - half)),
    askPrice: roundTick(ltp + half),
    bidQty: (1 + Math.floor(rng() * 20)) * lotSize,
    askQty: (1 + Math.floor(rng() * 20)) * lotSize,
    securityId: 0,
  };
}

/**
 * Build a full synthetic chain for symbol+expiry anchored on `spotIn`.
 * Returns { spot, chain, atmStrike, lotSize, simulated:true }.
 */
export function buildChain(symbol, expiry, spotIn) {
  const cfg = cfgOf(symbol);
  const interval = STRIKE_INTERVALS[symbol] || 50;
  const lotSize = LOT_SIZES[symbol] || 50;
  const spot = Number.isFinite(spotIn) && spotIn > 0 ? spotIn : cfg.baselineSpot;
  const T = yearsToExpiry(expiry);

  const atmStrike = Math.round(spot / interval) * interval;
  const SPAN = 22; // strikes either side of ATM → 45-strike chain

  // OI humps: put support ~1.5% below spot, call resistance ~1.5% above.
  const offset = Math.round((0.015 * spot) / interval) * interval;
  const callPeak = atmStrike + offset;
  const putPeak = atmStrike - offset;
  const oiSigma = 7 * interval;

  const chain = [];
  for (let i = -SPAN; i <= SPAN; i++) {
    const strike = atmStrike + i * interval;
    if (strike <= 0) continue;
    chain.push({
      strike,
      ce: buildSide(symbol, expiry, strike, "CE", spot, T, cfg, lotSize, callPeak, oiSigma),
      pe: buildSide(symbol, expiry, strike, "PE", spot, T, cfg, lotSize, putPeak, oiSigma),
      isATM: strike === atmStrike,
    });
  }

  return { spot, chain, atmStrike, lotSize, simulated: true };
}

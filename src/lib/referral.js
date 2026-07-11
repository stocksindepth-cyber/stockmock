// ─── Referral system helpers (shared) ────────────────────────────────────────
// A referral code is derived deterministically from the user's uid, so the same
// user always maps to the same code. A `referralCodes/{code}` mapping doc is
// written when the user first views their code, so /r/[code] can resolve it
// server-side without scanning the users collection.

export const REFERRAL_REWARD_CREDITS = 20; // both referrer and referee get this
export const REFERRAL_COOKIE = "og_ref";   // stores the referral CODE, 30 days

// Deterministic 6-char base36 code from a uid. Collision space ~2B — safe for
// our scale, and stable so a user's link never changes.
export function codeFromUid(uid) {
  if (!uid) return null;
  let h = 2166136261 >>> 0; // FNV-ish
  for (let i = 0; i < uid.length; i++) {
    h ^= uid.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

export function referralUrl(code, base = "https://www.optionsgyani.com") {
  return `${base}/r/${code}`;
}

// Pre-filled WhatsApp / generic share text. Optionally weave in a backtest stat
// so the share carries proof, not just a link.
export function buildShareText(code, { stat } = {}) {
  const url = referralUrl(code);
  const lead = stat
    ? `I just backtested an options strategy on 8+ years of real NSE data — ${stat}. `
    : `I've been using OptionsGyani to backtest options strategies on 8+ years of real NSE data. `;
  return `${lead}Sign up free with my link and we both get ${REFERRAL_REWARD_CREDITS} free backtests 👉 ${url}`;
}

export function whatsappShareUrl(code, opts) {
  return `https://wa.me/?text=${encodeURIComponent(buildShareText(code, opts))}`;
}

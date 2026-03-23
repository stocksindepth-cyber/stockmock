// ─── Resend email client singleton ────────────────────────────────────────────
// Server-side only. Never import from client components.
// ─────────────────────────────────────────────────────────────────────────────
import { Resend } from 'resend';

// Lazy singleton — only instantiated when actually used, so a missing
// RESEND_API_KEY in local dev doesn't crash module evaluation at import time.
let _resend = null;
export function getResendClient() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('[Email] RESEND_API_KEY not set. Add it to .env.local or Vercel env vars.');
    _resend = new Resend(key);
  }
  return _resend;
}

export const FROM_ADDRESS = 'OptionsGyani <support@optionsgyani.com>';
export const ADMIN_EMAIL = 'support@optionsgyani.com';

/**
 * POST /api/admin/blast-trading-offer
 *
 * Sends the trading-focused offer email (TradingOfferEmail) to all registered
 * users who haven't already received it. Skips paid users.
 *
 * Auth: x-admin-secret header
 * Body: { coupon, discountPct, expiry, dryRun }
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/sender";

const ADMIN_SECRET = process.env.EMAIL_CRON_SECRET;
const BLAST_TAG = "tradingOffer_jul2026";
const DELAY_MS = 1200; // 1.2s between sends — stay well under Resend rate limit

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  // Auth
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const coupon      = body.coupon      ?? "OG30";
  const discountPct = body.discountPct ?? 30;
  const expiry      = body.expiry      ?? "9 July 2026";
  const dryRun      = body.dryRun      ?? false;

  const db = getAdminFirestore();
  const usersSnap = await db.collection("users").get();

  const results = { sent: [], skipped: [], failed: [] };

  for (const doc of usersSnap.docs) {
    const user = doc.data();
    const email = user.email;
    const name  = user.displayName || email?.split("@")[0] || "Trader";

    // Skip paid users — they don't need a conversion offer
    if (user.plan && user.plan !== "free") {
      results.skipped.push({ email, reason: "paid" });
      continue;
    }

    // Skip if already received this blast
    if ((user.nurtureEmailsSent || []).includes(BLAST_TAG)) {
      results.skipped.push({ email, reason: "already_sent" });
      continue;
    }

    if (!email) {
      results.skipped.push({ email: doc.id, reason: "no_email" });
      continue;
    }

    if (dryRun) {
      results.sent.push({ email, name, dryRun: true });
      continue;
    }

    try {
      const result = await sendEmail("tradingOffer", email, { name, coupon, discountPct, expiry });

      if (result.success) {
        // Mark as sent so we never re-blast
        await db.collection("users").doc(doc.id).update({
          nurtureEmailsSent: [...(user.nurtureEmailsSent || []), BLAST_TAG],
        });
        results.sent.push({ email, name });
      } else {
        results.failed.push({ email, error: result.error });
      }
    } catch (err) {
      results.failed.push({ email, error: err.message });
    }

    await sleep(DELAY_MS);
  }

  console.log("[blast-trading-offer]", JSON.stringify({
    sent: results.sent.length,
    skipped: results.skipped.length,
    failed: results.failed.length,
  }));

  return NextResponse.json({
    success: true,
    dryRun,
    coupon,
    discountPct,
    expiry,
    counts: {
      sent:    results.sent.length,
      skipped: results.skipped.length,
      failed:  results.failed.length,
    },
    results,
  });
}

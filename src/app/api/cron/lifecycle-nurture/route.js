/**
 * GET /api/cron/lifecycle-nurture
 *
 * Runs daily (9:30 AM IST = 04:00 UTC) and sends time-based nurture emails
 * to users based on how many days since they signed up.
 *
 * Sequences:
 *   Day 3  → Activation email (run your first backtest)
 *   Day 7  → Re-engagement nudge (market moved, come back)
 *   Day 14 → Upgrade email (free users only — pitch Pro)
 *
 * Idempotency: each sequence type is tracked in user.nurtureEmailsSent[]
 * so the same email is never sent twice to the same user.
 */
export const runtime = "nodejs";
export const maxDuration = 300;

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/sender";

const CRON_SECRET = process.env.EMAIL_CRON_SECRET;

// Window: users created between maxDaysAgo and minDaysAgo ago.
// Wide ranges (not exact 1-day slots) so a missed cron run self-heals on the
// next run — idempotency is guaranteed by nurtureEmailsSent[], not the window.
function dayWindow(minDaysAgo, maxDaysAgo) {
  const now = Date.now();
  const msPerDay = 86400000;
  return {
    from: new Date(now - maxDaysAgo * msPerDay),
    to:   new Date(now - minDaysAgo * msPerDay),
  };
}

async function getUsersInWindow(db, { from, to }, planFilter = null) {
  let q = db.collection("users")
    .where("createdAt", ">=", from.toISOString())
    .where("createdAt", "<",  to.toISOString());

  if (planFilter) q = q.where("plan", "==", planFilter);

  const snap = await q.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

const DELAY_MS = 700; // sequential sends — stay under Resend's rate limit
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendSequence({ db, users, sequenceKey, emailType, props = {} }) {
  const results = { sent: 0, skipped: 0, failed: 0 };

  for (const user of users) {
    if (!user.email) { results.skipped++; continue; }

    // Skip if already sent this sequence
    const alreadySent = (user.nurtureEmailsSent || []).includes(sequenceKey);
    if (alreadySent) { results.skipped++; continue; }

    const name = user.displayName || user.email.split("@")[0];

    const result = await sendEmail(emailType, user.email, { name, email: user.email, ...props })
      .catch((e) => ({ success: false, error: e.message }));

    if (result.success) {
      // Mark as sent so we never re-send
      await db.collection("users").doc(user.id).update({
        nurtureEmailsSent: [...(user.nurtureEmailsSent || []), sequenceKey],
      });
      results.sent++;
    } else {
      results.failed++;
    }

    await sleep(DELAY_MS);
  }

  return results;
}

// Send a one-tap renewal reminder to paid users whose subscription expires
// within the next 3 days. Idempotent per billing cycle via a renewal_<date> key.
async function sendRenewalReminders(db) {
  const results = { sent: 0, skipped: 0, failed: 0 };
  const now = Date.now();
  const horizon = now + 3 * 86400000;

  let snap;
  try {
    snap = await db.collection("users").where("plan", "in", ["pro", "elite"]).get();
  } catch {
    return results; // no paid users / index issue — nothing to do
  }

  await Promise.allSettled(
    snap.docs.map(async (doc) => {
      const user = { id: doc.id, ...doc.data() };
      if (!user.email || !user.subscriptionExpiry) { results.skipped++; return; }

      const exp = new Date(user.subscriptionExpiry).getTime();
      if (!Number.isFinite(exp) || exp < now || exp > horizon) { results.skipped++; return; }

      const expiryDate = user.subscriptionExpiry.slice(0, 10);
      const sequenceKey = `renewal_${expiryDate}`;
      if ((user.nurtureEmailsSent || []).includes(sequenceKey)) { results.skipped++; return; }

      const daysLeft = Math.max(0, Math.ceil((exp - now) / 86400000));
      const name = user.displayName || user.email.split("@")[0];

      const result = await sendEmail("renewal", user.email, {
        name, email: user.email, plan: (user.plan || "pro"), expiryDate, daysLeft,
      });

      if (result.success) {
        await db.collection("users").doc(user.id).update({
          nurtureEmailsSent: [...(user.nurtureEmailsSent || []), sequenceKey],
        });
        results.sent++;
      } else {
        results.failed++;
      }
    })
  );

  return results;
}

export async function GET(request) {
  // Vercel Cron passes the secret via Authorization header
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminFirestore();
  const log = {};

  try {
    // ── Day 3: Activation ─────────────────────────────────────────────────────
    const day3Users = await getUsersInWindow(db, dayWindow(3, 7));
    log.day3 = await sendSequence({
      db,
      users: day3Users,
      sequenceKey: "day3",
      emailType: "day3",
    });

    // ── Day 7: Re-engagement nudge (free users only) ──────────────────────────
    const day7Users = await getUsersInWindow(db, dayWindow(7, 14));
    const day7Free  = day7Users.filter((u) => !u.plan || u.plan === "free");
    log.day7 = await sendSequence({
      db,
      users: day7Free,
      sequenceKey: "day7",
      emailType: "nudge",
      props: { daysSinceLogin: 7 },
    });

    // ── Day 14: Upgrade pitch (free users only) ───────────────────────────────
    const day14Users = await getUsersInWindow(db, dayWindow(14, 30));
    const day14Free  = day14Users.filter((u) => !u.plan || u.plan === "free");
    log.day14 = await sendSequence({
      db,
      users: day14Free,
      sequenceKey: "day14",
      emailType: "day14",
    });

    // ── Renewal reminder: paid plans expiring within 3 days ───────────────────
    // Monthly/annual plans are one-time Razorpay orders (no auto-recurring), so
    // a lapse is silent unless we nudge. Keyed per expiry date so each billing
    // cycle gets its own reminder.
    log.renewal = await sendRenewalReminders(db);

    console.log("[lifecycle-nurture]", JSON.stringify(log));

    return NextResponse.json({ success: true, results: log });
  } catch (err) {
    console.error("[lifecycle-nurture] Fatal:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

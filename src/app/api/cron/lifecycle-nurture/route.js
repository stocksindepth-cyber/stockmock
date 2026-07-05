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

async function sendSequence({ db, users, sequenceKey, emailType, props = {} }) {
  const results = { sent: 0, skipped: 0, failed: 0 };

  await Promise.allSettled(
    users.map(async (user) => {
      if (!user.email) { results.skipped++; return; }

      // Skip if already sent this sequence
      const alreadySent = (user.nurtureEmailsSent || []).includes(sequenceKey);
      if (alreadySent) { results.skipped++; return; }

      const name = user.displayName || user.email.split("@")[0];

      const result = await sendEmail(emailType, user.email, { name, email: user.email, ...props });

      if (result.success) {
        // Mark as sent so we never re-send
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

    console.log("[lifecycle-nurture]", JSON.stringify(log));

    return NextResponse.json({ success: true, results: log });
  } catch (err) {
    console.error("[lifecycle-nurture] Fatal:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

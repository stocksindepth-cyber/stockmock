// POST /api/referral/reward
// Called after a referred user runs a backtest. Grants REFERRAL_REWARD_CREDITS
// to BOTH the referee and their referrer — exactly once, gated on real
// activation (a backtest) so fake signups can't farm credits.
//
// Auth: Authorization: Bearer <firebase-id-token>
// Idempotent via the user's `referralRewarded` flag.
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminApp, getAdminFirestore } from "@/lib/firebase/admin";
import { REFERRAL_REWARD_CREDITS } from "@/lib/referral";

async function authUid(request) {
  const h = request.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) return null;
  try {
    const decoded = await admin.auth(getAdminApp()).verifyIdToken(h.slice(7).trim());
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function POST(request) {
  const uid = await authUid(request);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminFirestore();
  const meRef = db.doc(`users/${uid}`);

  try {
    // Atomic check-and-set so concurrent backtests can't double-grant.
    const result = await db.runTransaction(async (tx) => {
      const meSnap = await tx.get(meRef);
      if (!meSnap.exists) return { granted: false, reason: "no_profile" };
      const me = meSnap.data();
      if (!me.referredBy) return { granted: false, reason: "not_referred" };
      if (me.referralRewarded) return { granted: false, reason: "already_rewarded" };

      const referrerRef = db.doc(`users/${me.referredBy}`);
      const referrerSnap = await tx.get(referrerRef);
      if (!referrerSnap.exists) {
        // Referrer gone — still mark rewarded so we don't retry forever.
        tx.set(meRef, { referralRewarded: true }, { merge: true });
        return { granted: false, reason: "referrer_missing" };
      }

      tx.set(meRef, {
        referralRewarded: true,
        backtestCredits: admin.firestore.FieldValue.increment(REFERRAL_REWARD_CREDITS),
      }, { merge: true });
      tx.set(referrerRef, {
        backtestCredits: admin.firestore.FieldValue.increment(REFERRAL_REWARD_CREDITS),
        referralConversions: admin.firestore.FieldValue.increment(1),
      }, { merge: true });

      return { granted: true, credits: REFERRAL_REWARD_CREDITS };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[referral/reward]", err.message);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

// POST /api/referral/attach
// Called right after a NEW user signs up. Binds the new user to their referrer
// (from the og_ref cookie or a `code` in the body) exactly once.
//
// Auth: Authorization: Bearer <firebase-id-token>
// Idempotent: only sets referredBy if it isn't already set, and never lets a
// user refer themselves.
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminApp, getAdminFirestore } from "@/lib/firebase/admin";
import { codeFromUid, REFERRAL_COOKIE } from "@/lib/referral";

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

  const body = await request.json().catch(() => ({}));
  const code = (body.code || request.cookies.get(REFERRAL_COOKIE)?.value || "")
    .toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  if (!code) return NextResponse.json({ ok: true, attached: false, reason: "no_code" });

  // A user can never be their own referrer.
  if (code === codeFromUid(uid)) {
    return NextResponse.json({ ok: true, attached: false, reason: "self" });
  }

  const db = getAdminFirestore();

  try {
    const meRef = db.doc(`users/${uid}`);
    const meSnap = await meRef.get();
    if (!meSnap.exists) return NextResponse.json({ ok: true, attached: false, reason: "no_profile" });
    if (meSnap.data().referredBy) {
      return NextResponse.json({ ok: true, attached: false, reason: "already_attached" });
    }

    // Resolve code → referrer uid via the mapping doc.
    const mapSnap = await db.doc(`referralCodes/${code}`).get();
    if (!mapSnap.exists) return NextResponse.json({ ok: true, attached: false, reason: "unknown_code" });
    const referrerUid = mapSnap.data().uid;
    if (!referrerUid || referrerUid === uid) {
      return NextResponse.json({ ok: true, attached: false, reason: "invalid_referrer" });
    }

    await meRef.set({ referredBy: referrerUid, referralCode: codeFromUid(uid) }, { merge: true });
    await db.doc(`users/${referrerUid}`).set(
      { referralSignups: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );

    return NextResponse.json({ ok: true, attached: true });
  } catch (err) {
    console.error("[referral/attach]", err.message);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

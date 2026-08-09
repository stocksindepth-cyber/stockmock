// Refer-to-unlock: a user who opened a Dhan account via our link submits their
// Dhan Client ID here to claim OptionsGyani Pro free. Creates one pending
// request per user; a human approves it in the admin queue (see
// /api/admin/unlock), which is what actually grants Pro. Nothing here changes
// the user's plan — the client can never self-upgrade.
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminApp, getAdminFirestore } from "@/lib/firebase/admin";

async function authUser(request) {
  const h = request.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) return null;
  try {
    const decoded = await admin.auth(getAdminApp()).verifyIdToken(h.slice(7).trim());
    return { uid: decoded.uid, email: decoded.email || null };
  } catch {
    return null;
  }
}

export async function GET(request) {
  const user = await authUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdminFirestore();
  const snap = await db.doc(`unlockRequests/${user.uid}`).get();
  const userSnap = await db.doc(`users/${user.uid}`).get();
  const plan = userSnap.exists ? (userSnap.data().plan || "free") : "free";
  return NextResponse.json({
    status: snap.exists ? snap.data().status : "none",
    dhanClientId: snap.exists ? snap.data().dhanClientId : null,
    plan,
    unlocked: plan !== "free",
  });
}

export async function POST(request) {
  const user = await authUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const dhanClientId = String(body.dhanClientId || "").trim();
  const firstTradeDone = Boolean(body.firstTradeDone);
  // Dhan client IDs are numeric, ~7–12 digits. Basic sanity only.
  if (!/^\d{6,15}$/.test(dhanClientId)) {
    return NextResponse.json({ error: "Enter a valid Dhan Client ID (digits only, from your Dhan profile)." }, { status: 400 });
  }

  const db = getAdminFirestore();

  // If already Pro, nothing to do.
  const userSnap = await db.doc(`users/${user.uid}`).get();
  if (userSnap.exists && (userSnap.data().plan || "free") !== "free") {
    return NextResponse.json({ ok: true, status: "already_pro" });
  }

  const ref = db.doc(`unlockRequests/${user.uid}`);
  const existing = await ref.get();
  if (existing.exists && existing.data().status === "approved") {
    return NextResponse.json({ ok: true, status: "approved" });
  }

  await ref.set({
    uid: user.uid,
    email: user.email,
    dhanClientId,
    firstTradeDone,
    status: "pending",
    createdAt: new Date().toISOString(),
  }, { merge: true });

  return NextResponse.json({ ok: true, status: "pending" });
}

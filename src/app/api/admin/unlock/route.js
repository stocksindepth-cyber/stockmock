// Admin queue for the Dhan refer-to-unlock flow.
//   GET  — list pending requests (review the Dhan Client IDs).
//   POST — { uid, action: "approve" | "reject" }. Approving grants Pro FREE
//          (lifetime) via the Admin SDK, which bypasses security rules — the
//          only place a plan can be elevated.
// Auth: x-admin-secret header.
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminFirestore } from "@/lib/firebase/admin";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function authed(request) {
  const h = request.headers.get("x-admin-secret");
  return ADMIN_SECRET && h === ADMIN_SECRET;
}

export async function GET(request) {
  if (!authed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdminFirestore();
  const status = new URL(request.url).searchParams.get("status") || "pending";
  const snap = await db.collection("unlockRequests").where("status", "==", status).get();
  const items = snap.docs
    .map((d) => d.data())
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return NextResponse.json({ count: items.length, items });
}

export async function POST(request) {
  if (!authed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { uid, action } = await request.json().catch(() => ({}));
  if (!uid || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Provide uid and action (approve|reject)." }, { status: 400 });
  }

  const db = getAdminFirestore();
  const reqRef = db.doc(`unlockRequests/${uid}`);
  const reqSnap = await reqRef.get();
  if (!reqSnap.exists) return NextResponse.json({ error: "No unlock request for that uid." }, { status: 404 });

  if (action === "reject") {
    await reqRef.set({ status: "rejected", reviewedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // Approve → grant Pro free for life.
  await db.doc(`users/${uid}`).set({
    plan: "pro",
    simulationsLimit: 999999,
    subscriptionExpiry: null,        // lifetime
    unlockedVia: "dhan_referral",
    unlockedAt: new Date().toISOString(),
  }, { merge: true });
  await reqRef.set({
    status: "approved",
    reviewedAt: new Date().toISOString(),
  }, { merge: true });

  return NextResponse.json({ ok: true, status: "approved", uid });
}

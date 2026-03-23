export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { invalidateDhanTokenCache } from "@/lib/data/dhanApi";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request) {
  try {
    // Auth
    const authHeader = request.headers.get("x-admin-secret");
    if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { accessToken } = body;
    if (!accessToken || typeof accessToken !== "string" || accessToken.trim().length < 20) {
      return NextResponse.json({ error: "Invalid token — must be at least 20 characters" }, { status: 400 });
    }

    const trimmed = accessToken.trim();
    const updatedAt = new Date().toISOString();

    // Save to Firestore
    const db = getAdminFirestore();
    await db.doc("admin/dhan").set({ accessToken: trimmed, updatedAt }, { merge: true });

    // Bust in-memory cache so next chain request picks up new token immediately
    invalidateDhanTokenCache();

    return NextResponse.json({ ok: true, updatedAt });
  } catch (err) {
    console.error("[dhan-token POST]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("x-admin-secret");
    if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db  = getAdminFirestore();
    const doc = await db.doc("admin/dhan").get();

    if (!doc.exists) {
      return NextResponse.json({ configured: false });
    }

    const { updatedAt, renewedAt, lastRenewStatus, lastRenewError } = doc.data();
    return NextResponse.json({ configured: true, updatedAt, renewedAt, lastRenewStatus, lastRenewError });
  } catch (err) {
    console.error("[dhan-token GET]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

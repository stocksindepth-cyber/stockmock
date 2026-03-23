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

    const { accessToken, updatedAt } = doc.data();

    // Show first/last 6 chars of the stored token so you can verify it matches Dhan portal
    const preview = accessToken
      ? `${accessToken.slice(0, 6)}...${accessToken.slice(-6)} (${accessToken.length} chars)`
      : "empty";

    // Check whether env var override is active (overrides Firestore)
    const envTokenSet  = !!process.env.DHAN_ACCESS_TOKEN;
    const envPreview   = envTokenSet
      ? `${process.env.DHAN_ACCESS_TOKEN.slice(0, 6)}...${process.env.DHAN_ACCESS_TOKEN.slice(-6)} (${process.env.DHAN_ACCESS_TOKEN.length} chars)`
      : null;

    return NextResponse.json({
      configured:   true,
      updatedAt,
      tokenPreview: preview,
      clientId:     process.env.NEXT_PUBLIC_DHAN_CLIENT_ID || "NOT SET",
      envTokenOverride: envTokenSet
        ? { active: true, preview: envPreview, warning: "DHAN_ACCESS_TOKEN env var is overriding Firestore — delete it from Vercel to use Firestore token" }
        : { active: false },
    });
  } catch (err) {
    console.error("[dhan-token GET]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

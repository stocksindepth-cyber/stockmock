import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { invalidateDhanTokenCache } from "@/lib/data/dhanApi";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request) {
  // Verify secret
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accessToken } = await request.json();
  if (!accessToken || accessToken.length < 20) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const db = getAdminFirestore();
  await db.doc("admin/dhan").set({
    accessToken,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  // Clear in-memory cache so next request picks up the new token
  invalidateDhanTokenCache();

  return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() });
}

export async function GET(request) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db  = getAdminFirestore();
  const doc = await db.doc("admin/dhan").get();
  if (!doc.exists) {
    return NextResponse.json({ configured: false });
  }
  const { updatedAt } = doc.data();
  return NextResponse.json({ configured: true, updatedAt });
}

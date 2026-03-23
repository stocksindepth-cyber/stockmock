export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { invalidateDhanTokenCache } from "@/lib/data/dhanApi";

/**
 * Dhan Token Auto-Renewal
 *
 * Called by Vercel Cron every 12 hours (see vercel.json).
 * Also callable manually from the admin UI with x-admin-secret header.
 *
 * Dhan's RenewToken endpoint extends the current token's validity by 24 hours.
 * Must be called while the token is still active — never after it has expired.
 *
 * POST /api/cron/dhan-renew
 */
export async function POST(request) {
  // ── Auth: accept either Vercel cron secret OR admin secret ─────────────────
  const authHeader = request.headers.get("authorization") || "";
  const adminHeader = request.headers.get("x-admin-secret") || "";

  const cronSecret  = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;

  const validCron  = cronSecret  && authHeader === `Bearer ${cronSecret}`;
  const validAdmin = adminSecret && adminHeader === adminSecret;

  if (!validCron && !validAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── 1. Read current token from Firestore ──────────────────────────────────
    const db  = getAdminFirestore();
    const doc = await db.doc("admin/dhan").get();

    if (!doc.exists || !doc.data()?.accessToken) {
      return NextResponse.json(
        { error: "No Dhan token found in Firestore. Please set one first via the admin panel." },
        { status: 400 }
      );
    }

    const { accessToken: currentToken } = doc.data();
    const clientId = process.env.NEXT_PUBLIC_DHAN_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json({ error: "NEXT_PUBLIC_DHAN_CLIENT_ID not set" }, { status: 500 });
    }

    // ── 2. Call Dhan RenewToken endpoint ──────────────────────────────────────
    const dhanRes = await fetch("https://api.dhan.co/v2/RenewToken", {
      method: "POST",
      headers: {
        "access-token":  currentToken,
        "dhanClientId":  clientId,
        "Content-Type":  "application/json",
        "Accept":        "application/json",
      },
      cache: "no-store",
    });

    const text = await dhanRes.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { /* non-JSON response */ }

    if (!dhanRes.ok) {
      const errMsg = data?.errorMessage || data?.message || data?.error || text || `HTTP ${dhanRes.status}`;
      console.error("[dhan-renew] Dhan API error:", errMsg);

      // Log failed attempt to Firestore
      await db.doc("admin/dhan").set({
        lastRenewAttempt: new Date().toISOString(),
        lastRenewStatus:  "error",
        lastRenewError:   errMsg,
      }, { merge: true });

      return NextResponse.json({ error: `Dhan renewal failed: ${errMsg}` }, { status: 502 });
    }

    // ── 3. Extract new token from response ────────────────────────────────────
    // Dhan's response format is not publicly documented — try all known field names.
    // If no new token is returned, the same token was extended (valid approach per some broker APIs).
    const newToken =
      data?.accessToken    ||
      data?.access_token   ||
      data?.token          ||
      data?.data?.accessToken ||
      data?.data?.access_token ||
      null;

    const renewedAt  = new Date().toISOString();
    const tokenToSave = newToken || currentToken; // same token if Dhan just extended it

    // ── 4. Save back to Firestore ─────────────────────────────────────────────
    await db.doc("admin/dhan").set({
      accessToken:      tokenToSave,
      renewedAt,
      lastRenewAttempt: renewedAt,
      lastRenewStatus:  "success",
      lastRenewError:   null,
      tokenRotated:     !!newToken, // true if Dhan returned a fresh token
    }, { merge: true });

    // Bust in-memory cache so API routes pick up renewed token immediately
    invalidateDhanTokenCache();

    console.log(`[dhan-renew] Token ${newToken ? "rotated" : "extended"} at ${renewedAt}`);

    return NextResponse.json({
      ok:           true,
      renewedAt,
      tokenRotated: !!newToken,
    });

  } catch (err) {
    console.error("[dhan-renew] Unexpected error:", err);

    // Log to Firestore so admin UI can show it
    try {
      const db = getAdminFirestore();
      await db.doc("admin/dhan").set({
        lastRenewAttempt: new Date().toISOString(),
        lastRenewStatus:  "error",
        lastRenewError:   err.message,
      }, { merge: true });
    } catch { /* don't let logging failure mask original error */ }

    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

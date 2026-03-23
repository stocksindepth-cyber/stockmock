/**
 * GET  /api/alerts         — fetch all IV alerts for the authenticated user
 * POST /api/alerts         — create a new IV alert
 * DELETE /api/alerts?id=   — delete an alert by ID
 *
 * All methods require a Firebase ID token in the Authorization header:
 *   Authorization: Bearer <firebase-id-token>
 *
 * Alert document lives at: users/{uid}/alerts/{alertId}
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminApp, getAdminFirestore } from "@/lib/firebase/admin";

// ── Constants ──────────────────────────────────────────────────────────────────

const VALID_SYMBOLS    = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
const VALID_METRICS    = ["ivp", "ivr", "iv"];
const VALID_CONDITIONS = ["above", "below"];

const FREE_ALERT_LIMIT = 5;
const PRO_ALERT_LIMIT  = 20;

// ── Shared auth helper ─────────────────────────────────────────────────────────

async function authenticate(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { error: "Missing or malformed Authorization header", status: 401 };
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return { error: "Empty bearer token", status: 401 };
  }

  try {
    const decodedToken = await admin.auth(getAdminApp()).verifyIdToken(token);
    return { uid: decodedToken.uid, email: decodedToken.email || null };
  } catch (err) {
    console.error("[alerts] Token verification failed:", err.message);
    return { error: "Invalid or expired Firebase ID token", status: 401 };
  }
}

// ── GET — return all alerts for the user ──────────────────────────────────────

export async function GET(request) {
  const auth = await authenticate(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const db      = getAdminFirestore();
    const snap    = await db
      .collection("users")
      .doc(auth.uid)
      .collection("alerts")
      .orderBy("createdAt", "desc")
      .get();

    const alerts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("[alerts GET]", err.message);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// ── POST — create a new alert ──────────────────────────────────────────────────

export async function POST(request) {
  const auth = await authenticate(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { symbol, metric, condition, threshold } = body;

  // ── Validation ─────────────────────────────────────────────────────────────
  const validationErrors = [];

  if (!symbol || !VALID_SYMBOLS.includes(symbol)) {
    validationErrors.push(`symbol must be one of: ${VALID_SYMBOLS.join(", ")}`);
  }
  if (!metric || !VALID_METRICS.includes(metric)) {
    validationErrors.push(`metric must be one of: ${VALID_METRICS.join(", ")}`);
  }
  if (!condition || !VALID_CONDITIONS.includes(condition)) {
    validationErrors.push(`condition must be one of: ${VALID_CONDITIONS.join(", ")}`);
  }
  if (threshold === undefined || threshold === null || typeof threshold !== "number" || isNaN(threshold)) {
    validationErrors.push("threshold must be a number");
  }

  if (validationErrors.length > 0) {
    return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 });
  }

  const db = getAdminFirestore();

  try {
    // ── Check user plan & alert cap ────────────────────────────────────────
    const userDoc = await db.collection("users").doc(auth.uid).get();
    const plan    = userDoc.exists ? (userDoc.data()?.plan || "free") : "free";
    const limit   = plan === "pro" ? PRO_ALERT_LIMIT : FREE_ALERT_LIMIT;

    const existingSnap = await db
      .collection("users")
      .doc(auth.uid)
      .collection("alerts")
      .count()
      .get();

    const existingCount = existingSnap.data().count;

    if (existingCount >= limit) {
      return NextResponse.json(
        {
          error: "Alert limit reached",
          limit,
          plan,
          message:
            plan === "free"
              ? `Free plan allows up to ${FREE_ALERT_LIMIT} alerts. Upgrade to Pro for up to ${PRO_ALERT_LIMIT}.`
              : `Pro plan allows up to ${PRO_ALERT_LIMIT} alerts.`,
        },
        { status: 403 }
      );
    }

    // ── Build and save the alert document ─────────────────────────────────
    const now       = new Date().toISOString();
    const alertData = {
      symbol,
      metric,
      condition,
      threshold,
      notifyEmail:      auth.email || "",
      active:           true,
      createdAt:        now,
      lastTriggeredAt:  null,
      cooldownHours:    24,
    };

    const docRef = await db
      .collection("users")
      .doc(auth.uid)
      .collection("alerts")
      .add(alertData);

    const saved = { id: docRef.id, ...alertData };

    console.log(`[alerts POST] Created alert ${docRef.id} for uid=${auth.uid} (${symbol} ${metric} ${condition} ${threshold})`);

    return NextResponse.json({ alert: saved }, { status: 201 });
  } catch (err) {
    console.error("[alerts POST]", err.message);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// ── DELETE — remove an alert by ID ────────────────────────────────────────────

export async function DELETE(request) {
  const auth = await authenticate(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing query parameter: id" }, { status: 400 });
  }

  try {
    const db      = getAdminFirestore();
    const docRef  = db.collection("users").doc(auth.uid).collection("alerts").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await docRef.delete();

    console.log(`[alerts DELETE] Deleted alert ${id} for uid=${auth.uid}`);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("[alerts DELETE]", err.message);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

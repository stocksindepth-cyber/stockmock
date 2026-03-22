// ─── /api/razorpay/verify ────────────────────────────────────────────────────
// Server-side Razorpay payment verification.
// Called from the client AFTER Razorpay checkout completes.
// 1. Verifies HMAC signature using RAZORPAY_KEY_SECRET
// 2. Activates the user's subscription in Firestore via Admin SDK
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminFirestore } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,     // e.g. "pro" | "elite"
      durationDays,
    } = await request.json();

    // ── 1. Validate required fields ──────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !planId) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    // ── 2. Verify Razorpay signature ─────────────────────────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[Razorpay Verify] RAZORPAY_KEY_SECRET not set");
      return NextResponse.json({ error: "Payment verification not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[Razorpay Verify] Signature mismatch — possible tampered request");
      return NextResponse.json({ error: "Payment verification failed — invalid signature" }, { status: 400 });
    }

    // ── 3. Activate subscription in Firestore via Admin SDK ───────────────────
    const db = getAdminFirestore();
    const days = durationDays || 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    // Update user's plan
    await db.doc(`users/${userId}`).update({
      plan: planId,
      simulationsLimit: 999999,
      subscriptionExpiry: expiryDate.toISOString(),
      lastPaymentId: razorpay_payment_id,
      lastPaymentDate: new Date().toISOString(),
    });

    // Record transaction
    await db.collection("transactions").add({
      userId,
      purchasedPlan: planId,
      durationDays: days,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: days === 365 ? (planId === "elite" ? 79900 : 39900) : (planId === "elite" ? 99900 : 49900),
      currency: "INR",
      status: "PAID_SUCCESS",
      source: "razorpay_verified",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[Razorpay Verify] ✓ User ${userId} upgraded to ${planId} (${days} days). Payment: ${razorpay_payment_id}`);

    return NextResponse.json({
      success: true,
      plan: planId,
      expiresAt: expiryDate.toISOString(),
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("[Razorpay Verify] Error:", error);
    return NextResponse.json({ error: "Internal server error during verification" }, { status: 500 });
  }
}

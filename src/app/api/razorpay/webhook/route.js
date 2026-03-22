// ─── /api/razorpay/webhook ────────────────────────────────────────────────────
// Razorpay sends events here after payment lifecycle changes.
// This is a server-side BACKUP — the verify endpoint handles the primary flow.
// Configure in Razorpay Dashboard → Webhooks:
//   URL:    https://optionsgyani.in/api/razorpay/webhook
//   Events: payment.captured, payment.failed
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminFirestore } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // ── Verify webhook signature ──────────────────────────────────────────────
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("[Razorpay Webhook] Invalid signature — rejected");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check");
    }

    const event = JSON.parse(body);
    console.log("[Razorpay Webhook] Event:", event.event);

    // ── Handle payment captured ───────────────────────────────────────────────
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const { userId, planId } = payment.notes || {};

      if (!userId || !planId) {
        console.warn("[Razorpay Webhook] Missing userId or planId in payment notes — skipping");
        return NextResponse.json({ status: "ok", note: "no userId in notes" });
      }

      const isAnnual = planId.includes("annual") || (payment.description || "").toLowerCase().includes("annual");
      const durationDays = isAnnual ? 365 : 30;
      const dbPlan = planId.replace("_monthly", "").replace("_annual", ""); // "pro" | "elite"

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + durationDays);

      const db = getAdminFirestore();

      // Idempotency check — don't double-process the same payment
      const existing = await db.collection("transactions")
        .where("razorpayPaymentId", "==", payment.id)
        .limit(1)
        .get();

      if (!existing.empty) {
        console.log(`[Razorpay Webhook] Payment ${payment.id} already processed — skipping`);
        return NextResponse.json({ status: "ok", note: "already processed" });
      }

      // Upgrade the user's plan
      await db.doc(`users/${userId}`).update({
        plan: dbPlan,
        simulationsLimit: 999999,
        subscriptionExpiry: expiryDate.toISOString(),
        lastPaymentId: payment.id,
        lastPaymentDate: new Date().toISOString(),
      });

      // Record transaction
      await db.collection("transactions").add({
        userId,
        purchasedPlan: dbPlan,
        durationDays,
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: "PAID_SUCCESS",
        source: "razorpay_webhook",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`[Razorpay Webhook] ✓ User ${userId} upgraded to ${dbPlan}. Payment: ${payment.id}`);
    }

    // ── Handle payment failed ─────────────────────────────────────────────────
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const { userId, planId } = payment.notes || {};
      console.warn(`[Razorpay Webhook] Payment failed — user: ${userId}, plan: ${planId}, reason: ${payment.error_description}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

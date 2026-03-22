import { NextResponse } from "next/server";
import crypto from "crypto";

// Razorpay Webhook Verification — called by Razorpay after successful payment
// Set webhook secret in: https://dashboard.razorpay.com/app/webhooks
export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set. Skipping verification.");
    } else {
      // Verify signature to ensure request is legitimately from Razorpay
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("[Razorpay Webhook] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(body);
    console.log("[Razorpay Webhook] Event received:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const { userId, planId } = payment.notes || {};
      console.log(`[Razorpay Webhook] Payment captured for user ${userId}, plan ${planId}`);
      // Firestore upgrade is handled client-side after Razorpay JS confirms success.
      // This webhook is a server-side backup for reliability.
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

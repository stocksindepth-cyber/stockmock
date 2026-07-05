import { NextResponse } from "next/server";
import { PLAN_PRICES, PRODUCT_BRAND, getPlanAmount } from "@/lib/planPricing";

// ── Server-side coupon registry (single source of truth — never trust client price) ──
const COUPONS = {
  OG30: { discountPct: 30, expiresAt: "2026-07-09T23:59:59+05:30", active: true, plans: ["pro", "elite"] },
};

function applyCoupon(code, planId, originalAmount) {
  if (!code) return { finalAmount: originalAmount, discountPct: 0, discountAmount: 0 };
  const coupon = COUPONS[code.trim().toUpperCase()];
  if (!coupon || !coupon.active) return { finalAmount: originalAmount, discountPct: 0, discountAmount: 0 };
  if (new Date() > new Date(coupon.expiresAt)) return { finalAmount: originalAmount, discountPct: 0, discountAmount: 0 };
  if (coupon.plans && !coupon.plans.includes(planId)) return { finalAmount: originalAmount, discountPct: 0, discountAmount: 0 };
  const discountAmount = Math.round(originalAmount * coupon.discountPct / 100);
  return { finalAmount: originalAmount - discountAmount, discountPct: coupon.discountPct, discountAmount };
}

export async function POST(request) {
  try {
    const { planId, billing, planName, userId, couponCode } = await request.json();

    if (!planId || !userId || !billing) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Price is derived server-side from the registry — client never sets it
    const baseAmount = getPlanAmount(planId, billing);
    if (!baseAmount) {
      return NextResponse.json({ error: `Unknown plan/billing: ${planId}/${billing}` }, { status: 400 });
    }

    const { finalAmount, discountPct, discountAmount } = applyCoupon(couponCode, planId, baseAmount);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("[Razorpay] Keys not set — returning mock order for development");
      return NextResponse.json({
        mock: true,
        orderId: `mock_order_${Date.now()}`,
        amount: finalAmount * 100,
        currency: "INR",
        keyId: "mock_key",
        discountPct,
        finalAmount,
      });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${credentials}` },
      body: JSON.stringify({
        amount: finalAmount * 100,
        currency: "INR",
        receipt: `rcpt_${userId.substring(0, 10)}_${Date.now().toString(36)}`,
        notes: {
          userId,
          planId,
          billing,
          planName: planName || planId,
          product_brand: PRODUCT_BRAND,
          couponCode: couponCode || "",
          discountPct: String(discountPct),
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("[Razorpay] Create order error:", err);
      return NextResponse.json({ error: "Failed to create Razorpay order", details: err }, { status: 500 });
    }

    const order = await response.json();
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      discountPct,
      finalAmount,
      discountAmount,
    });
  } catch (error) {
    console.error("[Razorpay] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

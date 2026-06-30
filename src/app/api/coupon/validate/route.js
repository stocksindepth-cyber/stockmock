/**
 * POST /api/coupon/validate
 * Body: { code, planId }
 * Returns: { valid, discountPct, message, expiresAt }
 *
 * Coupon config lives server-side only — never exposed to the client
 * except the discount percentage and expiry.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";

// ── Server-side coupon registry ───────────────────────────────────────────────
const COUPONS = {
  OG30: {
    discountPct: 30,
    expiresAt:   "2026-07-07T23:59:59+05:30", // 7-day window for FOMO
    active:      true,
    plans:       ["pro", "elite"], // applicable plans
    description: "30% off — launch week special",
  },
};

export async function POST(request) {
  try {
    const { code, planId } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, message: "Enter a coupon code." });
    }

    const coupon = COUPONS[code.trim().toUpperCase()];

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code." });
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ valid: false, message: "This coupon has expired." });
    }

    if (planId && coupon.plans && !coupon.plans.includes(planId)) {
      return NextResponse.json({ valid: false, message: `This coupon applies to Pro and Elite plans only.` });
    }

    return NextResponse.json({
      valid:       true,
      discountPct: coupon.discountPct,
      expiresAt:   coupon.expiresAt,
      message:     `${coupon.discountPct}% off applied!`,
    });
  } catch (err) {
    console.error("[/api/coupon/validate]", err.message);
    return NextResponse.json({ valid: false, message: "Could not validate coupon." });
  }
}

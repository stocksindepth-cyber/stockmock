import { NextResponse } from "next/server";

// Razorpay Order Creation API
// Requires env vars: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
// Get your keys from https://dashboard.razorpay.com/app/keys
export async function POST(request) {
  try {
    const { amount, planId, planName, userId } = await request.json();

    if (!amount || !planId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Fallback to mock mode for development without Razorpay keys
      console.warn("[Razorpay] Keys not set — returning mock order for development");
      return NextResponse.json({
        mock: true,
        orderId: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        keyId: "mock_key",
      });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt: `receipt_${planId}_${userId.substring(0, 8)}_${Date.now()}`,
        notes: {
          userId,
          planId,
          planName,
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
    });
  } catch (error) {
    console.error("[Razorpay] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

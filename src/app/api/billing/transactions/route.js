import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  try {
    const db = getAdminFirestore();
    const snap = await db
      .collection("transactions")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const transactions = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        purchasedPlan: d.purchasedPlan,
        durationDays: d.durationDays,
        razorpayOrderId: d.razorpayOrderId,
        razorpayPaymentId: d.razorpayPaymentId,
        amount: d.amount,          // paise
        currency: d.currency || "INR",
        status: d.status,
        timestamp: d.timestamp?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error("[billing/transactions]", err);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

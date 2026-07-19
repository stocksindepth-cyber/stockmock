// ─── Razorpay checkout helper ────────────────────────────────────────────────
// Lets any surface (e.g. the daily-limit upgrade modal) start a purchase without
// bouncing the user to /pricing first. Prices are resolved SERVER-side from the
// plan registry — nothing here can influence the amount charged.

let scriptPromise = null;
function loadRazorpay() {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = resolve;
      s.onerror = () => { scriptPromise = null; reject(new Error("Could not load Razorpay")); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Start a Razorpay purchase.
 * @param {object}   opts
 * @param {string}   opts.planId    "pro" | "elite" | "credits50"
 * @param {string}   opts.billing   "monthly" | "annual" | "onetime"
 * @param {object}   opts.user      Firebase user (needs uid, email, displayName)
 * @param {function} [opts.onError] called with an Error on failure/cancel
 */
export async function startCheckout({ planId, billing, user, onError }) {
  if (!user?.uid) {
    window.location.href = "/login?redirect=/backtest";
    return;
  }
  const durationDays = billing === "annual" ? 365 : billing === "onetime" ? null : 30;

  try {
    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, billing, planName: planId, userId: user.uid }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) throw new Error(order.error || "Could not start checkout");

    // Dev/no-keys path — the server tells us it's a mock order.
    if (order.mock) {
      window.location.href = "/pricing";
      return;
    }

    await loadRazorpay();

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.orderId,
      name: "OptionsGyani",
      description: planId === "credits50" ? "50 backtest credits" : `${planId} plan`,
      image: "/favicon.ico",
      prefill: { email: user.email || "", name: user.displayName || "" },
      theme: { color: "#6366F1" },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.uid,
              planId,
              billing,
              durationDays,
            }),
          });
          const data = await verifyRes.json();
          if (!verifyRes.ok || !data.success) throw new Error(data.error || "Verification failed");
          // Straight back to what they were doing, now unlocked.
          window.location.href = "/backtest?upgraded=1";
        } catch (err) {
          onError?.(new Error(
            `Payment went through but activation failed. Please contact support@optionsgyani.com with Payment ID ${response.razorpay_payment_id}.`
          ));
        }
      },
      modal: { ondismiss: () => onError?.(null) }, // null = user cancelled, not an error
    });
    rzp.open();
  } catch (err) {
    onError?.(err);
  }
}

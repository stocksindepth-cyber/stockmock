"use client";

import { useState } from "react";
import { Check, Shield, Zap, Target, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { upgradeUserPlan } from "@/lib/firebase/userService";

const ANALYTICS_PLANS = [
  {
    id: "analytics_starter",
    dbPlan: "pro", // Upgrades to pro in DB
    durationDays: 30,
    name: "Starter",
    price: "₹349",
    period: "1 Month (30 Days)",
    description: "Access unlimited times within Validity",
    features: ["Simulator Access", "Builder Access", "Advanced Charts", "Data since 1st Jan'21"],
    popular: false,
  },
  {
    id: "analytics_advanced",
    dbPlan: "pro",
    durationDays: 180,
    name: "Advanced",
    price: "₹1599",
    period: "6 Months (180 Days)",
    description: "Access unlimited times within Validity",
    features: ["Simulator Access", "Builder Access", "Advanced Charts", "Data since 1st Jan'21"],
    popular: true,
  },
  {
    id: "analytics_pro",
    dbPlan: "elite",
    durationDays: 360,
    name: "Pro",
    price: "₹2599",
    period: "1 Year (360 Days)",
    description: "Access unlimited times within Validity",
    features: ["Simulator Access", "Builder Access", "Advanced Charts", "Data since 1st Jan'21", "Priority Support"],
    popular: false,
  }
];

const BACKTESTING_PLANS = [
  {
    id: "backtest_starter",
    dbPlan: "pro",
    durationDays: 7,
    name: "Starter",
    originalPrice: "₹599",
    price: "₹449",
    period: "7 Days",
    description: "Unlimited Backtesting on Home and Basket Tab",
    features: ["Unlimited Automated Backtesting", "Banknifty data from 2017", "Nifty data from 2019", "Sensex data from 2023"],
    popular: false,
  },
  {
    id: "backtest_advanced",
    dbPlan: "pro",
    durationDays: 28,
    name: "Advanced",
    originalPrice: "₹1699",
    price: "₹1299",
    period: "28 Days",
    description: "Unlimited Backtesting on Home and Basket Tab",
    features: ["Unlimited Automated Backtesting", "Banknifty data from 2017", "Nifty data from 2019", "Sensex data from 2023"],
    popular: true,
  },
  {
    id: "backtest_pro",
    dbPlan: "elite",
    durationDays: 84,
    name: "Pro",
    originalPrice: "₹3999",
    price: "₹2999",
    period: "84 Days",
    description: "Unlimited Backtesting on Home and Basket Tab",
    features: ["Unlimited Automated Backtesting", "Banknifty data from 2017", "Nifty data from 2019", "Sensex data from 2023", "Priority Support"],
    popular: false,
  }
];

export default function PricingPage() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics");
  const [processingId, setProcessingId] = useState(null);

  const handleSubscribe = async (plan) => {
    if (!currentUser) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setProcessingId(plan.id);
    try {
      // Step 1: Create Razorpay order via our API
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(plan.price.replace(/[^0-9]/g, "")), // Strip ₹
          planId: plan.id,
          planName: plan.name,
          userId: currentUser.uid,
        }),
      });
      const order = await orderRes.json();

      if (order.mock) {
        // Development fallback: mock payment without Razorpay keys
        console.log("[Dev Mode] Mock payment for plan:", plan.id);
        await upgradeUserPlan(currentUser.uid, plan.dbPlan, plan.durationDays);
        window.location.href = "/profile?success=true";
        return;
      }

      // Step 2: Load Razorpay JS SDK dynamically
      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Step 3: Open Razorpay checkout popup
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: "INR",
          order_id: order.orderId,
          name: "OptionsGyani",
          description: `${plan.name} Plan — ${plan.period}`,
          image: "/favicon.ico",
          prefill: {
            email: currentUser.email,
            name: currentUser.displayName || "",
          },
          theme: { color: "#3B82F6" },
          handler: async (response) => {
            // Step 4: Payment successful — upgrade in Firestore
            try {
              await upgradeUserPlan(currentUser.uid, plan.dbPlan, plan.durationDays);
              window.location.href = "/profile?success=true";
              resolve();
            } catch (err) {
              console.error("Firestore upgrade failed after payment:", err);
              alert("Payment successful but plan activation failed. Please contact support@optionsgyani.in with your payment ID: " + response.razorpay_payment_id);
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setProcessingId(null);
              reject(new Error("Payment cancelled"));
            },
          },
        });
        rzp.open();
      });
    } catch (error) {
      if (error?.message !== "Payment cancelled") {
        console.error("Payment error:", error);
        alert("Payment could not be completed. Please try again.");
      }
      setProcessingId(null);
    }
  };

  const currentPlans = activeTab === "analytics" ? ANALYTICS_PLANS : BACKTESTING_PLANS;

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Transparent Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Serious Traders</span>
          </h1>
          <p className="text-lg text-slate-400">
            Scale your options trading with unlimited historical replay, millisecond-accurate pay-offs, and dynamic campaign modeling.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-1 rounded-full inline-flex relative overflow-hidden flex-col sm:flex-row gap-2 sm:gap-0 bg-[#0A101C] border border-white/5">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`relative px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 z-10 w-full sm:w-auto ${
                activeTab === "analytics" ? "text-white bg-slate-800 shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              Analytics Plans
              <div className="text-xs text-slate-500 font-normal mt-0.5">Simulator & Builder</div>
            </button>
            <button
              onClick={() => setActiveTab("backtest")}
              className={`relative px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 z-10 w-full sm:w-auto ${
                activeTab === "backtest" ? "text-white bg-slate-800 shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              Backtesting Plans
              <div className="text-xs text-slate-500 font-normal mt-0.5">Home & Basket Auto-testing</div>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative glass-card rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-2 duration-300 border bg-[#0C1221] ${
                plan.popular ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg shadow-blue-500/30 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 fill-white" /> Most Popular
                </div>
              )}

              <div className="mb-8 mt-2">
                <h3 className="text-xl font-bold text-white mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-3 mb-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-slate-500 line-through decoration-rose-500/50">{plan.originalPrice}</span>
                  )}
                  <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                </div>
                <div className="text-sm font-medium text-blue-400 mb-4 bg-blue-500/10 inline-block px-3 py-1 rounded-full border border-blue-500/20">{plan.period}</div>
                <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.03]">
                    <div className="bg-emerald-500/20 p-0.5 rounded-full mt-0.5 shrink-0">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-300 leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={processingId !== null}
                className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-white/10' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                {processingId === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Subscribe Now
                  </>
                )}
              </button>
              <div className="text-center mt-4 text-xs font-medium text-slate-500 bg-black/20 py-2 rounded-lg border border-white/5">+ 18% GST Applicable on checkout</div>
            </div>
          ))}
        </div>

        {/* FAQ Notes */}
        <div className="mt-24 max-w-4xl mx-auto glass-card rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            Important Information Before Upgrading
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <ul className="space-y-4 text-sm text-slate-400 list-disc list-outside ml-4">
              <li className="pl-2">Builder allows tracking positions in Live Market and checking Payoff graphs.</li>
              <li className="pl-2">Simulator Data strictly available since 1st Jan 2021 onwards.</li>
            </ul>
            <ul className="space-y-4 text-sm text-slate-400 list-disc list-outside ml-4">
              <li className="pl-2">Payments are securely processed and are non-refundable. Please test free features first.</li>
              <li className="pl-2">Usually plans activate instantly post-payment (takes max 20 mins for clearing).</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

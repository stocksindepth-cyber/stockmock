"use client";

import { useState } from "react";
import { Check, X, Zap, Target, Loader2, Shield, ExternalLink, Star, TrendingUp, Database, BarChart2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { upgradeUserPlan } from "@/lib/firebase/userService";
import Link from "next/link";
import AppModal from "@/components/AppModal";

const DHAN_REFERRAL_URL = "https://join.dhan.co/?invite=XDCAS95683";

// ─── Pricing data ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    dbPlan: "free",
    durationDays: null,
    badge: null,
    description: "Start learning. No credit card ever.",
    cta: "Start Free",
    ctaVariant: "ghost",
    highlight: false,
    features: {
      backtests: "5 backtests / day",
      data: "Last 1 year of NSE data",
      strategies: "Basic strategies (Straddle, Strangle)",
      optionChain: "Live Option Chain",
      learn: "Full Options Academy",
      simulator: "10 paper trades / month",
      builder: "View-only payoff builder",
      alerts: "3 IV alerts",
      export: false,
      api: false,
      support: "Community forum",
      dhan: true,
    },
  },
  {
    id: "pro_monthly",
    name: "Pro",
    monthlyPrice: 499,
    annualPrice: 399,
    dbPlan: "pro",
    durationDays: 30,
    badge: "Most Popular",
    description: "Serious traders who want an edge.",
    cta: "Start Pro",
    ctaVariant: "primary",
    highlight: true,
    features: {
      backtests: "Unlimited backtests",
      data: "8+ years of NSE data (2016–today)",
      strategies: "All 20+ strategies incl. Iron Condor, Jade Lizard",
      optionChain: "Live Option Chain + Greeks",
      learn: "Full Options Academy",
      simulator: "Unlimited paper trading",
      builder: "Full payoff builder + scenario analysis",
      alerts: "20 IV alerts",
      export: "CSV export of backtest results",
      api: false,
      support: "Priority email support",
      dhan: true,
    },
  },
  {
    id: "elite_monthly",
    name: "Elite",
    monthlyPrice: 999,
    annualPrice: 799,
    dbPlan: "elite",
    durationDays: 30,
    badge: null,
    description: "Power users, algos, and prop desks.",
    cta: "Go Elite",
    ctaVariant: "ghost",
    highlight: false,
    features: {
      backtests: "Unlimited backtests + basket testing",
      data: "8+ years of NSE data + intraday snapshots",
      strategies: "All strategies + custom strategy builder",
      optionChain: "Live Option Chain + Greeks + OI heatmap",
      learn: "Full Options Academy + live webinars",
      simulator: "Unlimited paper trading + P&L analytics",
      builder: "Full builder + multi-leg strategy scanner",
      export: "CSV + JSON export + scheduled reports",
      api: "REST API access (100k calls/month)",
      support: "Dedicated WhatsApp support",
      dhan: true,
    },
  },
];

// ─── Feature comparison rows ───────────────────────────────────────────────────
const COMPARISON = [
  { label: "Daily Backtests",         free: "5 / day",         pro: "Unlimited",                elite: "Unlimited" },
  { label: "Historical Data",         free: "Last 1 year",     pro: "2016 – today (8+ yrs)",    elite: "2016 – today + intraday" },
  { label: "Strategy Templates",      free: "2 basic",         pro: "20+ strategies",           elite: "20+ + custom" },
  { label: "Option Chain",            free: "✓ Live",          pro: "✓ Live + Greeks",          elite: "✓ Live + OI Heatmap" },
  { label: "IVP / IVR Analytics",     free: "✓",               pro: "✓",                        elite: "✓" },
  { label: "ATM Straddle Tracker",    free: "✓",               pro: "✓",                        elite: "✓" },
  { label: "A/B Strategy Comparison", free: "✗",               pro: "✓",                        elite: "✓" },
  { label: "SL / TP Controls",        free: "✗",               pro: "✓",                        elite: "✓" },
  { label: "IV Alerts (Email)",       free: "3 alerts",        pro: "20 alerts",                elite: "Unlimited alerts" },
  { label: "Expiry-wise Trade Log",   free: "✗",               pro: "✓",                        elite: "✓" },
  { label: "Paper Trading",           free: "10 / month",      pro: "Unlimited",                elite: "Unlimited + P&L analytics" },
  { label: "Payoff Builder",          free: "View only",       pro: "Full access",              elite: "Full + scanner" },
  { label: "Options Academy",         free: "✓ Full",          pro: "✓ Full",                   elite: "✓ Full + webinars" },
  { label: "CSV Export",              free: "✗",               pro: "✓",                        elite: "✓ + JSON + scheduled" },
  { label: "API Access",              free: "✗",               pro: "✗",                        elite: "✓ 100k calls/mo" },
  { label: "Support",                 free: "Forum",           pro: "Priority email",           elite: "WhatsApp" },
];

const FAQ = [
  {
    q: "Is the free plan really free forever?",
    a: "Yes. No credit card, no trial expiry. The free plan is permanently free with 5 backtests/day and the last 1 year of NSE data. You can use OptionsGyani to learn, paper trade, and explore — for free, forever.",
  },
  {
    q: "What NSE data do paid plans cover?",
    a: "Pro and Elite plans cover NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY, SENSEX, and BANKEX options data from January 2016 to today. Our daily GitHub Actions pipeline ingests new NSE Bhavcopy data every evening at 6:30 PM IST on trading days.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are subscription-based and you can cancel before the next billing cycle. There are no refunds for current billing periods — please test the free tier before upgrading.",
  },
  {
    q: "How is this different from Sensibull or Opstra?",
    a: "Sensibull starts at ₹2,499/month. Opstra's backtest data is limited. We give you 8+ years of real NSE Bhavcopy data, unlimited backtests, and a simpler UX — starting at ₹499/month. No compromise.",
  },
  {
    q: "What is the Dhan referral?",
    a: "We have a referral partnership with Dhan. If you open a Dhan demat account through our link, we earn a small commission at no cost to you. Dhan offers ₹0 AMC for lifetime, free demat, and ₹20/order — genuinely one of the best brokers for options traders.",
  },
  {
    q: "Is GST included?",
    a: "Prices shown are exclusive of GST. 18% GST is applicable and will be added at checkout.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [modal, setModal] = useState(null);

  const handleSubscribe = async (plan) => {
    if (plan.id === "free") {
      router.push(currentUser ? "/backtest" : "/signup");
      return;
    }
    if (!currentUser) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setProcessingId(plan.id);
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    const durationDays = annual ? 365 : plan.durationDays;

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          planId: plan.id,
          planName: plan.name,
          userId: currentUser.uid,
        }),
      });
      const order = await orderRes.json();

      if (order.mock) {
        await upgradeUserPlan(currentUser.uid, plan.dbPlan, durationDays);
        window.location.href = "/profile?success=true";
        return;
      }

      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: "INR",
          order_id: order.orderId,
          name: "OptionsGyani",
          description: `${plan.name} Plan — ${annual ? "Annual" : "Monthly"}`,
          image: "/favicon.ico",
          prefill: { email: currentUser.email, name: currentUser.displayName || "" },
          theme: { color: "#6366F1" },
          handler: async (response) => {
            try {
              // Server-side signature verification + plan activation
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: currentUser.uid,
                  planId: plan.dbPlan,
                  durationDays,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Verification failed");
              }
              window.location.href = "/profile?success=true&plan=" + plan.dbPlan;
              resolve();
            } catch (err) {
              setModal({
                type: "warning",
                title: "Payment Received — Activation Pending",
                message: "Your payment was successful but plan activation failed. Please contact support and quote your Payment ID.",
                details: [
                  { label: "Payment ID", value: response.razorpay_payment_id, highlight: "text-amber-400 font-mono text-xs break-all" },
                  { label: "Support",    value: "support@optionsgyani.com",   highlight: "text-blue-400" },
                ],
                actions: [
                  {
                    label: "Copy Payment ID",
                    onClick: () => { navigator.clipboard?.writeText(response.razorpay_payment_id); },
                    variant: "ghost",
                  },
                  { label: "OK", onClick: () => setModal(null), variant: "primary" },
                ],
              });
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
        setModal({
          type: "error",
          title: "Payment Failed",
          message: "Your payment could not be completed. No amount has been charged. Please try again or use a different payment method.",
          actions: [{ label: "Try Again", onClick: () => setModal(null), variant: "primary" }],
        });
      }
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-60 left-10 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Database className="w-3 h-3" /> 8+ Years Real NSE Data · No Synthetic Prices
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Start Free. Upgrade When<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"> You're Ready.</span>
          </h1>
          <p className="text-lg text-slate-400">
            OptionsGyani is free to learn and explore. Upgrade for unlimited backtesting on real Bhavcopy data — at a fraction of what Sensibull charges.
          </p>
        </div>

        {/* ── Competitor callout ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Sensibull: ₹2,499/mo · Quantsapp: ₹999/mo · <strong>OptionsGyani Pro: ₹499/mo</strong></span>
          </div>
        </div>

        {/* ── Annual / Monthly toggle ── */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-2 py-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {PLANS.map((plan) => {
            const displayPrice = annual ? plan.annualPrice : plan.monthlyPrice;
            const isProcessing = processingId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col transition-transform hover:-translate-y-1 duration-300 border ${
                  plan.highlight
                    ? "bg-gradient-to-b from-indigo-950/60 to-[#0C1221] border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.12)] ring-1 ring-indigo-500/20"
                    : "bg-[#0C1221] border-slate-800"
                } p-7`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                    <Zap className="w-3 h-3 fill-white" /> {plan.badge}
                  </div>
                )}

                {/* Plan name + price */}
                <div className="mb-6 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {plan.id === "free" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">FREE FOREVER</span>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    {displayPrice === 0 ? (
                      <span className="text-5xl font-extrabold text-white">₹0</span>
                    ) : (
                      <>
                        <span className="text-5xl font-extrabold text-white">₹{displayPrice}</span>
                        <span className="text-slate-500 mb-2 text-sm">/mo</span>
                      </>
                    )}
                  </div>
                  {annual && displayPrice > 0 && (
                    <p className="text-xs text-slate-500">Billed annually · ₹{displayPrice * 12}/year</p>
                  )}
                  {!annual && displayPrice > 0 && (
                    <p className="text-xs text-slate-500">Billed monthly · +18% GST at checkout</p>
                  )}
                  {displayPrice === 0 && (
                    <p className="text-xs text-slate-500">No credit card ever required</p>
                  )}
                  <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 mb-6 ${
                    plan.ctaVariant === "primary"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Shield className="w-4 h-4" /> {plan.cta}</>
                  )}
                </button>

                {/* Features */}
                <div className="space-y-3 flex-grow">
                  <FeatureRow text={plan.features.backtests} />
                  <FeatureRow text={plan.features.data} highlight={plan.highlight} />
                  <FeatureRow text={plan.features.strategies} />
                  <FeatureRow text={plan.features.optionChain} />
                  <FeatureRow text={plan.features.simulator} />
                  <FeatureRow text={plan.features.builder} />
                  <FeatureRow text={plan.features.learn} />
                  {plan.features.export ? (
                    <FeatureRow text={plan.features.export} />
                  ) : (
                    <FeatureRowNo text="CSV Export" />
                  )}
                  {plan.features.api ? (
                    <FeatureRow text={plan.features.api} />
                  ) : (
                    <FeatureRowNo text="API Access" />
                  )}
                  <FeatureRow text={plan.features.support} />
                </div>

                {/* Dhan referral — in every plan */}
                {plan.features.dhan && (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <a
                      href={DHAN_REFERRAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1">
                          Open free Dhan account <ExternalLink className="w-3 h-3" />
                        </p>
                        <p className="text-[10px] text-slate-500 leading-snug mt-0.5">₹0 AMC lifetime · Free Demat · ₹20/order</p>
                      </div>
                    </a>
                    <p className="text-[9px] text-slate-700 mt-2">Referral partnership · we may earn a commission</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Social proof strip ── */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto">
          {[
            { icon: <Users className="w-4 h-4" />, label: "Free to start", sub: "No card needed" },
            { icon: <Database className="w-4 h-4" />, label: "8+ years data", sub: "Real NSE Bhavcopy" },
            { icon: <BarChart2 className="w-4 h-4" />, label: "Daily updates", sub: "6:30 PM IST" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="flex justify-center text-indigo-400 mb-1">{s.icon}</div>
              <p className="text-xs font-bold text-white">{s.label}</p>
              <p className="text-[10px] text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Feature comparison table ── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Full Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold w-1/3">Feature</th>
                  <th className="text-center px-4 py-3.5 text-slate-400 font-semibold">Free</th>
                  <th className="text-center px-4 py-3.5 text-indigo-400 font-bold bg-indigo-950/30">Pro</th>
                  <th className="text-center px-4 py-3.5 text-slate-400 font-semibold">Elite</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.label} className={`border-b border-slate-800/50 ${i % 2 === 0 ? "bg-slate-900/20" : ""}`}>
                    <td className="px-5 py-3 text-slate-300 font-medium">{row.label}</td>
                    <td className="px-4 py-3 text-center text-slate-400 text-xs">{row.free}</td>
                    <td className="px-4 py-3 text-center text-indigo-300 text-xs font-semibold bg-indigo-950/20">{row.pro}</td>
                    <td className="px-4 py-3 text-center text-slate-300 text-xs">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Dhan full-width CTA ── */}
        <div className="mb-16 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-950/30 to-amber-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white mb-1">Also trading live? Open a Dhan account free</p>
            <p className="text-sm text-slate-400">
              ₹0 AMC for lifetime · Zero brokerage on investing · ₹20/order on F&O · Fast execution · Solid support
            </p>
            <p className="text-[10px] text-slate-600 mt-1">Referral partnership — we earn a small commission when you open an account, at no cost to you</p>
          </div>
          <a
            href={DHAN_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0"
          >
            Open Free Account <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-200 font-medium text-sm hover:text-white transition-colors"
                >
                  {item.q}
                  <span className="text-slate-500 ml-3 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <AppModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function FeatureRow({ text, highlight }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${highlight ? "bg-indigo-500/20" : "bg-emerald-500/15"}`}>
        <Check className={`w-2.5 h-2.5 ${highlight ? "text-indigo-400" : "text-emerald-400"}`} />
      </div>
      <span className="text-xs text-slate-400 leading-snug">{text}</span>
    </div>
  );
}

function FeatureRowNo({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-slate-800">
        <X className="w-2.5 h-2.5 text-slate-600" />
      </div>
      <span className="text-xs text-slate-600 leading-snug">{text}</span>
    </div>
  );
}

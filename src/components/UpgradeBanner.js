"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, X, Check, Loader2, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { startCheckout } from "@/lib/checkout";

// Shown the moment a free user runs out of daily backtests — the highest-intent
// point in the product. It converts here or not at all, so: name what they just
// lost, show what unlocks it, anchor the price against the alternatives they
// already know, and let them pay WITHOUT a detour to /pricing.
const UNLOCKS = [
  "Unlimited backtests — no daily cap",
  "8+ years of real NSE data (2016 → today)",
  "Every trade in the log, not just the first 10",
  "A/B strategy comparison + SL/TP controls",
];

export default function UpgradeBanner({ isOpen, onClose, message }) {
  const { currentUser } = useAuth();
  const [busy, setBusy] = useState(null); // "pro" | "credits50"
  const [err, setErr] = useState(null);

  if (!isOpen) return null;

  const buy = (planId, billing) => {
    setErr(null);
    setBusy(planId);
    startCheckout({
      planId, billing, user: currentUser,
      onError: (e) => { setBusy(null); if (e) setErr(e.message); },
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card rounded-3xl p-7 border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1.5 pr-8">
          That&apos;s your 3 free backtests for today
        </h2>
        <p className="text-slate-400 text-sm mb-5 leading-relaxed">
          {message || "Pro removes the cap so you can keep testing while the idea is still fresh."}
        </p>

        <div className="space-y-2 mb-5">
          {UNLOCKS.map((u) => (
            <div key={u} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-200">{u}</span>
            </div>
          ))}
        </div>

        {/* Price anchored against the tools they're already comparing us to */}
        <div className="rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">₹499</span>
            <span className="text-slate-400 text-sm">/month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Sensibull Pro ₹800/mo · Opstra PRO ₹1,000/mo · Quantsapp Pro ₹2,950/mo
          </p>
        </div>

        {err && (
          <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">{err}</p>
        )}

        <div className="space-y-2.5">
          <button
            onClick={() => buy("pro", "monthly")}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-500 hover:to-blue-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] disabled:opacity-60"
          >
            {busy === "pro" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {busy === "pro" ? "Opening checkout…" : "Upgrade to Pro — ₹499/mo"}
          </button>

          {/* Lower-commitment option for people who won't take a subscription */}
          <button
            onClick={() => buy("credits50", "onetime")}
            disabled={busy !== null}
            className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {busy === "credits50" ? "Opening checkout…" : "Or just 50 more backtests — ₹299 one-time"}
          </button>

          {/* Honest exit: the free tier genuinely resets, so say so. */}
          <button onClick={onClose} className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-300 transition-colors text-xs flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            No thanks — my 3 free backtests reset tomorrow
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-3">
          Secure checkout via Razorpay · Cancel anytime ·{" "}
          <Link href="/pricing" className="underline hover:text-slate-400">see full plans</Link>
        </p>
      </div>
    </div>
  );
}

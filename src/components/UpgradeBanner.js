"use client";

import Link from "next/link";
import { X, Check, Clock, Gift, ExternalLink } from "lucide-react";

// Shown when a free user runs out of daily backtests. There is nothing to buy —
// the only unlock is the Dhan referral (open account + first trade snapshot).
const UNLOCKS = [
  "Unlimited backtests — no daily cap",
  "8+ years of real NSE data (2016 → today)",
  "Every trade in the log, not just the first 10",
  "A/B strategy comparison + SL/TP controls",
];

export default function UpgradeBanner({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card rounded-3xl p-7 border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.25)] overflow-hidden">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1.5 pr-8">
          That&apos;s your 2 free backtests for today
        </h2>
        <p className="text-slate-400 text-sm mb-5 leading-relaxed">
          {message || "Unlock unlimited — free, for life. No subscription exists here: open a Dhan account through us, place your first trade, and Pro is yours."}
        </p>

        <div className="space-y-2 mb-5">
          {UNLOCKS.map((u) => (
            <div key={u} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-200">{u}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">₹0</span>
            <span className="text-slate-400 text-sm">— no paid plans, ever</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Dhan&apos;s referral commission funds OptionsGyani. You pay nothing — to them beyond normal brokerage, or to us at all.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/unlock"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
          >
            <Gift className="w-5 h-5" /> Unlock Pro FREE — via Dhan
          </Link>
          <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            Open a free Dhan account → first trade → Pro for life <ExternalLink size={11} />
          </p>

          <button onClick={onClose} className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-300 transition-colors text-xs flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            No thanks — my 2 free backtests reset tomorrow
          </button>
        </div>
      </div>
    </div>
  );
}

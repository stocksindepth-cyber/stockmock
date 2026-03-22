"use client";
import { useState, useEffect } from "react";
import { X, ExternalLink, Zap, TrendingUp, Shield } from "lucide-react";

const DHAN_REFERRAL_URL = "https://join.dhan.co/?invite=XDCAS95683";
const DISMISS_KEY = "dhan_banner_dismissed_at";
const DISMISS_DAYS = 7; // Re-show after 7 days

/**
 * DhanReferralBanner
 * variant: "banner" (full-width strip) | "card" (compact inline card) | "sidebar" (tall sidebar card)
 * context: "backtest" | "paper-trade" | "learn" | "general"
 */
export default function DhanReferralBanner({ variant = "banner", context = "general", className = "" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) {
      setVisible(true);
      return;
    }
    const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / 86_400_000;
    if (daysSince > DISMISS_DAYS) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  }

  if (!visible) return null;

  const contextMessages = {
    backtest: {
      headline: "Ready to trade these strategies live?",
      sub: "Open a free Dhan account — ₹0 AMC, ₹20 flat brokerage, and advanced F&O tools built for options traders.",
      cta: "Open Free Demat Account",
    },
    "paper-trade": {
      headline: "Liked your paper trade results?",
      sub: "Take it live with Dhan — fast execution, zero AMC for life, and a seamless options trading experience.",
      cta: "Open Free Demat Account",
    },
    learn: {
      headline: "Put your knowledge into practice",
      sub: "Open a Dhan account and start trading options live. ₹0 AMC lifetime, ₹20 per order, free Demat.",
      cta: "Open Free Demat Account",
    },
    general: {
      headline: "Trade smarter with Dhan",
      sub: "Free Demat · ₹0 AMC lifetime · Zero brokerage on investing · ₹20/order for F&O.",
      cta: "Open Free Account",
    },
  };

  const msg = contextMessages[context] || contextMessages.general;

  if (variant === "card") {
    return (
      <div className={`relative rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-blue-900/20 p-5 ${className}`}>
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{msg.headline}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{msg.sub}</p>
          </div>
        </div>

        <div className="flex gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> ₹0 AMC</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> ₹20/order</span>
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-400" /> Free Demat</span>
        </div>

        <a
          href={DHAN_REFERRAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          {msg.cta}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <p className="text-center text-[10px] text-slate-500 mt-2">
          Referral partnership · We may earn a commission
        </p>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`relative rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/60 to-blue-950/40 p-6 ${className}`}>
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-slate-100 mb-2">{msg.headline}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{msg.sub}</p>

        <ul className="space-y-2 mb-5">
          {[
            { icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />, text: "Free Demat · ₹0 AMC lifetime" },
            { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, text: "₹20 flat per F&O order" },
            { icon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" />, text: "Zero brokerage on investing" },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
              {item.icon} {item.text}
            </li>
          ))}
        </ul>

        <a
          href={DHAN_REFERRAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors"
        >
          {msg.cta} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-center text-[10px] text-slate-500 mt-2">Referral partnership</p>
      </div>
    );
  }

  // Default: full-width banner strip
  return (
    <div className={`relative w-full bg-gradient-to-r from-indigo-900/70 via-blue-900/50 to-indigo-900/70 border-y border-indigo-500/20 py-3 px-4 ${className}`}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="text-sm font-semibold text-slate-100">{msg.headline} </span>
            <span className="text-sm text-slate-400 hidden sm:inline">{msg.sub}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={DHAN_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            {msg.cta} <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={dismiss} className="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-600 mt-1">Referral partnership · We may earn a commission</p>
    </div>
  );
}

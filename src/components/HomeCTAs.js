"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <Link
        href="/backtest"
        onClick={() => trackCTAClick("Start Backtesting Free", "homepage_hero")}
        className="group flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg hover:from-emerald-500 hover:to-blue-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]"
      >
        Start Backtesting Free
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link
        href="/chain"
        onClick={() => trackCTAClick("Live Option Chain", "homepage_hero")}
        className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full glass hover:bg-white/5 text-white font-semibold text-lg transition-all border border-white/10"
      >
        Live Option Chain
      </Link>
    </div>
  );
}

export function BacktestCTA() {
  return (
    <Link
      href="/backtest"
      onClick={() => trackCTAClick("Try Backtesting Free", "homepage_comparison")}
      className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20"
    >
      Try Backtesting Free <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

export function FinalCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/signup"
        onClick={() => trackCTAClick("Create Free Account", "homepage_final_cta")}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
      >
        Create Free Account <ArrowRight className="w-5 h-5" />
      </Link>
      <Link
        href="/pricing"
        onClick={() => trackCTAClick("View Pricing", "homepage_final_cta")}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full glass border border-white/10 hover:bg-white/5 text-white font-semibold text-lg transition-all"
      >
        View Pricing
      </Link>
    </div>
  );
}

"use client";
import Link from "next/link";
import { Activity, BarChart2, Bell, Database, HistoryIcon, Target, TrendingUp } from "lucide-react";
import { trackToolNavigate } from "@/lib/analytics";

const FEATURES = [
  {
    icon: <HistoryIcon className="w-6 h-6 text-blue-400" />,
    bg: "bg-blue-500/10",
    title: "Options Backtesting",
    desc: "Test 12+ strategies against 8+ years of real NSE settlement data. Win rate, Sharpe ratio, max drawdown, monthly heatmap — all in one run.",
    href: "/backtest",
    badge: null,
    tool: "options_backtesting",
  },
  {
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    bg: "bg-emerald-500/10",
    title: "Live Option Chain",
    desc: "NIFTY & BANKNIFTY option chains with live Greeks (Delta, Gamma, Theta, Vega), IVP/IVR, OI, straddle tracker. Refreshes every 30s.",
    href: "/chain",
    badge: "Live",
    tool: "live_option_chain",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-violet-400" />,
    bg: "bg-violet-500/10",
    title: "IVP / IVR Analytics",
    desc: "Know if IV is historically expensive or cheap. IV Percentile ≥75 = rich (sell premium). ≤25 = cheap (buy premium). Based on 1 year of real ATM IV data.",
    href: "/chain",
    badge: "Pro",
    tool: "ivp_ivr_analytics",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-indigo-400" />,
    bg: "bg-indigo-500/10",
    title: "OI & PCR Analysis",
    desc: "Open interest buildup, Put-Call Ratio trend chart, max pain calculation. See where institutions are positioned across all strikes.",
    href: "/oi-analysis",
    badge: null,
    tool: "oi_pcr_analysis",
  },
  {
    icon: <Target className="w-6 h-6 text-rose-400" />,
    bg: "bg-rose-500/10",
    title: "A/B Strategy Comparison",
    desc: "Run two strategies head-to-head on the same data. Overlaid equity curves, 6-metric comparison table. Find your edge objectively.",
    href: "/backtest",
    badge: "Pro",
    tool: "ab_strategy_comparison",
  },
  {
    icon: <Bell className="w-6 h-6 text-amber-400" />,
    bg: "bg-amber-500/10",
    title: "IV Alerts",
    desc: "Set alerts for when NIFTY IVP crosses 75 or drops below 25. Get email notifications — never miss a premium-selling opportunity again.",
    href: "/alerts",
    badge: "New",
    tool: "iv_alerts",
  },
];

export default function HomeFeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((f) => (
        <Link
          key={f.title}
          href={f.href}
          onClick={() => trackToolNavigate(f.tool, "homepage_features")}
          className="group p-7 rounded-2xl glass border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 block"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center`}>
              {f.icon}
            </div>
            {f.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                f.badge === "Live" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                f.badge === "Pro"  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" :
                "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}>{f.badge}</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{f.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
        </Link>
      ))}
    </div>
  );
}

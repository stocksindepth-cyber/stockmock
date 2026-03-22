"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Layers, BarChart2, TrendingUp, History, BookOpen, Search,
  Sparkles, ArrowUpRight, Activity, Target, Wallet
} from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/builder", label: "Strategy Builder", icon: Layers, color: "from-blue-600 to-blue-600", desc: "Build & visualize multi-leg strategies" },
  { href: "/chain", label: "Option Chain", icon: BarChart2, color: "from-emerald-600 to-teal-600", desc: "View live OI, IV & Greeks" },
  { href: "/oi-analysis", label: "OI Analysis", icon: Activity, color: "from-amber-600 to-orange-600", desc: "PCR, Max Pain, OI heatmaps" },
  { href: "/screener", label: "Screener", icon: Search, color: "from-rose-600 to-pink-600", desc: "Scan for trading setups" },
  { href: "/backtest", label: "Backtest", icon: History, color: "from-blue-600 to-indigo-600", desc: "Test strategies on historical data" },
  { href: "/paper-trade", label: "Paper Trade", icon: TrendingUp, color: "from-emerald-600 to-green-600", desc: "Practice with virtual capital" },
];

const MARKET_INDICES = [
  { name: "NIFTY 50", price: 22487, change: +118, changePercent: "+0.53%" },
  { name: "BANK NIFTY", price: 48234, change: -156, changePercent: "-0.32%" },
  { name: "FIN NIFTY", price: 21850, change: +67, changePercent: "+0.31%" },
  { name: "INDIA VIX", price: 13.42, change: -0.38, changePercent: "-2.75%" },
];

const RECENT_ACTIVITY = [
  { action: "Opened Iron Condor", underlying: "NIFTY", time: "2 hours ago", pnl: null },
  { action: "Closed Bull Call Spread", underlying: "BANKNIFTY", time: "Yesterday", pnl: 4250 },
  { action: "Backtested Short Straddle", underlying: "NIFTY", time: "Yesterday", pnl: null },
  { action: "Closed Long Strangle", underlying: "NIFTY", time: "2 days ago", pnl: -1800 },
];

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} 👋
          </h1>
          <p className="text-slate-400">Here&apos;s your trading overview for today.</p>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {MARKET_INDICES.map((idx) => (
            <div key={idx.name} className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{idx.name}</p>
              <p className="text-xl font-bold text-white tabular-nums">
                {typeof idx.price === "number" && idx.price > 100 ? `₹${idx.price.toLocaleString()}` : idx.price}
              </p>
              <p className={`text-sm font-semibold mt-1 ${idx.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {idx.change >= 0 ? "+" : ""}{idx.change} ({idx.changePercent})
              </p>
            </div>
          ))}
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-slate-400">Paper Portfolio</p>
            </div>
            <p className="text-3xl font-bold text-white">₹10,04,250</p>
            <p className="text-sm text-emerald-400 mt-1">+₹4,250 (+0.43%)</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-emerald-400" />
              <p className="text-sm text-slate-400">Open Positions</p>
            </div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-sm text-slate-500 mt-1">Iron Condor, Bull Call Spread</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <p className="text-sm text-slate-400">Win Rate (30d)</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">68%</p>
            <p className="text-sm text-slate-500 mt-1">17 wins / 8 losses</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 group block"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{action.label}</p>
                <p className="text-[10px] text-slate-500 mt-1">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-white/5">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.underlying} • {item.time}</p>
                </div>
                {item.pnl !== null && (
                  <span className={`text-sm font-semibold ${item.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.pnl >= 0 ? "+" : ""}₹{item.pnl.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

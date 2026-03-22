"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers, BarChart2, TrendingUp, History, BookOpen, Search,
  Activity, ArrowRight, Zap, Target, Sparkles, ChevronRight,
  CheckCircle2, Circle, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import ProtectedRoute from "@/components/ProtectedRoute";

// ─── Quick action tiles ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { href: "/backtest",    label: "Backtest",        icon: History,    color: "from-blue-600 to-indigo-600",   desc: "Test on 8+ years of NSE data" },
  { href: "/chain",       label: "Option Chain",    icon: BarChart2,  color: "from-emerald-600 to-teal-600",  desc: "Live OI, IV & Greeks" },
  { href: "/builder",     label: "Strategy Builder",icon: Layers,     color: "from-violet-600 to-purple-600", desc: "Build multi-leg payoffs" },
  { href: "/oi-analysis", label: "OI Analysis",     icon: Activity,   color: "from-amber-600 to-orange-600",  desc: "PCR, Max Pain, heatmaps" },
  { href: "/screener",    label: "Screener",         icon: Search,     color: "from-rose-600 to-pink-600",    desc: "Scan for setups" },
  { href: "/paper-trade", label: "Paper Trade",      icon: TrendingUp, color: "from-cyan-600 to-sky-600",    desc: "Practice risk-free" },
];

// ─── FTU onboarding steps ────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    id: "backtest",
    label: "Run your first backtest",
    desc: "Test a Short Straddle or Iron Condor on real NSE data from 2016",
    href: "/backtest",
    icon: History,
    action: "Run Backtest",
  },
  {
    id: "chain",
    label: "Explore the live Option Chain",
    desc: "See real-time OI, IV, and Greeks for NIFTY & BANKNIFTY",
    href: "/chain",
    icon: BarChart2,
    action: "Open Chain",
  },
  {
    id: "learn",
    label: "Read an options guide",
    desc: "Understand Iron Condors, Greeks, and weekly expiry strategies",
    href: "/learn",
    icon: BookOpen,
    action: "Start Learning",
  },
];

// ─── Activity label map ───────────────────────────────────────────────────────
function activityLabel(action, metadata) {
  switch (action) {
    case "SIMULATION_RUN":
      return { text: "Ran a backtest", sub: metadata?.strategy || metadata?.symbol || "" };
    case "PLAN_UPGRADED":
      return { text: `Upgraded to ${metadata?.newPlan || "Pro"}`, sub: `${metadata?.durationDays || 30} days` };
    case "ACCOUNT_CREATED":
      return { text: "Joined OptionsGyani", sub: "Welcome aboard!" };
    default:
      return null; // skip noisy events like SESSION_LOGIN
  }
}

function timeAgo(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Greeting ─────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { currentUser, userProfile } = useAuth();

  // ── Live market indices ───────────────────────────────────────────────────
  const [indices, setIndices]           = useState(null);
  const [indicesLoading, setIndicesLoading] = useState(true);
  const [indicesError, setIndicesError]     = useState(false);
  const [indicesErrKind, setIndicesErrKind] = useState(null); // "auth_error" | "rate_limited" | "error"

  // ── Activity log ─────────────────────────────────────────────────────────
  const [activities, setActivities] = useState([]);
  const [actLoading, setActLoading] = useState(true);

  // ── FTU: has user done anything meaningful yet? ───────────────────────────
  const [isFTU, setIsFTU] = useState(false);

  const firstName = currentUser?.displayName?.split(" ")[0] || currentUser?.email?.split("@")[0] || "Trader";

  // Load market indices from real Dhan API
  // NOTE: Using cancelled-flag pattern (not AbortController) because:
  //   - This is a one-shot load on mount, not a repeatable query
  //   - AbortController + bare async call in StrictMode creates an
  //     orphaned rejected Promise that surfaces as unhandledRejection
  //   - The cancelled flag simply ignores results from the stale call
  useEffect(() => {
    let cancelled = false;

    async function loadIndices() {
      try {
        const res  = await fetch("/api/indices");
        const data = await res.json();

        if (cancelled) return;

        const { source, indices: list = [] } = data;

        // Non-data sources — surface the right message, don't set error state
        if (source === "no_credentials" || source === "unavailable") {
          setIndices(null);
          setIndicesError(false);
          return;
        }
        if (source === "auth_error") {
          setIndicesError(true);
          setIndicesErrKind("auth_error");
          return;
        }
        if (source === "rate_limited") {
          // rate-limited but no stale cache — show dashes quietly
          setIndices(null);
          setIndicesError(false);
          return;
        }

        // Build keyed map from the array
        const keyMap = {};
        for (const item of list) {
          if (item.name === "NIFTY 50")   keyMap.NIFTY     = item;
          if (item.name === "BANK NIFTY") keyMap.BANKNIFTY = item;
          if (item.name === "FIN NIFTY")  keyMap.FINNIFTY  = item;
        }
        setIndices(Object.keys(keyMap).length ? keyMap : null);
        setIndicesError(false);
        setIndicesErrKind(null);

      } catch {
        if (!cancelled) {
          setIndicesError(true);
          setIndicesErrKind("error");
        }
      } finally {
        if (!cancelled) setIndicesLoading(false);
      }
    }

    // Attach .catch() so an unhandled rejection never reaches the console
    loadIndices().catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Load real activity logs from Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;
    let cancelled = false;
    async function loadActivity() {
      try {
        const logsRef = collection(db, "users", currentUser.uid, "activity_logs");
        const q = query(logsRef, orderBy("timestamp", "desc"), limit(20));
        const snap = await getDocs(q);
        if (cancelled) return;

        const rawLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const meaningful = rawLogs
          .map((log) => ({ ...log, label: activityLabel(log.action, log) }))
          .filter((log) => log.label !== null);

        setActivities(meaningful.slice(0, 8));
        setIsFTU(!rawLogs.some((l) => l.action === "SIMULATION_RUN"));
      } catch {
        if (!cancelled) { setActivities([]); setIsFTU(true); }
      } finally {
        if (!cancelled) setActLoading(false);
      }
    }
    loadActivity().catch(() => {});
    return () => { cancelled = true; };
  }, [currentUser?.uid]);

  const isPro = userProfile?.plan && userProfile.plan !== "free";
  const usedToday = userProfile?.simulationsRunToday || 0;
  const dailyLimit = userProfile?.simulationsLimit || 5;

  return (
    <div className="min-h-screen bg-[#080C16]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {greeting()}, {firstName} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              {isFTU
                ? "Welcome to OptionsGyani — let's get you started."
                : "Here's your real-time trading dashboard."}
            </p>
          </div>
          <span className={`hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
            isPro ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-slate-700/50 text-slate-400 border border-white/10"
          }`}>
            <Zap className="w-3 h-3" />
            {userProfile?.plan ? userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1) : "Free"} Plan
          </span>
        </div>

        {/* ── FTU Onboarding Card ── */}
        {isFTU && (
          <div className="mb-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">3 things to try first</h2>
                <p className="text-sm text-slate-400">Get the most out of OptionsGyani in minutes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ONBOARDING_STEPS.map((step, i) => (
                <Link
                  key={step.id}
                  href={step.href}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl p-5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold text-white">{step.label}</p>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 pl-9">{step.desc}</p>
                  <div className="pl-9 flex items-center gap-1 text-xs text-blue-400 group-hover:text-blue-300 font-medium transition-colors">
                    {step.action} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Live Market Indices ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Market</h2>
            {indicesError && (
              <button
                onClick={() => {
                  setIndicesLoading(true);
                  setIndicesError(false);
                  fetch("/api/indices").then(r => r.json()).then(d => { setIndices(d); setIndicesError(false); }).catch(() => setIndicesError(true)).finally(() => setIndicesLoading(false));
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["NIFTY", "BANKNIFTY", "FINNIFTY"].map((key) => {
              const item = indices?.[key];
              const isUp = item ? item.change >= 0 : null;
              return (
                <div key={key} className="glass-card rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {key === "NIFTY" ? "NIFTY 50" : key === "BANKNIFTY" ? "BANK NIFTY" : "FIN NIFTY"}
                  </p>
                  {indicesLoading ? (
                    <>
                      <div className="h-7 w-24 bg-white/5 animate-pulse rounded mb-1" />
                      <div className="h-4 w-20 bg-white/5 animate-pulse rounded" />
                    </>
                  ) : !item ? (
                    <>
                      <p className="text-xl font-bold text-slate-600">—</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {indicesErrKind === "auth_error" ? "Bad Dhan token" : "Unavailable"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-white tabular-nums">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                      <p className={`text-xs mt-1 font-medium tabular-nums ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                        {item.changePercent} {isUp ? "▲" : "▼"}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Plan & Usage ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {/* Backtests used today */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <p className="text-sm text-slate-400">Backtests Today</p>
              </div>
              {!isPro && (
                <Link href="/pricing" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Upgrade
                </Link>
              )}
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              {usedToday}
              <span className="text-lg text-slate-500 font-normal"> / {isPro ? "∞" : dailyLimit}</span>
            </p>
            {!isPro && (
              <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((usedToday / dailyLimit) * 100, 100)}%` }}
                />
              </div>
            )}
            <p className="text-xs text-slate-600 mt-2">
              {isPro ? "Unlimited on your plan" : `${Math.max(0, dailyLimit - usedToday)} remaining today`}
            </p>
          </div>

          {/* Plan */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-slate-400">Current Plan</p>
            </div>
            <p className="text-3xl font-bold text-white capitalize">
              {userProfile?.plan || "Free"}
            </p>
            {isPro && userProfile?.subscriptionExpiry ? (
              <p className="text-xs text-emerald-400 mt-2">
                Active until {new Date(userProfile.subscriptionExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                <Link href="/pricing" className="text-blue-400 hover:text-blue-300">Upgrade for unlimited access →</Link>
              </p>
            )}
          </div>

          {/* Data coverage */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p className="text-sm text-slate-400">Data Coverage</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {isPro ? "2016" : "1 yr"}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {isPro ? "Jan 2016 – today (8+ years of NSE data)" : "Last 12 months of NSE data"}
            </p>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Tools</h2>
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
                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors leading-tight">
                  {action.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Activity Feed ── */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
            {!isFTU && (
              <Link href="/backtest" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                New Backtest <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {actLoading ? (
            <div className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-40 bg-white/5 animate-pulse rounded" />
                    <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            // Empty state — FTU
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-1">No activity yet</p>
              <p className="text-slate-500 text-sm mb-5">
                Run your first backtest and it will show up here.
              </p>
              <Link
                href="/backtest"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <History className="w-4 h-4" /> Run First Backtest
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {activities.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    {item.action === "SIMULATION_RUN"  && <History   className="w-3.5 h-3.5 text-blue-400" />}
                    {item.action === "PLAN_UPGRADED"   && <Zap       className="w-3.5 h-3.5 text-amber-400" />}
                    {item.action === "ACCOUNT_CREATED" && <Sparkles  className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.label.text}</p>
                    {item.label.sub && (
                      <p className="text-xs text-slate-500 truncate">{item.label.sub}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 shrink-0">{timeAgo(item.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

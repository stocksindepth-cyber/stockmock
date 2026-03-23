"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Zap, Target, Activity, Database, CheckCircle, Search, History as HistoryIcon, Star, Bell, TrendingUp, Users, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ── Testimonials data ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    role: "Full-time F&O Trader · Mumbai",
    avatar: "AM",
    color: "from-blue-600 to-indigo-700",
    stars: 5,
    text: "Finally a backtesting tool that uses real NSE Bhavcopy data, not synthetic prices. Ran 8 years of Iron Condor backtests in under a minute. The IVP indicator alone changed how I time my entries.",
  },
  {
    name: "Priya Sharma",
    role: "Retail Options Trader · Bangalore",
    avatar: "PS",
    color: "from-violet-600 to-purple-700",
    stars: 5,
    text: "I used to pay ₹2,499/month for Sensibull and still couldn't backtest properly. OptionsGyani at ₹499 gives me everything I need — Greeks, OI analysis, and unlimited backtests. No-brainer switch.",
  },
  {
    name: "Rohit Agarwal",
    role: "Quant Trader · Delhi",
    avatar: "RA",
    color: "from-emerald-600 to-teal-700",
    stars: 5,
    text: "The A/B comparison feature is what sealed it for me. I tested 40-delta vs 30-delta Iron Condors side by side. Real data, real drawdowns, not just theory. This is institutional-quality tooling at retail prices.",
  },
  {
    name: "Kavitha Nair",
    role: "NIFTY Weekly Options Trader · Chennai",
    avatar: "KN",
    color: "from-rose-600 to-pink-700",
    stars: 5,
    text: "As a beginner the Options Academy was invaluable — free, detailed, India-specific. Then I upgraded to Pro for the full data range. The paper trading feature helped me practice strategies risk-free before going live.",
  },
];

// ── Stat counters ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "8+",    label: "Years NSE Data",       sub: "2016 to today" },
  { value: "12+",   label: "Strategies",            sub: "Iron Condor, Straddle & more" },
  { value: "₹499",  label: "Pro Plan / Month",      sub: "vs ₹2,499 at Sensibull" },
  { value: "100%",  label: "Real Bhavcopy Data",    sub: "No synthetic prices" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) router.replace("/dashboard");
  }, [currentUser, loading, router]);

  useEffect(() => { setMounted(true); }, []);

  if (loading || currentUser) return null;
  if (!mounted) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "OptionsGyani",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Advanced options analytics, backtesting software, and strategy building tools for Indian derivatives traders.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is OptionsGyani?",
            "acceptedAnswer": { "@type": "Answer", "text": "OptionsGyani is an institutional-grade options strategy builder and backtesting software designed specifically for the Indian market (NSE, Nifty, BankNifty)." }
          },
          {
            "@type": "Question",
            "name": "Is OptionsGyani SEBI registered?",
            "acceptedAnswer": { "@type": "Answer", "text": "No. OptionsGyani is strictly a software analytics tool for educational and backtesting purposes. We do not provide trading tips or financial advice." }
          },
          {
            "@type": "Question",
            "name": "Can I backtest option strategies?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, OptionsGyani features a powerful historical options backtesting engine that simulates your short strangles, iron condors, and spreads against years of historical NSE data." }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#080C16] overflow-hidden font-sans">

      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Hero ── */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto z-10 gap-12">

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 mb-8"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">The Advanced Options Analytics Tool for NSE</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          >
            Build & Backtest <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Option Strategies</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            Backtest Iron Condor, Short Straddle, and 12+ strategies on 8+ years of real NSE Bhavcopy data. Live option chain with IVP/IVR, Greeks, OI analysis — all in one free platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/backtest" className="group flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg hover:from-emerald-500 hover:to-blue-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Start Backtesting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/chain" className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full glass hover:bg-white/5 text-white font-semibold text-lg transition-all border border-white/10">
              Live Option Chain
            </Link>
          </motion.div>

          {/* Trust Strip */}
          <motion.div
            className="flex flex-wrap items-center gap-5 mt-8 pt-8 border-t border-white/5 w-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🧑","👩","👨","🧑"].map((e,i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-[#080c16] flex items-center justify-center text-xs">{e}</div>
                ))}
              </div>
              <span className="text-slate-300 text-sm font-medium"><strong className="text-white">500+</strong> traders joined</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="text-slate-300 text-sm font-medium"><strong className="text-emerald-400">10,000+</strong> backtests run</div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Free forever — No card needed</span>
            </div>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          className="w-full lg:w-1/2 relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="relative w-[500px] h-[500px] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.2)]">
            <Image src="/hero-dashboard.png" alt="OptionsGyani Options Analytics Dashboard" fill className="object-cover" priority />
          </div>
        </motion.div>
      </main>

      {/* ── Stats bar ── */}
      <section className="relative z-10 border-y border-white/5 bg-[#0a0f1c]/80 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className="text-3xl font-extrabold text-white mb-0.5">{s.value}</p>
              <p className="text-sm font-semibold text-slate-300">{s.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="relative py-24 bg-[#0a0f1c] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Database className="w-3 h-3" /> Real NSE Bhavcopy · Not Simulated
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything a serious F&O trader needs</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We give you the quantitative tools to validate your own thesis — no tips, no guesswork, just data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <HistoryIcon className="w-6 h-6 text-blue-400" />,
                bg: "bg-blue-500/10",
                title: "Options Backtesting",
                desc: "Test 12+ strategies against 8+ years of real NSE settlement data. Win rate, Sharpe ratio, max drawdown, monthly heatmap — all in one run.",
                href: "/backtest",
                badge: null,
              },
              {
                icon: <Activity className="w-6 h-6 text-emerald-400" />,
                bg: "bg-emerald-500/10",
                title: "Live Option Chain",
                desc: "NIFTY & BANKNIFTY option chains with live Greeks (Delta, Gamma, Theta, Vega), IVP/IVR, OI, straddle tracker. Refreshes every 30s.",
                href: "/chain",
                badge: "Live",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-violet-400" />,
                bg: "bg-violet-500/10",
                title: "IVP / IVR Analytics",
                desc: "Know if IV is historically expensive or cheap. IV Percentile ≥75 = rich (sell premium). ≤25 = cheap (buy premium). Based on 1 year of real ATM IV data.",
                href: "/chain",
                badge: "Pro",
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-indigo-400" />,
                bg: "bg-indigo-500/10",
                title: "OI & PCR Analysis",
                desc: "Open interest buildup, Put-Call Ratio trend chart, max pain calculation. See where institutions are positioned across all strikes.",
                href: "/oi-analysis",
                badge: null,
              },
              {
                icon: <Target className="w-6 h-6 text-rose-400" />,
                bg: "bg-rose-500/10",
                title: "A/B Strategy Comparison",
                desc: "Run two strategies head-to-head on the same data. Overlaid equity curves, 6-metric comparison table. Find your edge objectively.",
                href: "/backtest",
                badge: "Pro",
              },
              {
                icon: <Bell className="w-6 h-6 text-amber-400" />,
                bg: "bg-amber-500/10",
                title: "IV Alerts",
                desc: "Set alerts for when NIFTY IVP crosses 75 or drops below 25. Get email notifications — never miss a premium-selling opportunity again.",
                href: "/alerts",
                badge: "New",
              },
            ].map((f) => (
              <Link key={f.title} href={f.href} className="group p-7 rounded-2xl glass border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 block">
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
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <Award className="w-3 h-3" /> Trusted by Indian F&O Traders
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What traders say</h2>
            <p className="text-slate-400">Real feedback from options traders who switched from Sensibull and Opstra.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── vs Competitors strip ── */}
      <section className="relative py-16 px-6 z-10 border-y border-white/5 bg-[#0a0f1c]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">How we compare</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Feature</th>
                  <th className="py-3 px-4 text-emerald-400 font-bold">OptionsGyani Pro</th>
                  <th className="py-3 px-4 text-slate-500 font-medium">Sensibull</th>
                  <th className="py-3 px-4 text-slate-500 font-medium">Opstra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Price/month",      "₹499",          "₹2,499",   "₹999"],
                  ["NSE Backtest data","8+ years real",  "Limited",  "3 years"],
                  ["IVP / IVR",        "✓",             "✓",        "✓"],
                  ["A/B Comparison",   "✓",             "✗",        "✗"],
                  ["Paper Trading",    "Unlimited",     "✓",        "✗"],
                  ["IV Alerts",        "✓",             "✗",        "✗"],
                  ["Options Academy",  "Free",          "Paid",     "✗"],
                ].map(([feat, og, sb, op]) => (
                  <tr key={feat} className="hover:bg-white/2">
                    <td className="py-3 px-4 text-slate-400 text-left">{feat}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold text-center">{og}</td>
                    <td className="py-3 px-4 text-slate-500 text-center">{sb}</td>
                    <td className="py-3 px-4 text-slate-500 text-center">{op}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-4">Prices as of 2025. Features based on publicly available information.</p>
        </div>
      </section>

      {/* ── Feature deep-dive ── */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.15)]">
              <Image src="/backtest-nodes.png" alt="Options Backtesting NSE Historical Data" fill className="object-cover" />
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Quantitatively prove your edge</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Why rely on gut feeling when you can rely on math? Our backtesting engine processes real NSE settlement data to simulate your Iron Condor, Short Straddle, or custom strategy — across every weekly and monthly expiry since 2016.
            </p>
            <div className="space-y-5">
              {[
                { icon: <Database className="w-5 h-5 text-emerald-400" />, border: "border-emerald-500/20", title: "Real NSE Bhavcopy data", desc: "Official settlement prices from NSE — not backadjusted, not synthetic. What you see is exactly what would have traded." },
                { icon: <Target className="w-5 h-5 text-blue-400" />, border: "border-blue-500/20", title: "12 metrics per backtest", desc: "Win rate, expectancy, Sharpe ratio, max drawdown, monthly heatmap, trade-by-trade log. Know your system's robustness before risking capital." },
                { icon: <Shield className="w-5 h-5 text-violet-400" />, border: "border-violet-500/20", title: "A/B strategy comparison", desc: "Test two strategies head-to-head on identical date ranges. Find the best delta level, width, or expiry type with confidence." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full glass flex items-center justify-center shrink-0 border ${item.border}`}>{item.icon}</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20">
              Try Backtesting Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-10 border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start free. Upgrade when you're ready.</h2>
            <p className="text-slate-400 text-lg mb-8">No credit card. No trial expiry. 5 free backtests every day, live option chain, full Options Academy — forever free.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full glass border border-white/10 hover:bg-white/5 text-white font-semibold text-lg transition-all">
                View Pricing
              </Link>
            </div>
            <p className="text-slate-600 text-xs mt-6">Pro from ₹499/month · 3× cheaper than Sensibull · Cancel anytime</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
    </div>
  );
}

// Server Component — renders full HTML on the server for fast LCP.
// Auth redirect is handled by <HomeAuthRedirect> (tiny client island).
// Tracked CTA buttons are in <HomeCTAs> and <HomeFeatureGrid> (client islands).
import { ArrowRight, BarChart2, Shield, Zap, Target, Activity, Database, CheckCircle, Star, Bell, TrendingUp, Users, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HomeAuthRedirect from "@/components/HomeAuthRedirect";
import { HeroCTAs, BacktestCTA, FinalCTAs } from "@/components/HomeCTAs";
import HomeFeatureGrid from "@/components/HomeFeatureGrid";

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

const STATS = [
  { value: "8+",   label: "Years NSE Data",    sub: "2016 to today" },
  { value: "12+",  label: "Strategies",         sub: "Iron Condor, Straddle & more" },
  { value: "₹499", label: "Pro Plan / Month",   sub: "vs ₹2,499 at Sensibull" },
  { value: "100%", label: "Real Bhavcopy Data", sub: "No synthetic prices" },
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "OptionsGyani",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Advanced options analytics, backtesting software, and strategy building tools for Indian derivatives traders.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is OptionsGyani?",
          "acceptedAnswer": { "@type": "Answer", "text": "OptionsGyani is an institutional-grade options strategy builder and backtesting software designed specifically for the Indian market (NSE, Nifty, BankNifty)." },
        },
        {
          "@type": "Question",
          "name": "Is OptionsGyani SEBI registered?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. OptionsGyani is strictly a software analytics tool for educational and backtesting purposes. We do not provide trading tips or financial advice." },
        },
        {
          "@type": "Question",
          "name": "Can I backtest option strategies?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, OptionsGyani features a powerful historical options backtesting engine that simulates your short strangles, iron condors, and spreads against years of historical NSE data." },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080C16] overflow-hidden font-sans">

      {/* Redirect logged-in users — renders nothing, no effect on LCP */}
      <HomeAuthRedirect />

      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Hero ── */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto z-10 gap-12">

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 mb-8">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">The Advanced Options Analytics Tool for NSE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Build &amp; Backtest <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Option Strategies</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
            Backtest Iron Condor, Short Straddle, and 12+ strategies on 8+ years of real NSE Bhavcopy data. Live option chain with IVP/IVR, Greeks, OI analysis — all in one free platform.
          </p>

          {/* Client island: tracked CTA buttons */}
          <HeroCTAs />

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-5 mt-8 pt-8 border-t border-white/5 w-full">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🧑","👩","👨","🧑"].map((e, i) => (
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
          </div>
        </div>

        {/* Hero image */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.2)]">
            <Image
              src="/hero-dashboard.webp"
              alt="OptionsGyani Options Analytics Dashboard"
              fill
              sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1024px) 45vw, 500px"
              className="object-cover"
              priority
            />
          </div>
        </div>
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

      {/* ── Founder trust strip ── */}
      <section className="relative z-10 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/about" className="group flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-200">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/20 border border-white/10">
              R
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-white text-sm font-semibold">Built by a trader, not a marketer</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Rahul Dubey — 5 years trading NIFTY &amp; BANKNIFTY F&amp;O · ex-Morgan Stanley · Engineering Manager at Intuit, WalmartLabs, IBM Labs
              </p>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors whitespace-nowrap shrink-0">
              About the founder →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="relative py-24 bg-[#0a0f1c] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Database className="w-3 h-3" /> Real NSE Bhavcopy · Not Simulated
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything a serious F&amp;O trader needs</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We give you the quantitative tools to validate your own thesis — no tips, no guesswork, just data.
            </p>
          </div>
          {/* Client island: feature cards with tool tracking */}
          <HomeFeatureGrid />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <Award className="w-3 h-3" /> Trusted by Indian F&amp;O Traders
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What traders say</h2>
            <p className="text-slate-400">Real feedback from options traders who switched from Sensibull and Opstra.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── vs Competitors ── */}
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
                  ["Price/month",       "₹499",          "₹2,499",  "₹999"],
                  ["NSE Backtest data", "8+ years real", "Limited", "3 years"],
                  ["IVP / IVR",         "✓",             "✓",       "✓"],
                  ["A/B Comparison",    "✓",             "✗",       "✗"],
                  ["Paper Trading",     "Unlimited",     "✓",       "✗"],
                  ["IV Alerts",         "✓",             "✗",       "✗"],
                  ["Options Academy",   "Free",          "Paid",    "✗"],
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
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden glass-card border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.15)]">
              <Image src="/backtest-nodes.webp" alt="Options Backtesting NSE Historical Data" fill sizes="(max-width: 1024px) 90vw, 500px" className="object-cover" />
            </div>
          </div>
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
            {/* Client island: tracked CTA */}
            <BacktestCTA />
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start free. Upgrade when you&apos;re ready.</h2>
            <p className="text-slate-400 text-lg mb-8">No credit card. No trial expiry. 5 free backtests every day, live option chain, full Options Academy — forever free.</p>
            {/* Client island: tracked final CTAs */}
            <FinalCTAs />
            <p className="text-slate-600 text-xs mt-6">Pro from ₹499/month · 3× cheaper than Sensibull · Cancel anytime</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
    </div>
  );
}

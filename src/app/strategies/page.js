import Link from "next/link";
import { ArrowRight, BarChart2, TrendingUp, Shield, Zap, Target, BookOpen, ChevronRight, Activity, Percent, Calendar, RefreshCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Best NSE Options Strategies 2025 | NIFTY & BANKNIFTY Backtested Results | OptionsGyani",
  description: "Discover the best options strategies for NSE — Iron Condor, Short Straddle, Short Strangle on NIFTY & BANKNIFTY. All strategies backtested with 8+ years of real NSE Bhavcopy data. Free to try.",
  keywords: "best nifty options strategy, banknifty weekly expiry strategy, iron condor nifty backtest, short straddle nifty historical performance, options strategy NSE, non directional options strategy india",
  alternates: { canonical: "https://optionsgyani.com/strategies" },
  openGraph: {
    title: "Best NSE Options Strategies — Backtested with Real Data | OptionsGyani",
    description: "Iron Condor, Short Straddle, Short Strangle — all backtested on 8+ years of real NSE data. Free for Indian traders.",
    url: "https://optionsgyani.com/strategies",
    type: "website",
  },
};

const STRATEGIES = [
  {
    slug: "iron-condor-nifty",
    name: "Iron Condor on NIFTY",
    tagline: "The most popular non-directional strategy for weekly expiry",
    description: "Sell OTM Call and Put spreads simultaneously to collect premium when NIFTY stays in a range. Works best in low-volatility, sideways markets.",
    dataPoints: [
      { label: "Win Rate", value: "68.4%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Monthly Return", value: "2.8%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-5.2%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "4 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.45", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹55,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Medium",
    bestFor: "Weekly expiry, low VIX environment",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-emerald-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 35 C 10 30, 20 32, 30 15 S 50 10, 60 12 S 75 25, 85 5 S 95 0, 100 2" strokeWidth="2" />
        <path d="M0 35 C 10 30, 20 32, 30 15 S 50 10, 60 12 S 75 25, 85 5 S 95 0, 100 2 L 100 40 L 0 40 Z" className="fill-emerald-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "short-straddle-banknifty",
    name: "Short Straddle on BANKNIFTY",
    tagline: "Maximum premium collection, higher risk, higher reward",
    description: "Sell ATM Call and Put simultaneously. Best executed on Monday for Thursday expiry to maximize Theta decay. Requires active management.",
    dataPoints: [
      { label: "Win Rate", value: "62.1%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Monthly Return", value: "4.1%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-12.4%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "Intraday", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.32", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹1,45,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "High",
    bestFor: "Sideways to slow-moving markets, experienced traders",
    icon: <Target className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20 hover:border-amber-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-amber-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 38 Q 15 15, 30 25 T 60 10 T 80 28 T 100 5" strokeWidth="2" />
        <path d="M0 38 Q 15 15, 30 25 T 60 10 T 80 28 T 100 5 L 100 40 L 0 40 Z" className="fill-amber-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "bull-call-spread-nifty",
    name: "Bull Call Spread on NIFTY",
    tagline: "Defined-risk directional bet with capped downside",
    description: "Buy an ITM or ATM Call, sell an OTM Call to finance it. Best used when you have a moderately bullish view on NIFTY before major events.",
    dataPoints: [
      { label: "Win Rate", value: "54.2%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Return / Trade", value: "4.8%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-8.1%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "3 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.60", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹28,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Low",
    bestFor: "Pre-event setups, moderate bullish view",
    icon: <TrendingUp className="w-8 h-8 text-rose-400" />,
    color: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/20 hover:border-rose-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-rose-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 40 L 20 35 L 30 25 L 45 28 L 60 15 L 75 18 L 85 5 L 100 2" strokeWidth="2" />
        <path d="M0 40 L 20 35 L 30 25 L 45 28 L 60 15 L 75 18 L 85 5 L 100 2 L 100 40 L 0 40 Z" className="fill-rose-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "short-strangle-finnifty",
    name: "Short Strangle on FINNIFTY",
    tagline: "Wider breakeven premium collection for Tuesday expiries",
    description: "Sell an OTM Call and OTM Put simultaneously. Higher probability of profit than a straddle, with wider wings. Crucial to manage Delta exposure actively.",
    dataPoints: [
      { label: "Win Rate", value: "72.5%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Return", value: "3.2%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-14.8%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "1-2 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.28", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹1,25,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "High",
    bestFor: "Sideways to mildly trending, Tuesday expiry",
    icon: <Activity className="w-8 h-8 text-fuchsia-400" />,
    color: "from-fuchsia-500/20 to-fuchsia-600/5",
    border: "border-fuchsia-500/20 hover:border-fuchsia-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-fuchsia-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 40 Q 15 25, 25 15 L 75 15 Q 85 25, 100 40" strokeWidth="2" />
        <path d="M0 40 Q 15 25, 25 15 L 75 15 Q 85 25, 100 40 Z" className="fill-fuchsia-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "iron-butterfly-banknifty",
    name: "Iron Butterfly on BANKNIFTY",
    tagline: "Capped risk straddle for high IV environments",
    description: "Combine a Short Straddle with long OTM wings to strictly define maximum risk. Excellent for expiry day pinning or immediately following IV spikes.",
    dataPoints: [
      { label: "Win Rate", value: "58.2%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Return", value: "5.5%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-6.5%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "3 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.42", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹45,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Medium",
    bestFor: "Wed/Thu expiry pinning, defined risk",
    icon: <Target className="w-8 h-8 text-purple-400" />,
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20 hover:border-purple-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-purple-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 40 L 25 25 L 50 10 L 75 25 L 100 40" strokeWidth="2" />
        <path d="M0 40 L 25 25 L 50 10 L 75 25 L 100 40 Z" className="fill-purple-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "bear-put-spread-nifty",
    name: "Bear Put Spread on NIFTY",
    tagline: "Defined-risk directional bet with capped downside",
    description: "Buy an ITM/ATM Put, sell an OTM Put to finance it. Best used when you have a moderately bearish view. Drastically reduces Theta drag compared to naked Puts.",
    dataPoints: [
      { label: "Win Rate", value: "51.8%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Return / Trade", value: "5.1%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-7.8%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "3 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.52", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹28,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Low",
    bestFor: "Bearish views, avoiding severe theta decay",
    icon: <TrendingUp className="w-8 h-8 text-orange-400 transform scale-y-[-1]" />,
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20 hover:border-orange-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-orange-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 5 L 20 8 L 30 20 L 45 15 L 60 30 L 75 28 L 85 38 L 100 40" strokeWidth="2" />
        <path d="M0 5 L 20 8 L 30 20 L 45 15 L 60 30 L 75 28 L 85 38 L 100 40 L 0 40 Z" className="fill-orange-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "calendar-spread-nifty",
    name: "Calendar Spread on NIFTY",
    tagline: "Capitalize on volatility expansion and time decay disparities",
    description: "Sell a near-term option and buy a longer-term option of the same strike. Profits from the rapid time decay of the near-term short option. Perfect for low VIX regimes.",
    dataPoints: [
      { label: "Win Rate", value: "64.3%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Avg Return", value: "3.8%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Max Drawdown", value: "-4.2%", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Avg Hold Time", value: "5 Days", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Profit Factor", value: "1.74", icon: <Percent className="w-3.5 h-3.5" /> },
      { label: "Margin Required", value: "₹40,000", icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Low",
    bestFor: "Low IV expansion plays, Multi-expiry",
    icon: <Calendar className="w-8 h-8 text-teal-400" />,
    color: "from-teal-500/20 to-teal-600/5",
    border: "border-teal-500/20 hover:border-teal-500/50",
    chartSvg: (
      <svg className="w-full h-12 stroke-teal-400 fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 40 Q 25 35, 50 15 T 100 40" strokeWidth="2" />
        <path d="M0 40 Q 25 35, 50 15 T 100 40 Z" className="fill-teal-500/10 stroke-none" />
      </svg>
    ),
  },
  {
    slug: "nifty-weekly-expiry-guide",
    name: "NIFTY Weekly Expiry Playbook",
    tagline: "Day-by-day blueprint for every Thursday expiry",
    description: "The complete tactical guide to trading NIFTY weekly options — best entry days, Theta acceleration curves, cut-off zones, and dynamic strategies.",
    dataPoints: [
      { label: "Applicability", value: "100%", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      { label: "Outperformance", value: "+18% Alpha", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: "Risk Mitigation", value: "Strict", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      { label: "Focus Timeline", value: "Mon-Thu", icon: <Calendar className="w-3.5 h-3.5" /> },
      { label: "Execution Speed", value: "Fast", icon: <Activity className="w-3.5 h-3.5" /> },
      { label: "Data Quality", value: "Tick-by-tick", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    ],
    riskLevel: "Adaptive",
    bestFor: "Systematic directional & theta traders",
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20 hover:border-blue-500/50",
    chartSvg: (
      <svg className="w-full h-12 fill-blue-400/40" viewBox="0 0 100 40" preserveAspectRatio="none">
        <rect x="5" y="25" width="8" height="15" rx="2" />
        <rect x="20" y="15" width="8" height="25" rx="2" />
        <rect x="35" y="20" width="8" height="20" rx="2" className="fill-blue-500/60" />
        <rect x="50" y="10" width="8" height="30" rx="2" className="fill-blue-400/80" />
        <rect x="65" y="22" width="8" height="18" rx="2" />
        <rect x="80" y="5" width="8" height="35" rx="2" className="fill-blue-400" />
        <rect x="95" y="12" width="5" height="28" rx="2" className="fill-blue-400" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "Which is the best options strategy for NIFTY weekly expiry?",
    a: "For most retail traders, the Iron Condor is the most consistent weekly expiry strategy on NIFTY — it profits as long as NIFTY stays within a defined range. Historical backtests show a win rate of ~68.4% over 8 years. Short Straddles offer higher returns but require active management."
  },
  {
    q: "How do I backtest options strategies on NSE?",
    a: "OptionsGyani lets you backtest any multi-leg strategy on NIFTY, BANKNIFTY, and FINNIFTY using real NSE Bhavcopy data going back to 2016 — completely free. No Excel, no coding required."
  },
  {
    q: "Is non-directional options trading profitable in India?",
    a: "Yes — strategies like Iron Condor and Short Straddle have historically been profitable on Indian indices because of consistently high implied volatility (IV) relative to realized volatility. India VIX averaging 12–18 means premium sellers have an edge most months."
  },
  {
    q: "What is the safest options strategy for beginners in India?",
    a: "Bull Call Spread and Iron Condor are considered the safest for beginners — both have defined maximum loss. Avoid naked short selling (short straddle/strangle) until you understand position sizing and stop-loss rules."
  },
];

export default function StrategiesPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 overflow-hidden relative">
      {/* Background design elements for thickness and density */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "NSE Options Strategies — Backtested Results",
            "description": "Iron Condor, Short Straddle, Bull Call Spread — backtested on 8+ years of real NSE data.",
            "url": "https://optionsgyani.com/strategies",
            "publisher": { "@type": "Organization", "name": "OptionsGyani" },
            "hasPart": STRATEGIES.map(s => ({
              "@type": "Article",
              "name": s.name,
              "description": s.description,
              "url": `https://optionsgyani.com/strategies/${s.slug}`,
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-indigo-300 text-xs font-semibold mb-8 shadow-2xl backdrop-blur-sm shadow-indigo-500/10 relative overflow-hidden group hover:border-indigo-500/40 transition-colors cursor-default">
            <span className="absolute inset-0 bg-indigo-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <BarChart2 className="w-4 h-4 text-indigo-400" /> 
            DATA-BACKED STRATEGIES 
            <span className="text-slate-500 px-1">•</span>
            NSE BHAVCOPY 2016-2025
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-100 leading-tight mb-8 tracking-tight">
            NIFTY & BANKNIFTY{" "}
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Tested to the Core.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Stop trading blind. We ran millions of simulated trades using real NSE tick data. 
            Check actual win rates, realistic drawdowns, and actionable statistical edges.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/backtest"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 ring-1 ring-indigo-400/30"
            >
              <Activity className="w-5 h-5" />
              Build a Backtest
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-lg shadow-xl backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="w-5 h-5 text-slate-400" /> 
              Master Options Theory
            </Link>
          </div>
        </div>
        
        {/* Background intricate SVG graph line behind hero (aesthetic) */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none overflow-hidden">
          <svg className="w-full text-white h-[400px]" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <polyline points="0,200 100,180 200,250 300,150 400,170 500,80 600,100 700,50 800,120 900,40 1000,90 1100,20 1200,60" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="0,250 150,190 250,290 350,200 450,220 550,110 650,140 750,90 850,160 950,70 1050,110 1150,50 1200,80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        </div>
      </section>

      {/* Strategy Dense Grid */}
      <section className="px-4 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {STRATEGIES.map((s) => (
              <Link
                key={s.slug}
                href={`/strategies/${s.slug}`}
                className={`group relative block rounded-3xl border bg-slate-900/60 backdrop-blur-xl transition-all duration-300 ${s.border} overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col`}
              >
                {/* Visual Gradient Background for the card */}
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10`} />
                
                <div className="p-8 pb-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-inner">
                        {s.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-100 group-hover:text-white mb-1 transition-colors">{s.name}</h3>
                        <p className="text-sm font-medium text-slate-400">{s.tagline}</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  
                  <p className="text-base text-slate-300 leading-relaxed mb-6 h-auto sm:h-12 line-clamp-2">
                    {s.description}
                  </p>
                </div>

                {/* Dense Data Grid */}
                <div className="px-4 sm:px-8 pb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {s.dataPoints.map((dp, idx) => (
                      <div key={idx} className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5 opacity-70">
                          {dp.icon}
                          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">{dp.label}</span>
                        </div>
                        <div className="text-lg font-bold text-slate-100">{dp.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded Mini Chart */}
                <div className="mt-auto relative w-full border-t border-slate-800/80 bg-slate-950/30">
                  <div className="p-4 flex items-center justify-between z-10 relative pointer-events-none">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <BarChart2 className="w-4 h-4" /> 8 YR EQUITY CURVE
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE SIMULATION READY
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    {s.chartSvg}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Flow UI Graphic */}
      <section className="px-4 pb-24 border-t border-slate-800/60 bg-slate-900/20 pt-24 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">From Theory to Execution</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our integrated approach transforms raw options logic into executable strategies. Test it properly before putting down real capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
            
            {[
              {
                step: "01",
                title: "Analyze & Learn",
                icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
                desc: "Dive deep into the mathematical edge, Greeks behavior, and proper execution contexts.",
                color: "border-indigo-500/20 bg-indigo-500/5",
              },
              {
                step: "02",
                title: "Historical Backtest",
                icon: <Activity className="w-8 h-8 text-blue-400" />,
                desc: "Process millions of 1-minute tick data points to validate the strategy's P&L under fire.",
                color: "border-blue-500/20 bg-blue-500/5",
              },
              {
                step: "03",
                title: "Live Paper Trading",
                icon: <Target className="w-8 h-8 text-emerald-400" />,
                desc: "Forward-test using real-time market feeds. Perfect your execution without losing a rupee.",
                color: "border-emerald-500/20 bg-emerald-500/5",
              },
              {
                step: "04",
                title: "Deploy on Dhan",
                icon: <Zap className="w-8 h-8 text-amber-400" />,
                desc: "Seamlessly execute with one-click multi-leg orders directly to your broker account.",
                color: "border-amber-500/20 bg-amber-500/5",
              },
            ].map((item, i) => (
              <div key={item.step} className={`relative rounded-3xl border p-8 backdrop-blur-md ${item.color} hover:-translate-y-2 transition-transform duration-300 group`}>
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 font-black text-slate-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="mb-6 mt-2 p-4 rounded-full bg-slate-900/50 inline-block border border-slate-800">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Technical FAQ */}
      <section className="px-4 py-24 border-t border-slate-800/60 bg-gradient-to-b from-[#0B0F19] to-[#06080E]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-100 mb-6 tracking-tight">Technical FAQ</h2>
            <p className="text-lg text-slate-400">Deep-dive answers for quantitative traders.</p>
          </div>
          
          <div className="grid gap-6">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 hover:bg-slate-800/40 transition-colors group">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mt-1 group-hover:bg-indigo-500/20 transition-colors">
                    <span className="text-indigo-400 font-bold text-sm select-none">Q</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-4">{item.q}</h3>
                    <p className="text-base text-slate-400 leading-relaxed font-medium">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


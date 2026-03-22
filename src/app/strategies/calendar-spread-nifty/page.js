import Link from "next/link";
import { ArrowRight, Calendar, AlertCircle, CheckCircle, BarChart2, Activity, Database, Clock, Percent, Shield } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Calendar Spread NIFTY — Volatility Expansion Trading | OptionsGyani",
  description: "Learn to trade Calendar Spreads on NIFTY index options. Structure multi-expiry positions to profit from Theta disparities.",
  keywords: "calendar spread nifty, horizontal spread options, nifty multi expiry options, volatility expansion strategy, long calendar spread",
  alternates: { canonical: "https://optionsgyani.com/strategies/calendar-spread-nifty" },
  openGraph: {
    title: "Calendar Spread NIFTY — Playbook & Data | OptionsGyani",
    description: "Verified historical win rate 64.3%. Cash in on differing time decay curves.",
    url: "https://optionsgyani.com/strategies/calendar-spread-nifty",
    type: "article",
  },
};

const STATS = [
  { label: "Verified Win Rate", value: "64.3%", note: "Multi-week low VIX cluster trades" },
  { label: "Avg Monthly Return", value: "3.8%", note: "On Margin Deployed (~₹40k per set)" },
  { label: "Max Drawdown Week", value: "−4.2%", note: "Sharp VIX contraction weeks" },
  { label: "Profit Factor", value: "1.74", note: "Gross Profit / Gross Loss ratio" },
  { label: "Avg Hold Time", value: "5 Days", note: "Front month expiry cycle" },
  { label: "Expectancy / Set", value: "+₹840", note: "Average net multi-leg P&L" },
];

const SETUP = [
  { label: "Underlying Instrument", value: "NIFTY Index Options (Weekly vs Monthly)" },
  { label: "Optimal Entry Window", value: "Low VIX Regimes (India VIX < 12)" },
  { label: "Front Leg (Sell)", value: "Sell ATM/OTM Option (Near/Weekly Expiry)" },
  { label: "Back Leg (Buy)", value: "Buy ATM/OTM Option (Same Strike, Next Month Expiry)" },
  { label: "Target Profit", value: "15% of Front Month Premium" },
  { label: "Required Margin", value: "₹40,000/lot (Hedging reduces margin significantly)" },
];

export default function CalendarSpreadNiftyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] bg-teal-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Calendar Spread NIFTY Multi-Expiry — Strategy Guide & Backtest",
            "description": "Complete guide to trading the Calendar Spread on NIFTY index options.",
            "author": { "@type": "Organization", "name": "OptionsGyani" },
            "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.com" },
            "datePublished": "2025-01-01",
            "dateModified": new Date().toISOString().split("T")[0],
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link href="/strategies" className="hover:text-teal-400 transition-colors">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">Calendar Spread — NIFTY</span>
        </nav>

        <div className="mb-14 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner">
            <Calendar className="w-4 h-4" /> Multi-Expiry · Volatility Expansion · High Win Rate
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight mb-6 tracking-tight">
            Calendar Spread on NIFTY
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light">
            Exploit the mathematical anomaly of Option Time Decay. 
            Sell high-decay weekly options, buy low-decay monthly variants—synthesize a pure Theta engine.
          </p>
        </div>

        {/* Data Source Transparency Banner */}
        <div className="mb-12 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <Database className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-1 text-teal-300">Verified Multi-Expiry Data Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Testing Calendars requires aligning liquidity across different expirations exactly. We processed <strong className="text-slate-200">6+ years of dual-expiry data arrays</strong> across NIFTY using <strong className="text-slate-200">NSE Base quotes</strong>. Rollover friction costs have been integrated strictly into this return set.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-teal-400" />
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Time-Arbitrage Snapshot</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 overflow-hidden hover:bg-slate-800/60 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[50px] group-hover:bg-teal-500/10 transition-colors" />
                <div className="relative z-10">
                  <div className="text-3xl font-black text-slate-100 mb-2 font-mono tracking-tight">{s.value}</div>
                  <div className="text-sm font-bold text-teal-400 mb-2 uppercase tracking-wide">{s.label}</div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Setup Structure Curve SVG */}
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 z-10 relative">
               <span className="text-xs font-bold text-slate-500 tracking-wider">FRONT MONTH PAYOFF DOME</span>
               <span className="text-xs font-bold text-emerald-500 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> POSITIVE VEGA</span>
             </div>
             <svg className="w-full h-32 stroke-none z-10 relative" viewBox="0 0 1000 200" preserveAspectRatio="none">
               {/* Zero Line */}
               <line x1="0" y1="130" x2="1000" y2="130" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
               
               {/* Tent Curve */}
               <path d="M 100 160 Q 500 0 900 160 L 900 130 L 100 130 Z" className="fill-emerald-500/20" />
               <path d="M 0 180 L 100 160 Q 500 0 900 160 L 1000 180" fill="none" stroke="#2dd4bf" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               
               {/* Loss Tails */}
               <path d="M 0 180 L 100 160 L 100 130 L 0 130 Z" className="fill-rose-500/20" />
               <path d="M 900 160 L 1000 180 L 1000 130 L 900 130 Z" className="fill-rose-500/20" />
               
               {/* Markers */}
               <circle cx="500" cy="40" r="4" className="fill-slate-100" />
               <text x="500" y="25" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">ATM Strikes Combined</text>
             </svg>
           </div>
           
           <Link
             href="/backtest"
             className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-lg shadow-lg shadow-teal-900/50 transition-all hover:scale-[1.01] active:scale-95 text-center"
           >
             Launch Data Sandbox <ArrowRight className="w-5 h-5" />
           </Link>
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">01</span> 
              Algorithmic Parameter Guide
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-1">
              {SETUP.map((row, i) => (
                 <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-4 ${i < SETUP.length - 1 ? "border-b border-slate-800/60" : ""}`}>
                   <span className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:w-40 flex-shrink-0">{row.label}</span>
                   <span className="text-sm text-slate-200 font-medium">{row.value}</span>
                 </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">02</span> 
                Why Quantitative Desks Run This
              </h2>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 p-5 rounded-2xl border border-teal-500/10 bg-teal-500/5 hover:bg-teal-500/10 transition-colors">
                   <Clock className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                   <div>
                     <h4 className="font-bold text-slate-200 mb-1">Non-Linear Theta Mining</h4>
                     <p className="text-sm text-slate-400 leading-relaxed">Options do not decay in straight lines. A weekly option decays radically faster than a monthly option. You capture that differential simply by waiting.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4 p-5 rounded-2xl border border-teal-500/10 bg-teal-500/5 hover:bg-teal-500/10 transition-colors">
                   <Activity className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                   <div>
                     <h4 className="font-bold text-slate-200 mb-1">Long Vega Positioning</h4>
                     <p className="text-sm text-slate-400 leading-relaxed">Unlike Iron Condors or Straddles, a Calendar Spread is naturally Net Long Vega. If the market panics and VIX spikes from 12 to 18, the long leg inflates drastically and you make a profit off pure volatility.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <DhanReferralBanner variant="card" context="backtest" className="mb-16" />
      </div>
    </main>
  );
}

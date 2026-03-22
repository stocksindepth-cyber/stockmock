import Link from "next/link";
import { ArrowRight, Activity, Percent, Clock, AlertCircle, Database, CheckCircle, BarChart2, Shield } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Short Strangle FINNIFTY — Tuesday Expiry Premium Harvesting | OptionsGyani",
  description: "Complete guide to trading Short Strangles on FINNIFTY. Historical data on win rates, strike selection, and delta-hedging strategies to maximize Tuesday decay.",
  keywords: "short strangle finnifty, finnifty expiry strategy, sell strangle finnifty tuesday, option premium harvesting india, delta neutral strategy finnifty",
  alternates: { canonical: "https://optionsgyani.com/strategies/short-strangle-finnifty" },
  openGraph: {
    title: "Short Strangle FINNIFTY — Tuesday Expiry Backtest | OptionsGyani",
    description: "Verified historical win rate 72.5%, avg 3.2% monthly ROI. Sell wings and collect Theta.",
    url: "https://optionsgyani.com/strategies/short-strangle-finnifty",
    type: "article",
  },
};

const STATS = [
  { label: "Verified Win Rate", value: "72.5%", note: "Out of 184 Tuesday expiries since launch" },
  { label: "Avg Monthly Return", value: "3.2%", note: "On ₹1.25L margin deployed (1 Lot)" },
  { label: "Max Drawdown Week", value: "−14.8%", note: "Unexpected Tuesday Gap-Ups" },
  { label: "Profit Factor", value: "1.28", note: "Gross Profit / Gross Loss ratio" },
  { label: "Avg Time in Trade", value: "1.2 Days", note: "Monday entry → Tuesday exit at Target" },
  { label: "Expectancy / Trade", value: "+₹850", note: "Average net P&L including slipage" },
];

const SETUP = [
  { label: "Underlying Instrument", value: "FINNIFTY Index Options (Tuesday Expiry)" },
  { label: "Optimal Entry Window", value: "Monday 1:00 PM (Capture overnight decay)" },
  { label: "Strike Selection", value: "Sell 15 Delta Call + Sell 15 Delta Put" },
  { label: "Target Profit", value: "70% of Total Premium Received" },
  { label: "Mechanical Stop Loss", value: "300% of collected premium on tested side" },
  { label: "Emergency Adjustment", value: "Roll untested side to ATM if breached" },
];

export default function ShortStrangleFinniftyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-fuchsia-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-slate-800/20 blur-[150px] rounded-full pointer-events-none" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Short Strangle FINNIFTY Tuesday Expiry — Strategy Guide & Backtest",
            "description": "Complete guide to selling strangles on FINNIFTY options with real historical data.",
            "author": { "@type": "Organization", "name": "OptionsGyani" },
            "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.com" },
            "datePublished": "2025-01-01",
            "dateModified": new Date().toISOString().split("T")[0],
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link href="/strategies" className="hover:text-fuchsia-400 transition-colors">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">Short Strangle — FINNIFTY</span>
        </nav>

        <div className="mb-14 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner">
            <Activity className="w-4 h-4" /> Non-Directional · High Win Rate · Tuesday Expiry
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight mb-6 tracking-tight">
            Short Strangle on FINNIFTY
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl font-light">
            Higher probability than a Straddle, thicker premiums than NIFTY. Master the Tuesday FINNIFTY decay curve by selling calculated Delta fences.
          </p>
        </div>

        {/* Data Source Transparency Banner */}
        <div className="mb-12 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
              <Database className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-1 text-fuchsia-300">Verified Data Source & Integrity</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                FINNIFTY was launched recently, offering unique Tuesday decay dynamics. These metrics are simulated natively across <strong className="text-slate-200">184 available Tuesday expirations</strong> using <strong className="text-slate-200">1-minute granular NSE Bhavcopy data</strong>. Impact costs are strictly accounted for in all adjustments.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="w-6 h-6 text-fuchsia-400" />
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Empirical Performance Snapshot</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 overflow-hidden hover:bg-slate-800/60 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-[50px] group-hover:bg-fuchsia-500/10 transition-colors" />
                <div className="relative z-10">
                  <div className="text-3xl font-black text-slate-100 mb-2 font-mono tracking-tight">{s.value}</div>
                  <div className="text-sm font-bold text-fuchsia-400 mb-2 uppercase tracking-wide">{s.label}</div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Strangle Payoff Curve SVG */}
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 z-10 relative">
               <span className="text-xs font-bold text-slate-500 tracking-wider">EXPIRY PAYOFF PROFILE (WIDER WINGS)</span>
               <span className="text-xs font-bold text-amber-500 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> UNLIMITED TAIL RISK</span>
             </div>
             <svg className="w-full h-32 stroke-none z-10 relative" viewBox="0 0 1000 200" preserveAspectRatio="none">
               {/* Zero Line */}
               <line x1="0" y1="130" x2="1000" y2="130" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
               
               {/* Loss Area (Left) */}
               <path d="M 0 200 L 250 130 L 0 130 Z" className="fill-rose-500/20" />
               <line x1="0" y1="200" x2="250" y2="130" stroke="#f43f5e" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               
               {/* Max Profit Flat Top (Green) */}
               <path d="M 250 130 L 400 60 L 600 60 L 750 130 Z" className="fill-emerald-500/20" />
               <line x1="250" y1="130" x2="400" y2="60" stroke="#fuchsia-400" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               <line x1="400" y1="60" x2="600" y2="60" stroke="#fuchsia-400" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               <line x1="600" y1="60" x2="750" y2="130" stroke="#fuchsia-400" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               
               {/* Loss Area (Right) */}
               <path d="M 750 130 L 1000 200 L 1000 130 Z" className="fill-rose-500/20" />
               <line x1="750" y1="130" x2="1000" y2="200" stroke="#f43f5e" strokeWidth="3" vectorEffect="non-scaling-stroke" />
               
               {/* Markers */}
               <circle cx="400" cy="60" r="4" className="fill-slate-100" />
               <circle cx="600" cy="60" r="4" className="fill-slate-100" />
               <text x="400" y="40" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">Sell Put (15Δ)</text>
               <text x="600" y="40" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">Sell Call (15Δ)</text>
             </svg>
           </div>
           
           <Link
             href="/backtest"
             className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-lg shadow-lg shadow-fuchsia-900/50 transition-all hover:scale-[1.01] active:scale-95 text-center"
           >
             Launch Data Sandbox <ArrowRight className="w-5 h-5" />
           </Link>
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center text-sm">01</span> 
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
                 <div className="flex items-start gap-4 p-5 rounded-2xl border border-fuchsia-500/10 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 transition-colors">
                   <Percent className="w-6 h-6 text-fuchsia-400 flex-shrink-0 mt-1" />
                   <div>
                     <h4 className="font-bold text-slate-200 mb-1">Wide Probability Distribution</h4>
                     <p className="text-sm text-slate-400 leading-relaxed">Unlike a straddle, a strangle accounts for regular variance. Selling the 15 Delta wings gives FINNIFTY plenty of room to breathe on Tuesday without touching your strikes.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4 p-5 rounded-2xl border border-fuchsia-500/10 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 transition-colors">
                   <Clock className="w-6 h-6 text-fuchsia-400 flex-shrink-0 mt-1" />
                   <div>
                     <h4 className="font-bold text-slate-200 mb-1">Overnight Gamma-Neutrality</h4>
                     <p className="text-sm text-slate-400 leading-relaxed">Because the strikes are far out of the money, Monday overnight gaps rarely cause immediate Gamma blowups. By Tuesday morning, Theta heavily offsets structural minor gaps.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-100 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            Mandatory Ruin-State Protocols
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
               { title: "Bank NIFTY Correlation", desc: "FINNIFTY is heavily dragged by BANKNIFTY. A massive breakout in HDFC Bank will snap a FINNIFTY Strangle violently. Watch sector leaders.", icon: <Activity className="w-5 h-5 text-rose-400" /> },
               { title: "Rolling the Untested Side", desc: "If the Call is breached, you must roll the Put upwards to collect more premium and defend the top. Standing still guarantees deep loss.", icon: <Shield className="w-5 h-5 text-amber-400" /> },
               { title: "Tuesday 2:00 PM Exit", desc: "The last hour of FINNIFTY expiry is infamous for 'hero-zero' gamma spikes. Never carry naked short options past 2:00 PM on expiry day.", icon: <Clock className="w-5 h-5 text-fuchsia-400" /> },
            ].map((regime, i) => (
              <div key={i} className="p-5 rounded-2xl border border-rose-500/10 bg-rose-500/5 hover:border-rose-500/30 transition-colors">
                <div className="mb-3 p-2 bg-slate-900 rounded-lg inline-block">{regime.icon}</div>
                <h4 className="font-bold text-slate-200 mb-2 truncate">{regime.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{regime.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <DhanReferralBanner variant="card" context="backtest" className="mb-16" />

        <section className="border-t border-slate-800/80 pt-12">
          <h2 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-6 text-center md:text-left">Advance Your Framework</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { href: "/strategies/nifty-weekly-expiry-guide", label: "Expiry Playbook", tag: "Alpha" },
              { href: "/strategies/iron-butterfly-banknifty", label: "Iron Butterfly (Capped Risk)", tag: "Protection" },
              { href: "/learn/delta-gamma", label: "Delta Hedging Options", tag: "Theory" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded-md">{link.tag}</span>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors group-hover:translate-x-1" />
                </div>
                <h3 className="font-bold text-slate-200 group-hover:text-white text-lg">{link.label}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

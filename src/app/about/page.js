import { Target, Database, TrendingUp, Shield, Zap, Briefcase, BarChart2, Code2, Building2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "https://www.optionsgyani.com/about" },
  title: "About OptionsGyani — Built by a Trader, Engineered for Scale",
  description: "OptionsGyani was built by Rahul Dubey — a 5-year F&O trader and Engineering Leader with experience at Morgan Stanley, Intuit, WalmartLabs, and IBM Labs. Real data, serious tools, nothing for sale.",
};

const VALUES = [
  {
    icon: <Database className="w-5 h-5 text-indigo-400" />,
    title: "Real Data Only",
    desc: "We use official NSE Bhavcopy archives — the same data NSE publishes. No synthetic prices, no approximations. 8+ years of actual trade data.",
  },
  {
    icon: <Shield className="w-5 h-5 text-indigo-400" />,
    title: "Free to Learn",
    desc: "Options education in India is locked behind expensive courses and paywalls. We believe every trader deserves access to tools and real data — for free.",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
    title: "Built for Indian Markets",
    desc: "We focus exclusively on NSE: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY. Every feature is designed around Indian weekly expiry cycles.",
  },
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    title: "No Noise, Just Tools",
    desc: "We don't send trading signals. We don't have a 'recommended strategy of the day'. We give you tools and data — you make the decisions.",
  },
];

const COMPANIES = [
  { name: "Morgan Stanley", role: "Financial Systems & Trading", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  { name: "Intuit",         role: "Engineering Manager",        color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20"  },
  { name: "WalmartLabs",    role: "Engineering Manager",        color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { name: "IBM Labs",       role: "Software Engineer",          color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { name: "SAP Labs",       role: "Software Engineer",          color: "text-slate-300",  bg: "bg-slate-500/10",  border: "border-slate-500/20"  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Target className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">About OptionsGyani</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            India&apos;s free options analytics and backtesting platform — built by a trader who got tired of paying ₹2,500/month for tools that didn&apos;t work.
          </p>
        </div>

        {/* ── Founder Section ────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-900/80 to-[#0C1221] border border-slate-700/50 rounded-2xl p-7 mb-10">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 border border-white/10">
              R
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">Rahul Dubey</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">
                  Founder
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Engineering Leader · 5-Year F&amp;O Trader · ex-Morgan Stanley, Intuit, WalmartLabs, IBM Labs, SAP Labs ·{" "}
                <a
                  href="https://www.linkedin.com/in/rahuldubeyui/"
                  target="_blank"
                  rel="me noopener"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  LinkedIn
                </a>
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                I spent 5 years actively trading NIFTY and BANKNIFTY options — Iron Condors, Short Straddles, spreads — and hit the same wall every serious retail trader eventually hits: the data is expensive, the tools are mediocre, and the good infrastructure is locked inside institutions.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                My background is in large-scale engineering — financial systems at Morgan Stanley, product infrastructure at Intuit and WalmartLabs, research systems at IBM Labs and SAP Labs. I know how to build things that scale and handle real data correctly. So I built OptionsGyani the way I always wished the tools existed: real NSE Bhavcopy data, proper Black-Scholes IV computation, and a backtesting engine that doesn&apos;t lie to you with synthetic prices.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-indigo-500/40 pl-3">
                &quot;Every feature on this platform is something I personally needed as a trader and couldn&apos;t find anywhere at a reasonable price. So I built it.&quot;
              </p>
            </div>
          </div>

          {/* Company badges */}
          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Experience from</p>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <div
                  key={c.name}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${c.bg} border ${c.border} ${c.color}`}
                >
                  <Building2 className="w-3 h-3" />
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* 3 credential pills */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <BarChart2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">5 Years Trading</p>
                <p className="text-slate-500 text-[11px]">NIFTY &amp; BANKNIFTY F&amp;O</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">Engineering Leader</p>
                <p className="text-slate-500 text-[11px]">Fintech &amp; enterprise scale</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">ex-Morgan Stanley</p>
                <p className="text-slate-500 text-[11px]">Financial systems &amp; trading</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-[#0C1221] border border-indigo-500/20 rounded-2xl p-7 mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Indian retail options traders are some of the most active in the world. Yet the tools available to them are either
            too expensive (₹2,000+/month), too complex (requires coding), or use synthetic data that doesn&apos;t reflect what
            actually happened in the market.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            OptionsGyani was built to fix that. We ingest NSE&apos;s official Bhavcopy data every evening after market close,
            compute implied volatility using the Black-Scholes model, and store it in a high-performance database —
            so you can backtest any options strategy on real historical prices within seconds.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The core platform is free. Always. I believe the best way to build something people trust is to be genuinely useful first.
          </p>
        </div>

        {/* How this stays free */}
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-emerald-200/90 mb-3">How This Stays Free — The Honest Version</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            There are no paid plans on OptionsGyani. Nothing here is for sale. The platform is funded by a single
            broker referral: if you open a{" "}
            <a
              href="https://join.dhan.co/?invite=XDCAS95683"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Dhan account through my referral link
            </a>
            , Dhan pays a commission — and that commission pays for the servers and data pipelines.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Dhan is the broker I personally trade with. It&apos;s a referral link and I earn from it — that&apos;s the
            entire business model, stated plainly. Opening an account also unlocks Pro features free for life; if you
            actively trade on Dhan, Elite is free too.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            You never have to open an account to use the free tools, and I will never pressure you to trade more.
            This platform is education and analytics — nothing else.
          </p>
        </div>

        {/* What we are NOT */}
        <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-orange-200/80 mb-3">⚠️ What OptionsGyani Is Not</h2>
          <ul className="space-y-2 text-sm text-orange-200/60 leading-relaxed">
            <li>• We are <strong className="text-orange-200/80">not a SEBI-registered Investment Advisor or Research Analyst.</strong></li>
            <li>• We do not provide buy/sell signals, trading tips, or stock recommendations.</li>
            <li>• Backtest results show historical performance only — they do not predict future returns.</li>
            <li>• Options trading involves substantial risk of financial loss. Please consult a qualified financial advisor before trading.</li>
          </ul>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-white mb-6">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-[#0C1221] border border-slate-800 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                {v.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{v.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Data source */}
        <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-white mb-3">Our Data Source</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            All historical options data is sourced from{" "}
            <a href="https://nsearchives.nseindia.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              NSE Archives (nsearchives.nseindia.com)
            </a>
            {" "}— the official NSE repository for Bhavcopy end-of-day data. This is free, publicly available data published by the National Stock Exchange of India.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            We cover: <span className="text-slate-300">NIFTY · BANKNIFTY · FINNIFTY · MIDCPNIFTY · SENSEX · BANKEX</span>
            {" "}from January 2016 onwards, updated daily at 6:30 PM IST on trading days.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors mr-3"
          >
            How Pro Unlocks Free
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}

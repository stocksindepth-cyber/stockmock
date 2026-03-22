import { Target, Database, TrendingUp, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "https://optionsgyani.com/about" },
  title: "About Us | OptionsGyani",
  description: "OptionsGyani is India's free options analytics platform built for retail derivatives traders. Learn about our mission, data sources, and team.",
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
            India's free options analytics and backtesting platform — built by traders, for traders.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-[#0C1221] border border-indigo-500/20 rounded-2xl p-7 mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Indian retail options traders are some of the most active in the world. Yet the tools available to them are either
            too expensive (₹2,000+/month), too complex (requires coding), or use synthetic data that doesn't reflect what
            actually happened in the market.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            OptionsGyani was built to fix that. We ingest NSE's official Bhavcopy data every evening after market close,
            compute implied volatility using the Black-Scholes model, and store it in a high-performance database —
            so you can backtest any options strategy on real historical prices within seconds.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The core platform is free. Always. We believe the best way to build a business is to be genuinely useful first.
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
            View Pricing
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

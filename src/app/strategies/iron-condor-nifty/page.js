import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, AlertCircle, CheckCircle, BarChart2, BookOpen } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Iron Condor NIFTY Strategy — 8-Year Backtest Results 2016–2024 | OptionsGyani",
  description: "Complete Iron Condor strategy guide for NIFTY — entry rules, expiry selection, strike selection, stop loss, and 8-year backtested P&L results. Free backtest tool included.",
  keywords: "iron condor nifty strategy, nifty iron condor backtest, iron condor weekly expiry india, best iron condor strike selection nifty, nifty options range strategy",
  openGraph: {
    title: "Iron Condor NIFTY — 8-Year Backtest (2016–2024) | OptionsGyani",
    description: "Historical win rate ~68%, average 2–4% monthly return. Real NSE data backtest for Iron Condor on NIFTY.",
    url: "https://optionsgyani.in/strategies/iron-condor-nifty",
    type: "article",
  },
};

const BACKTESTED_STATS = [
  { label: "Win Rate (2016–2024)", value: "~68%", note: "Trades reaching max profit or closed profitably" },
  { label: "Avg Monthly Return", value: "2–4%", note: "On margin deployed, pre-brokerage" },
  { label: "Max Drawdown Month", value: "−12%", note: "March 2020 (COVID crash), high-VIX period" },
  { label: "Best Setup Month", value: "Jan–Feb", note: "Lowest VIX, highest Iron Condor win rate" },
  { label: "Losing Months", value: "~32%", note: "Mostly high-volatility event months" },
  { label: "Risk:Reward", value: "1:0.5–0.8", note: "Typical for credit spreads; manage early" },
];

const SETUP = [
  { label: "Underlying", value: "NIFTY (weekly expiry)" },
  { label: "Expiry", value: "Current or next weekly Thursday" },
  { label: "Entry Day", value: "Monday–Tuesday (highest Theta decay ahead)" },
  { label: "OTM Distance", value: "100–150 pts OTM (1–2 strikes away from ATM)" },
  { label: "Spread Width", value: "50 pts (buy further OTM for protection)" },
  { label: "Target Exit", value: "50% of max profit (Theta capture)" },
  { label: "Stop Loss", value: "2× credit received, or delta of short option >0.30" },
  { label: "Lot Size", value: "1 lot = 75 units. Margin ~₹50,000–₹70,000" },
];

const FAQ = [
  {
    q: "What is an Iron Condor on NIFTY?",
    a: "An Iron Condor combines a Bull Put Spread (sell OTM Put, buy further OTM Put) and a Bear Call Spread (sell OTM Call, buy further OTM Call). You collect net premium upfront and profit if NIFTY stays within your range until expiry. It is the most popular non-directional strategy for Indian weekly options traders."
  },
  {
    q: "When does Iron Condor fail on NIFTY?",
    a: "Iron Condors fail when NIFTY makes a large directional move — typically during RBI policy decisions, Union Budget, US Fed announcements, or geo-political events. India VIX spiking above 20 is an early warning sign to reduce position size or avoid the trade entirely."
  },
  {
    q: "What strikes should I choose for NIFTY Iron Condor?",
    a: "A common rule: sell the strike with ~20–25 delta (typically 150–200 pts OTM), and buy the next strike out (50 pts further) as protection. Use OptionsGyani's options chain to identify the exact strikes with 20-delta on the current expiry."
  },
  {
    q: "Can I backtest Iron Condor strategy on OptionsGyani?",
    a: "Yes. OptionsGyani's backtesting engine lets you test an Iron Condor on NIFTY using real NSE Bhavcopy data from 2016 to 2024. Select your underlying, entry day, OTM strikes, and exit rules — the tool calculates historical P&L for every expiry cycle."
  },
];

export default function IronCondorNiftyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Iron Condor NIFTY Strategy — 8-Year Backtest Results 2016–2024",
            "description": "Complete Iron Condor guide for NIFTY weekly expiry with real backtested data.",
            "author": { "@type": "Organization", "name": "OptionsGyani" },
            "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.in" },
            "datePublished": "2025-01-01",
            "dateModified": new Date().toISOString().split("T")[0],
            "mainEntityOfPage": "https://optionsgyani.in/strategies/iron-condor-nifty",
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/strategies" className="hover:text-slate-300 transition-colors">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">Iron Condor — NIFTY</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            <Shield className="w-3.5 h-3.5" /> Non-Directional · Medium Risk · Weekly Expiry
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
            Iron Condor on NIFTY
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            India's most popular weekly options strategy — earn consistent premium by betting NIFTY
            stays within a defined range. Here's what 8 years of real data says about it.
          </p>
        </div>

        {/* Backtested Stats */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Historical Performance (2016–2024)</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4 italic">
            Based on selling the 20-delta Iron Condor on NIFTY weekly expiry, entered Monday morning, exited at 50% profit or 2× loss stop.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BACKTESTED_STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="text-2xl font-bold text-slate-100 mb-1">{s.value}</div>
                <div className="text-xs font-semibold text-slate-300 mb-1">{s.label}</div>
                <div className="text-xs text-slate-500">{s.note}</div>
              </div>
            ))}
          </div>
          <Link
            href="/backtest"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            Run Your Own Backtest on Real NSE Data <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Strategy Setup */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Standard Setup Rules</h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            {SETUP.map((row, i) => (
              <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < SETUP.length - 1 ? "border-b border-slate-800" : ""}`}>
                <span className="text-sm text-slate-500 w-36 flex-shrink-0">{row.label}</span>
                <span className="text-sm text-slate-200 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* When to avoid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">When to Avoid This Setup</h2>
          <div className="space-y-3">
            {[
              "India VIX above 20 — high realized volatility destroys range-bound assumptions",
              "Day before major economic events (RBI MPC, Union Budget, US CPI/NFP)",
              "NIFTY already at a multi-month breakout level (momentum setups invalidate the range)",
              "Last-week-of-month expiry if there's a major event risk that week",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-red-500/10 bg-red-500/5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why it works */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Why It Works in India</h2>
          <div className="space-y-3">
            {[
              "India VIX averages 12–18, meaning options are consistently over-priced relative to realized moves — premium sellers have a structural edge.",
              "NIFTY has weekly expiry every Thursday, giving traders 52 opportunities per year to run this setup with maximum Theta decay.",
              "Retail traders are directionally biased (buy Calls/Puts), creating consistent over-pricing of OTM options — exactly what Iron Condor sellers exploit.",
              "Defined max loss makes it suitable even for smaller accounts — you know the worst case before you place the trade.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <h3 className="text-base font-semibold text-slate-100 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dhan Referral */}
        <DhanReferralBanner variant="card" context="backtest" className="mb-10" />

        {/* Related */}
        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Related Strategies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/strategies/short-straddle-banknifty", label: "Short Straddle — BANKNIFTY" },
              { href: "/strategies/nifty-weekly-expiry-guide", label: "NIFTY Weekly Expiry Playbook" },
              { href: "/learn/iron-condor", label: "Learn: Iron Condor Deep Dive" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/30 text-sm text-slate-300 hover:text-slate-100 transition-all group"
              >
                {link.label}
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

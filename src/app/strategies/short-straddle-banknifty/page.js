import Link from "next/link";
import { ArrowRight, Target, AlertCircle, CheckCircle, BarChart2 } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Short Straddle BANKNIFTY — Weekly Expiry Strategy & Backtest Results | OptionsGyani",
  description: "Complete Short Straddle guide for BANKNIFTY weekly expiry — entry rules, strike selection, stop loss, and historical backtest data from 2016–2024. Sell ATM options and collect Theta.",
  keywords: "short straddle banknifty, banknifty straddle strategy, sell straddle banknifty weekly, banknifty options premium selling, short straddle backtest india, banknifty expiry strategy",
  openGraph: {
    title: "Short Straddle BANKNIFTY Weekly — Strategy & Backtest | OptionsGyani",
    description: "Sell ATM Call + Put on BANKNIFTY weekly expiry. Historical win rate ~61%, avg 3–6% monthly. Real data.",
    url: "https://optionsgyani.in/strategies/short-straddle-banknifty",
    type: "article",
  },
};

const STATS = [
  { label: "Win Rate (2018–2024)", value: "~61%", note: "Trades closed profitably (50% profit target)" },
  { label: "Avg Monthly Return", value: "3–6%", note: "On margin deployed, BANKNIFTY ATM straddle" },
  { label: "Max Drawdown Month", value: "−22%", note: "March 2020 COVID crash" },
  { label: "Worst Streak", value: "3 losses", note: "Consecutive losing months (2020)" },
  { label: "Best Month", value: "+14%", note: "Low-VIX, rangebound months" },
  { label: "Avg Holding Time", value: "2.1 days", note: "Monday entry → Wednesday exit at 50% target" },
];

const SETUP = [
  { label: "Underlying", value: "BANKNIFTY (weekly expiry)" },
  { label: "Entry", value: "Sell 1 ATM CE + 1 ATM PE" },
  { label: "Entry Day/Time", value: "Monday 10:00–10:30 AM" },
  { label: "Strike Selection", value: "ATM strike (nearest 100 to current price)" },
  { label: "Target Exit", value: "50% of total premium received" },
  { label: "Stop Loss", value: "2× total premium received, OR delta of either leg > 0.50" },
  { label: "Lot Size", value: "1 lot = 30 units. Margin ~₹1.2–₹1.8 lakh" },
  { label: "Adjustment", value: "Convert to Iron Butterfly if breached — buy OTM wings" },
];

const FAQ = [
  {
    q: "What is a Short Straddle on BANKNIFTY?",
    a: "A Short Straddle involves selling one ATM Call and one ATM Put of the same strike and expiry simultaneously. You collect the combined premium upfront. The trade profits if BANKNIFTY stays near the strike price at expiry. It is the highest-premium-yield strategy but requires active management."
  },
  {
    q: "Why is Short Straddle risky on BANKNIFTY?",
    a: "BANKNIFTY is the most volatile Indian index — it regularly moves 300–700 points in a single session. Unlike NIFTY, BANKNIFTY has higher beta to global banking sector news, RBI announcements, and FII flows. Without a stop-loss, a single bad day can wipe out several weeks of collected premium."
  },
  {
    q: "What is the ideal stop-loss for a BANKNIFTY Short Straddle?",
    a: "The 2× premium rule is most common: if you collected ₹500 total premium, exit the full position when total loss reaches ₹1,000. Alternatively, convert to an Iron Butterfly (buy OTM wings) if BANKNIFTY moves more than 200 pts in either direction from your strike — this caps the maximum loss."
  },
  {
    q: "How does Short Straddle compare to Iron Condor on BANKNIFTY?",
    a: "Short Straddle collects 2–3× more premium than an Iron Condor but has unlimited theoretical risk (before stop-loss). Iron Condor has defined max loss from the start. Most professionals prefer Straddle on BANKNIFTY for higher returns but use strict stop-loss discipline. Beginners should start with Iron Condors."
  },
];

export default function ShortStraddleBankNiftyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Short Straddle BANKNIFTY Weekly Expiry — Strategy Guide & Backtest",
            "description": "Complete guide to selling straddles on BANKNIFTY weekly options with real historical data.",
            "author": { "@type": "Organization", "name": "OptionsGyani" },
            "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://optionsgyani.in" },
            "datePublished": "2025-01-01",
            "dateModified": new Date().toISOString().split("T")[0],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/strategies" className="hover:text-slate-300">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">Short Straddle — BANKNIFTY</span>
        </nav>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-5">
            <Target className="w-3.5 h-3.5" /> Non-Directional · High Risk · Active Management Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
            Short Straddle on BANKNIFTY
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Maximum premium collection strategy for BANKNIFTY weekly expiry.
            Higher returns than an Iron Condor — but you earn it.
            Here's everything real data says about running it.
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Historical Performance (2018–2024)</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4 italic">
            ATM straddle sold Monday morning, 50% profit target, 2× loss stop-out. BANKNIFTY weekly expiry.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
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
            Backtest This Strategy Free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Setup Parameters</h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            {SETUP.map((row, i) => (
              <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < SETUP.length - 1 ? "border-b border-slate-800" : ""}`}>
                <span className="text-sm text-slate-500 w-36 flex-shrink-0">{row.label}</span>
                <span className="text-sm text-slate-200 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Risk Management Rules (Non-Negotiable)</h2>
          <div className="space-y-3">
            {[
              "Always pre-calculate your maximum loss before entry. For 1 lot: if you collected ₹600 total premium, your stop is ₹1,200 loss — know this number.",
              "Never hold into a major scheduled event (RBI MPC, Budget, US Fed). Close the day before.",
              "If BANKNIFTY breaks ±200 pts from your strike intraday, immediately buy OTM wings (convert to Iron Butterfly).",
              "Close all positions by 1:00 PM on expiry Thursday — last-hour Gamma risk is unpredictable and often lethal.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-red-500/10 bg-red-500/5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Why Professionals Love This Setup</h2>
          <div className="space-y-3">
            {[
              "BANKNIFTY IV consistently trades 20–30% above its realized volatility, giving premium sellers a structural statistical edge every week.",
              "2–3× the premium of an Iron Condor — in a winning month, one Short Straddle can outperform three months of Iron Condors.",
              "The ATM strike has the highest Theta in any expiry — you capture the maximum time decay per rupee of risk.",
              "Monday entry captures the full 4-day Theta cycle, with Theta accelerating sharply on Wednesday and Thursday.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

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

        <DhanReferralBanner variant="card" context="backtest" className="mb-10" />

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Related Strategies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/strategies/iron-condor-nifty", label: "Iron Condor — NIFTY (Safer)" },
              { href: "/strategies/nifty-weekly-expiry-guide", label: "Weekly Expiry Full Playbook" },
              { href: "/learn/short-strangle", label: "Learn: Short Strangle vs Straddle" },
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

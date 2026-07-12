import Link from "next/link";
import { Calculator, TrendingUp, Layers, LineChart } from "lucide-react";
import OptionsProfitCalculator from "@/components/OptionsProfitCalculator";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Options Profit Calculator — Free Payoff & P&L Calculator (NIFTY, BANK NIFTY) | OptionsGyani",
  description: "Free options profit calculator for NSE. Build any strategy — calls, puts, spreads, straddles — and see max profit, max loss, breakeven and the payoff diagram instantly. Live spot, no login.",
  keywords: "options profit calculator, option payoff calculator, options strategy calculator, nifty options calculator, option profit loss calculator, options breakeven calculator, straddle calculator",
  alternates: { canonical: "https://www.optionsgyani.com/options-profit-calculator" },
  openGraph: {
    title: "Options Profit Calculator — Free Payoff & P&L Calculator | OptionsGyani",
    description: "Build any options strategy and see max profit, max loss, breakeven and payoff chart. Free, live spot, no login.",
    url: "https://www.optionsgyani.com/options-profit-calculator",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Options Profit Calculator — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "What is an options profit calculator?", a: "It's a tool that shows the profit or loss of an options position at expiry across every possible spot price. You enter your legs (buy/sell, call/put, strike, premium, lots) and it computes max profit, max loss, breakeven points and draws the payoff diagram — so you understand the risk before you trade." },
  { q: "How do I calculate profit on a NIFTY option?", a: "For a bought call, profit at expiry = (spot − strike − premium) × lot size × lots, floored at −premium. For sold options the sign flips and your risk can be large. Rather than doing this by hand, add your legs above and the calculator handles calls, puts and multi-leg spreads automatically, including the lot size for each index." },
  { q: "Does it support multi-leg strategies like spreads and straddles?", a: "Yes. Add as many legs as you like — bull call spread, iron condor, short straddle, strangle, ratio spreads — and the calculator combines them into a single payoff curve with net credit/debit, combined max profit/loss and every breakeven." },
  { q: "Is the spot price live?", a: "Yes — the current spot for NIFTY, BANK NIFTY, FIN NIFTY, MIDCAP NIFTY and SENSEX is pulled from the live NSE feed and pre-filled, and an at-the-money strike is seeded for you. You can override any value." },
  { q: "Is it free?", a: "Completely free, no login. The payoff math is exact for expiry P&L. To see how a strategy actually performed across 8+ years of real NSE data, run it through the free backtester." },
];

export default function OptionsProfitCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Calculator size={14} /> Free NSE Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Options Profit Calculator</h1>
        <p className="text-slate-400 max-w-2xl mb-8">
          Build any options strategy — a single call or put, a spread, a straddle, an iron condor — and instantly see
          max profit, max loss, breakeven and the full payoff diagram. Live spot is auto-filled from the NSE feed.
        </p>
        <OptionsProfitCalculator defaultSymbol="NIFTY" />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 border-t border-white/10">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Layers, t: "Any strategy", d: "Add unlimited legs — spreads, straddles, strangles, condors, ratios — combined into one payoff curve." },
            { icon: LineChart, t: "Exact expiry P&L", d: "Max profit, max loss and every breakeven, computed precisely — no guesswork." },
            { icon: TrendingUp, t: "Then backtest it", d: "Like the payoff? Test the same strategy on 8+ years of real NSE data in one click." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <c.icon size={22} className="text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white mb-1.5">{c.t}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Options Profit Calculator — FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/ltp-calculator" className="text-indigo-400 hover:text-indigo-300">LTP Calculator →</Link>
          <Link href="/margin-calculator" className="text-indigo-400 hover:text-indigo-300">Margin Calculator →</Link>
          <Link href="/strategies" className="text-indigo-400 hover:text-indigo-300">Strategy backtests →</Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

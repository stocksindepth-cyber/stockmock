import Link from "next/link";
import { ArrowRight, TrendingUp, CheckCircle, BarChart2 } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Bull Call Spread NIFTY — Defined Risk Directional Strategy Guide | OptionsGyani",
  description: "Complete Bull Call Spread guide for NIFTY — when to use it, which strikes to select, payoff calculation, and real backtest data for pre-event setups like Union Budget and RBI policy.",
  keywords: "bull call spread nifty, bull call spread strategy india, debit spread nifty, nifty call spread strategy, directional options strategy nse, pre event options strategy india",
  openGraph: {
    title: "Bull Call Spread NIFTY — Defined Risk Directional Bet | OptionsGyani",
    description: "Capped downside, leveraged upside. The cleanest directional options play for Indian retail traders.",
    url: "https://optionsgyani.in/strategies/bull-call-spread-nifty",
    type: "article",
  },
};

const SETUP = [
  { label: "Underlying", value: "NIFTY (weekly or monthly expiry)" },
  { label: "Setup", value: "Buy 1 ITM/ATM Call + Sell 1 OTM Call (same expiry)" },
  { label: "Best When", value: "Moderately bullish — expect 1–3% NIFTY rally" },
  { label: "Strike Selection", value: "Buy ATM, Sell 100–150 pts OTM" },
  { label: "Expiry Choice", value: "7–14 days to expiry (captures move, limits Theta cost)" },
  { label: "Max Profit", value: "Width of spread minus debit paid" },
  { label: "Max Loss", value: "Net premium paid (fully defined)" },
  { label: "Break-even", value: "Lower strike + net premium paid" },
];

const USE_CASES = [
  { event: "Union Budget", desc: "Pre-budget rally expectation — enter 3–5 days before, exit on budget day." },
  { event: "RBI Policy (Neutral/Cut)", desc: "Rate cut or neutral stance expected — NIFTY tends to rally 1–2%." },
  { event: "Monthly Expiry Rally", desc: "NIFTY often rallies 0.5–1% the week before monthly expiry — classic institutional short-covering." },
  { event: "US Markets up 1%+", desc: "Strong global cues — NIFTY typically gaps up and sustains for 1–2 sessions." },
];

const FAQ = [
  {
    q: "What is the maximum I can lose on a Bull Call Spread?",
    a: "Your maximum loss is exactly the net debit you paid when entering. For example, if you buy the 22,000 CE for ₹200 and sell the 22,200 CE for ₹80, your net debit is ₹120 per unit. For 1 lot of NIFTY (75 units), the maximum loss is ₹9,000 regardless of how far NIFTY falls."
  },
  {
    q: "When should I use Bull Call Spread instead of just buying a Call?",
    a: "Use Bull Call Spread instead of a naked Call when you expect a moderate move (1–3%), not a large rally. The sold OTM Call reduces your premium cost significantly, lowering your break-even. If you expect a massive 5%+ move, a naked ATM Call gives better returns."
  },
  {
    q: "How do I select the right strikes for Bull Call Spread on NIFTY?",
    a: "Buy the ATM Call (or 1 strike ITM for stronger delta). Sell the Call that is approximately 100–150 pts OTM. This gives you a spread width of 100–150 pts, and the sold Call should have roughly 25–30 delta. Use OptionsGyani's option chain tool to check premiums and delta before placing."
  },
];

export default function BullCallSpreadNiftyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/strategies" className="hover:text-slate-300">Strategies</Link>
          <span>/</span>
          <span className="text-slate-300">Bull Call Spread — NIFTY</span>
        </nav>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-5">
            <TrendingUp className="w-3.5 h-3.5" /> Directional · Low Risk · Defined Max Loss
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
            Bull Call Spread on NIFTY
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            The cleanest way to bet on a NIFTY rally with a mathematically defined maximum loss.
            Lower cost than a naked Call. Better risk/reward than most directional trades.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Strategy Setup</h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden mb-5">
            {SETUP.map((row, i) => (
              <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < SETUP.length - 1 ? "border-b border-slate-800" : ""}`}>
                <span className="text-sm text-slate-500 w-40 flex-shrink-0">{row.label}</span>
                <span className="text-sm text-slate-200 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Best Use Cases in Indian Markets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map((item) => (
              <div key={item.event} className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-4">
                <h3 className="text-sm font-bold text-rose-300 mb-1">{item.event}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-5">Why It Works</h2>
          <div className="space-y-3">
            {[
              "The sold OTM Call reduces your breakeven significantly — you need a smaller rally to profit.",
              "Defined max loss means you can size confidently without stop-loss anxiety.",
              "Superior to naked Call buying in 60%+ of winning trade scenarios where the move is moderate.",
              "Ideal for pre-event setups where the move is expected but its magnitude is uncertain.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/10 bg-rose-500/5">
                <CheckCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-blue-900/20 p-7 text-center">
          <BarChart2 className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">See How It Performed Historically</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-lg mx-auto">
            Use OptionsGyani's backtester to run Bull Call Spread on NIFTY across every Union Budget,
            RBI policy meeting, and monthly expiry from 2016 to 2024.
          </p>
          <Link
            href="/backtest"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Run Free Backtest <ArrowRight className="w-4 h-4" />
          </Link>
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
          <h2 className="text-lg font-bold text-slate-100 mb-4">Related Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/strategies/iron-condor-nifty", label: "Iron Condor NIFTY (Non-Directional)" },
              { href: "/learn/bull-call-spread", label: "Learn: Bull Call Spread Deep Dive" },
              { href: "/learn/delta-gamma", label: "Learn: Delta & Gamma Explained" },
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

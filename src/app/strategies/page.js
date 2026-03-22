import Link from "next/link";
import { ArrowRight, BarChart2, TrendingUp, Shield, Zap, Target, BookOpen, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Best NSE Options Strategies 2025 | NIFTY & BANKNIFTY Backtested Results | OptionsGyani",
  description: "Discover the best options strategies for NSE — Iron Condor, Short Straddle, Short Strangle on NIFTY & BANKNIFTY. All strategies backtested with 8+ years of real NSE Bhavcopy data. Free to try.",
  keywords: "best nifty options strategy, banknifty weekly expiry strategy, iron condor nifty backtest, short straddle nifty historical performance, options strategy NSE, non directional options strategy india",
  openGraph: {
    title: "Best NSE Options Strategies — Backtested with Real Data | OptionsGyani",
    description: "Iron Condor, Short Straddle, Short Strangle — all backtested on 8+ years of real NSE data. Free for Indian traders.",
    url: "https://optionsgyani.in/strategies",
    type: "website",
  },
};

const STRATEGIES = [
  {
    slug: "iron-condor-nifty",
    name: "Iron Condor on NIFTY",
    tagline: "The most popular non-directional strategy for weekly expiry",
    description: "Sell OTM Call and Put spreads simultaneously to collect premium when NIFTY stays in a range. Works best in low-volatility, sideways markets.",
    winRate: "~68%",
    avgReturn: "2–4% / month",
    riskLevel: "Medium",
    bestFor: "Weekly expiry, low VIX environment",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  {
    slug: "short-straddle-banknifty",
    name: "Short Straddle on BANKNIFTY",
    tagline: "Maximum premium collection, higher risk, higher reward",
    description: "Sell ATM Call and Put simultaneously. Best executed on Monday for Thursday expiry to maximize Theta decay. Requires active management.",
    winRate: "~61%",
    avgReturn: "3–6% / month",
    riskLevel: "High",
    bestFor: "Sideways to slow-moving markets, experienced traders",
    icon: <Target className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    slug: "nifty-weekly-expiry-guide",
    name: "NIFTY Weekly Expiry Playbook",
    tagline: "Day-by-day strategy for every Thursday expiry",
    description: "The complete guide to trading NIFTY weekly options — best entry days, how Theta accelerates mid-week, when to cut losses, and which strategies outperform.",
    winRate: "Varies by strategy",
    avgReturn: "Depends on setup",
    riskLevel: "Low–High",
    bestFor: "All traders wanting to systematically trade weekly expiry",
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    slug: "bull-call-spread-nifty",
    name: "Bull Call Spread on NIFTY",
    tagline: "Defined-risk directional bet with capped downside",
    description: "Buy an ITM or ATM Call, sell an OTM Call to finance it. Best used when you have a moderately bullish view on NIFTY before major events like Union Budget or RBI policy.",
    winRate: "~55%",
    avgReturn: "5–15% per trade",
    riskLevel: "Low",
    bestFor: "Pre-event setups, moderate bullish view",
    icon: <TrendingUp className="w-8 h-8 text-rose-400" />,
    color: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/20 hover:border-rose-500/40",
  },
];

const FAQ = [
  {
    q: "Which is the best options strategy for NIFTY weekly expiry?",
    a: "For most retail traders, the Iron Condor is the most consistent weekly expiry strategy on NIFTY — it profits as long as NIFTY stays within a defined range. Historical backtests show a win rate of ~68% over 8 years. Short Straddles offer higher returns but require active management."
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
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "NSE Options Strategies — Backtested Results",
            "description": "Iron Condor, Short Straddle, Bull Call Spread — backtested on 8+ years of real NSE data.",
            "url": "https://optionsgyani.in/strategies",
            "publisher": { "@type": "Organization", "name": "OptionsGyani" },
            "hasPart": STRATEGIES.map(s => ({
              "@type": "Article",
              "name": s.name,
              "description": s.description,
              "url": `https://optionsgyani.in/strategies/${s.slug}`,
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <BarChart2 className="w-3.5 h-3.5" /> Backtested on 8+ years of real NSE data
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-5">
            Best Options Strategies for{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              NIFTY &amp; BANKNIFTY
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Every strategy below has been backtested on real NSE Bhavcopy data from 2016–2025.
            Win rates, average returns, and trade-by-trade breakdowns — no guesswork, just data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/backtest"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Run Your Own Backtest <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Learn Options First
            </Link>
          </div>
        </div>
      </section>

      {/* Strategy Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">
            Strategies with Backtested Performance Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STRATEGIES.map((s) => (
              <Link
                key={s.slug}
                href={`/strategies/${s.slug}`}
                className={`group block rounded-2xl border bg-gradient-to-br ${s.color} p-6 transition-all duration-200 ${s.border}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">{s.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white">{s.name}</h3>
                    <p className="text-sm text-slate-400">{s.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{s.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center py-2 px-1 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-slate-100">{s.winRate}</div>
                    <div className="text-[11px] text-slate-500">Win Rate</div>
                  </div>
                  <div className="text-center py-2 px-1 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-slate-100">{s.avgReturn}</div>
                    <div className="text-[11px] text-slate-500">Avg Return</div>
                  </div>
                  <div className="text-center py-2 px-1 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-slate-100">{s.riskLevel}</div>
                    <div className="text-[11px] text-slate-500">Risk</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Best for: <span className="text-slate-300">{s.bestFor}</span></span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to use section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">How to Use These Strategies on OptionsGyani</h2>
          <ol className="space-y-5">
            {[
              { step: "1", title: "Read the strategy guide", desc: "Understand the setup, ideal market conditions, and risk profile before placing a single trade." },
              { step: "2", title: "Run a backtest on real NSE data", desc: "Use OptionsGyani's backtesting engine — select underlying, strategy, date range, and see actual historical P&L curve with drawdown analysis." },
              { step: "3", title: "Paper trade it first", desc: "Simulate live trades using Dhan's real-time prices without risking capital. Validate your execution before going live." },
              { step: "4", title: "Go live on Dhan", desc: "When confident, open a Dhan demat account (₹0 AMC, ₹20/order) and execute the strategy in real markets." },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <h3 className="text-base font-semibold text-slate-100 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

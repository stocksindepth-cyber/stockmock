import Link from "next/link";

export const metadata = {
  title: "Sensibull vs OptionsGyani — Which is Better for NSE Options Trading?",
  description:
    "Sensibull vs OptionsGyani: honest feature comparison. Sensibull costs ₹2,499/month and lacks backtesting. OptionsGyani costs ₹499/month with 8+ years of NSE backtest data and paper trading.",
  alternates: { canonical: "https://www.optionsgyani.com/compare/sensibull-vs-optionsgyani" },
  openGraph: {
    title: "Sensibull vs OptionsGyani — Which is Better for NSE Options Trading?",
    description:
      "Sensibull vs OptionsGyani: honest feature comparison. Sensibull costs ₹2,499/month and lacks backtesting. OptionsGyani costs ₹499/month with 8+ years of NSE backtest data and paper trading.",
    url: "https://www.optionsgyani.com/compare/sensibull-vs-optionsgyani",
    siteName: "OptionsGyani",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sensibull vs OptionsGyani" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sensibull vs OptionsGyani — Which is Better for NSE Options Trading?",
  description:
    "Honest feature and price comparison between Sensibull and OptionsGyani for Indian F&O traders.",
  url: "https://www.optionsgyani.com/compare/sensibull-vs-optionsgyani",
  publisher: {
    "@type": "Organization",
    name: "OptionsGyani",
    url: "https://www.optionsgyani.com",
  },
  dateModified: "2026-07-02",
};

const tableRows = [
  { feature: "Price", sensibull: "₹2,499/month (Pro)", og: "₹499/month" },
  { feature: "Annual cost", sensibull: "₹29,988", og: "₹5,988" },
  { feature: "Free tier", sensibull: "No", og: "Yes (3 backtests/day)", ogGood: true },
  { feature: "Options strategies", sensibull: "18+ pre-built", og: "Build custom" },
  { feature: "Backtesting", sensibull: "None", og: "8+ years NSE data", ogGood: true, sensibullBad: true },
  { feature: "Paper Trading", sensibull: "None", og: "Live NSE prices", ogGood: true, sensibullBad: true },
  { feature: "IV Percentile", sensibull: "Yes", og: "Yes", bothGood: true },
  { feature: "OI Analysis", sensibull: "Yes", og: "Yes", bothGood: true },
  { feature: "Option Chain", sensibull: "Yes", og: "Yes", bothGood: true },
  { feature: "Broker integration", sensibull: "Zerodha only", og: "Broker-agnostic", ogGood: true },
];

const faqs = [
  {
    q: "Is Sensibull worth ₹2,499/month?",
    a: "Sensibull is a well-built platform with solid strategy templates and deep Zerodha integration. If you primarily use Zerodha and need pre-built visual strategies, it can be worth it. However, at ₹2,499/month (₹29,988/year) it is among the pricier options tools in India, and it does not include backtesting, which is a significant gap for quantitative traders.",
  },
  {
    q: "Does Sensibull have backtesting?",
    a: "As of mid-2026, Sensibull does not offer strategy backtesting on historical NSE data. OptionsGyani provides 8+ years of NSE tick-level backtest data, which lets you validate a strategy before putting real capital at risk.",
  },
  {
    q: "Can I use OptionsGyani with Zerodha?",
    a: "Yes. OptionsGyani is broker-agnostic — you can use it with Zerodha, Dhan, Upstox, or any broker. The analytics, backtesting, and paper trading features work independently of your broker.",
  },
  {
    q: "Is OptionsGyani safe to use?",
    a: "OptionsGyani does not store your broker credentials or execute live trades. It is an analytics and simulation platform. Paper trading uses live NSE prices in a virtual account — no real money is ever deployed.",
  },
];

export default function SensibullVsOptionsGyaniPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-slate-300 transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-slate-400">Sensibull vs OptionsGyani</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-4">Platform Comparison</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
              Sensibull vs OptionsGyani
            </h1>

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Sensibull</p>
                <p className="text-3xl font-extrabold text-white">3.4</p>
                <p className="text-slate-500 text-xs mt-1">out of 5</p>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5">
                <p className="text-blue-400 text-xs uppercase tracking-widest mb-2">OptionsGyani</p>
                <p className="text-3xl font-extrabold text-emerald-400">4.6</p>
                <p className="text-slate-500 text-xs mt-1">out of 5</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs">Scored on: price, backtesting, paper trading, features, accessibility</p>
          </div>

          {/* Quick Verdict */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Quick Verdict</p>
            <p className="text-white text-lg leading-relaxed">
              If you are an Indian options trader who wants to backtest strategies on real NSE data and practice paper trading before going live — OptionsGyani gives you more for 1/5th the price.
            </p>
          </div>

          {/* Price Comparison Table */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-6">Feature-by-Feature Comparison</h2>
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4 w-[40%]">Feature</th>
                  <th className="text-center text-slate-400 font-medium pb-3 px-3">Sensibull</th>
                  <th className="text-center text-blue-400 font-bold pb-3 px-3">OptionsGyani</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="text-slate-300 py-3 pr-4 font-medium">{row.feature}</td>
                    <td className={`text-center py-3 px-3 ${row.sensibullBad ? "text-rose-400" : row.bothGood ? "text-emerald-400" : "text-slate-400"}`}>
                      {row.sensibullBad ? "❌ " : row.bothGood ? "✅ " : ""}{row.sensibull}
                    </td>
                    <td className={`text-center py-3 px-3 bg-blue-500/5 ${row.ogGood || row.bothGood ? "text-emerald-400 font-semibold" : "text-slate-300"}`}>
                      {row.ogGood ? "✅ " : row.bothGood ? "✅ " : ""}{row.og}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Where Sensibull Wins */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Where Sensibull wins</h2>
            <p className="text-slate-400 text-sm mb-4">We want to be honest. Sensibull has genuine strengths:</p>
            <ul className="space-y-3">
              {[
                "More pre-built strategy templates (18+) with visual payoff diagrams.",
                "Better strategy visualization and step-by-step setup walkthroughs.",
                "Longer track record — launched in 2019, widely used by retail traders.",
                "Deep Zerodha integration — if you use Zerodha, the workflow is seamless.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5 shrink-0">—</span>
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Where OptionsGyani Wins */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 border border-blue-500/20 bg-blue-500/5">
            <h2 className="text-xl font-bold text-white mb-4">Where OptionsGyani wins</h2>
            <ul className="space-y-3">
              {[
                "Backtesting on 8+ years of real NSE tick data — Sensibull has none.",
                "Live paper trading with real NSE prices — Sensibull has none.",
                "₹2,000/month cheaper at the paid tier (₹499 vs ₹2,499).",
                "Broker-agnostic — works with Zerodha, Dhan, Upstox, or any broker.",
                "IVP displayed directly on the option chain for faster screening.",
                "Free tier available — 3 backtests per day, no credit card required.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who Should Choose What */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-5">Who should choose what</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <p className="text-slate-400 font-semibold mb-4 text-sm uppercase tracking-widest">Choose Sensibull if...</p>
                <ul className="space-y-3">
                  {[
                    "You use Zerodha and want tight broker integration.",
                    "You prefer guided, pre-built strategy templates over custom builds.",
                    "You are new to options and want structured educational walkthroughs.",
                    "You don't need historical backtesting and trust your intuition.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-blue-500/20 bg-blue-500/5">
                <p className="text-blue-400 font-semibold mb-4 text-sm uppercase tracking-widest">Choose OptionsGyani if...</p>
                <ul className="space-y-3">
                  {[
                    "You want to backtest your strategies on 8+ years of real NSE data.",
                    "You want to practice with live paper trading before using real capital.",
                    "You use a broker other than Zerodha.",
                    "You want a free tier to explore before paying.",
                    "You are building a quantitative edge and need historical proof.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className={i < faqs.length - 1 ? "pb-6 border-b border-white/5" : ""}>
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-2xl p-8 text-center border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-3">Try OptionsGyani free</h2>
            <p className="text-slate-400 mb-2">3 free backtests per day. No credit card required.</p>
            <p className="text-slate-500 text-sm mb-6">Upgrade to paid for unlimited backtests at ₹499/month.</p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Try OptionsGyani free →
            </Link>
          </div>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link href="/compare" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              ← All comparisons
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

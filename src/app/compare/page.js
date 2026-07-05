import Link from "next/link";

export const metadata = {
  title: "OptionsGyani vs Sensibull, Opstra & Others — Honest Comparison",
  description:
    "Compare OptionsGyani with Sensibull, Opstra, Quantsapp and other options analytics platforms. Honest feature and price comparison for Indian F&O traders.",
  alternates: { canonical: "https://www.optionsgyani.com/compare" },
  openGraph: {
    title: "OptionsGyani vs Sensibull, Opstra & Others — Honest Comparison",
    description:
      "Compare OptionsGyani with Sensibull, Opstra, Quantsapp and other options analytics platforms. Honest feature and price comparison for Indian F&O traders.",
    url: "https://www.optionsgyani.com/compare",
    siteName: "OptionsGyani",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani Comparison" }],
  },
};

const CHECK = <span className="text-emerald-400 font-bold">✓</span>;
const CROSS = <span className="text-rose-400 font-bold">✗</span>;

const rows = [
  {
    feature: "Backtesting (8yr NSE data)",
    og: CHECK,
    sensibull: CROSS,
    opstra: CROSS,
    quantsapp: <span className="text-amber-400 text-sm">✓ limited</span>,
    zerodha: CROSS,
  },
  {
    feature: "Paper Trading",
    og: CHECK,
    sensibull: CROSS,
    opstra: CROSS,
    quantsapp: CROSS,
    zerodha: CROSS,
  },
  {
    feature: "Live Option Chain with Greeks",
    og: CHECK,
    sensibull: CHECK,
    opstra: CHECK,
    quantsapp: CHECK,
    zerodha: <span className="text-amber-400 text-sm">✓ basic</span>,
  },
  {
    feature: "IV Percentile (IVP)",
    og: CHECK,
    sensibull: CHECK,
    opstra: CHECK,
    quantsapp: CHECK,
    zerodha: CROSS,
  },
  {
    feature: "OI Analysis",
    og: CHECK,
    sensibull: CHECK,
    opstra: CHECK,
    quantsapp: CHECK,
    zerodha: CROSS,
  },
  {
    feature: "Price",
    og: <span className="text-white font-semibold">₹499/mo</span>,
    sensibull: <span className="text-white font-semibold">₹2,499/mo</span>,
    opstra: <span className="text-emerald-400 font-semibold">Free</span>,
    quantsapp: <span className="text-white font-semibold">₹1,499/mo</span>,
    zerodha: <span className="text-slate-400 text-sm">₹0 (broker)</span>,
  },
  {
    feature: "Free Tier",
    og: CHECK,
    sensibull: CROSS,
    opstra: <span className="text-emerald-400 text-sm">✓ full</span>,
    quantsapp: CROSS,
    zerodha: <span className="text-amber-400 text-sm">✓ broker</span>,
  },
];

const compareCards = [
  {
    slug: "sensibull-vs-optionsgyani",
    title: "Sensibull vs OptionsGyani",
    subtitle: "Sensibull costs ₹2,499/mo and has no backtesting. See how they compare.",
    tag: "Most searched",
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Hero */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-4">Honest Comparisons</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
              OptionsGyani vs The Rest
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built specifically for Indian F&O traders. Side-by-side feature and price comparisons so you can decide with facts, not marketing.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-12 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-6">Platform Feature Comparison</h2>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4 w-[30%]">Feature</th>
                  <th className="text-center text-blue-400 font-bold pb-3 px-2">OptionsGyani</th>
                  <th className="text-center text-slate-400 font-medium pb-3 px-2">Sensibull</th>
                  <th className="text-center text-slate-400 font-medium pb-3 px-2">Opstra</th>
                  <th className="text-center text-slate-400 font-medium pb-3 px-2">Quantsapp</th>
                  <th className="text-center text-slate-400 font-medium pb-3 px-2">Zerodha Kite</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="text-slate-300 py-3 pr-4 font-medium">{row.feature}</td>
                    <td className="text-center py-3 px-2 bg-blue-500/5">{row.og}</td>
                    <td className="text-center py-3 px-2">{row.sensibull}</td>
                    <td className="text-center py-3 px-2">{row.opstra}</td>
                    <td className="text-center py-3 px-2">{row.quantsapp}</td>
                    <td className="text-center py-3 px-2">{row.zerodha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparison Article Cards */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-5">In-Depth Comparisons</h2>
            <div className="grid gap-4">
              {compareCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/compare/${card.slug}`}
                  className="glass-card rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all border border-white/5"
                >
                  <div>
                    {card.tag && (
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2 block">
                        {card.tag}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                    <p className="text-slate-400 text-sm">{card.subtitle}</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-blue-400 transition-colors ml-4 shrink-0 text-xl">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-2xl p-8 text-center border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-3">See for yourself</h2>
            <p className="text-slate-400 mb-6">3 free backtests per day. No credit card required.</p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Try OptionsGyani free →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

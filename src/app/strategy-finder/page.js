import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import StrategyFinder, { VIEWS, UNDERLYINGS, getRanked, META } from "@/components/StrategyFinder";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Options Strategy Finder — Which Strategy Actually Worked? (8 Years of NSE Data) | OptionsGyani",
  description: "Pick your market view and see which options strategy actually performed best on NIFTY & BANK NIFTY — real win rates, average P&L and worst-case losses from every expiry since 2018. Free, no login.",
  keywords: "options strategy finder, best options strategy india, which option strategy to use, nifty options strategy win rate, options strategy backtest, best strategy for sideways market",
  alternates: { canonical: "https://www.optionsgyani.com/strategy-finder" },
  openGraph: {
    title: "Options Strategy Finder — Which Strategy Actually Worked?",
    description: "Real win rates and P&L for 10 options strategies across every NIFTY & BANK NIFTY expiry since 2018.",
    url: "https://www.optionsgyani.com/strategy-finder",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Options Strategy Finder — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "How do you know which options strategy is best?", a: "You test it. This tool replays 10 standard strategies across every NIFTY and BANK NIFTY expiry since 2018 using real NSE Bhavcopy prices, and reports what actually happened — win rate, average profit or loss per lot, the best expiry and the worst one. Nothing here is a prediction; it is a record." },
  { q: "Which options strategy has the highest win rate?", a: "Credit strategies win most often. On NIFTY since 2018, the bull put spread won 67.9% of expiries and the short strangle 63.7%. But win rate alone is misleading — a strategy can win 6 times out of 10 and still lose money overall if the losses are larger than the wins, which is why average P&L, profit factor and worst-case loss are shown alongside it." },
  { q: "Is a high win rate the same as being profitable?", a: "No, and this is the most common mistake in options. The bear call spread won 66.5% of NIFTY expiries yet still averaged a small loss, because the losing expiries cost far more than the winners made. Always read the win rate together with the worst-case column." },
  { q: "Why does the iron condor win less often than a short strangle?", a: "Because the protective wings cost money. On NIFTY the wings consumed about 72% of the credit, which pulls the breakevens inward and makes the trade lose more often. In exchange, the worst expiry lost about ₹5,100 instead of about ₹82,100. The condor trades win rate for survival — that is the entire point of defined risk." },
  { q: "Do these numbers include brokerage and slippage?", a: "No. They are gross results at closing prices, so live trading will be worse. They also assume you enter roughly 4 days before expiry and never adjust the position. Treat them as a baseline for comparison between strategies, not as an achievable return." },
];

export default function StrategyFinderHub() {
  // Lead with the honest headline number rather than a marketing claim.
  const neutral = getRanked("neutral", "NIFTY");
  const top = neutral[0];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-4xl mx-auto px-4 pt-28 pb-6">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Compass size={14} /> Free · Real NSE data since {META.since.slice(0, 4)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Options Strategy Finder</h1>
        <p className="text-slate-400 max-w-2xl mb-5">
          Most &ldquo;best strategy&rdquo; lists are opinion. This one replays 10 strategies across{" "}
          <strong className="text-slate-200">every NIFTY and BANK NIFTY expiry since {META.since.slice(0, 4)}</strong>{" "}
          on real NSE prices and shows what actually happened — including the losses.
        </p>

        {top && (
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 px-4 py-3 mb-8">
            <p className="text-sm text-slate-300">
              Example: selling the ATM straddle on NIFTY won{" "}
              <strong className="text-emerald-400">{top.m.winRate}%</strong> of{" "}
              <strong className="text-white">{top.m.trades}</strong> expiries — and one of them lost{" "}
              <strong className="text-red-400">₹{Math.abs(top.m.worst).toLocaleString("en-IN")}</strong> on a single lot.
            </p>
          </div>
        )}

        <h2 className="text-lg font-semibold text-white mb-3">What do you expect the market to do?</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {Object.entries(VIEWS).map(([key, v]) => (
            <Link key={key} href={`/strategy-finder/${key}`}
              className="group rounded-2xl border border-white/10 bg-slate-900/40 p-5 hover:border-indigo-500/50 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-white font-semibold">
                  <v.icon size={17} className="text-indigo-400" /> {v.label}
                </span>
                <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-slate-400">{v.blurb}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white mb-3">All strategies, ranked by average P&amp;L</h2>
        <StrategyFinder view={null} />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Strategy Finder — FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/options-profit-calculator" className="text-indigo-400 hover:text-indigo-300">Options Profit Calculator →</Link>
          <Link href="/margin-calculator" className="text-indigo-400 hover:text-indigo-300">Margin Calculator →</Link>
          <Link href="/strategies" className="text-indigo-400 hover:text-indigo-300">Strategy guides →</Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Compass, ArrowLeft } from "lucide-react";
import StrategyFinder, { VIEWS, UNDERLYINGS, getRanked, META } from "@/components/StrategyFinder";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(VIEWS).map((view) => ({ view }));
}

const TITLE = {
  neutral:  "Best Options Strategy for a Sideways Market",
  bullish:  "Best Options Strategy When You're Bullish",
  bearish:  "Best Options Strategy When You're Bearish",
  volatile: "Best Options Strategy for a Big Move",
};

export async function generateMetadata({ params }) {
  const { view } = await params;
  const v = VIEWS[view];
  if (!v) return {};
  const ranked = getRanked(view, "NIFTY");
  const best = ranked[0];
  const title = `${TITLE[view]} — Real NIFTY Results Since ${META.since.slice(0, 4)} | OptionsGyani`;
  const desc = best
    ? `${v.label}? ${best.name} led on NIFTY with a ${best.m.winRate}% win rate across ${best.m.trades} expiries since ${META.since.slice(0, 4)} — with the worst expiry losing ₹${Math.abs(best.m.worst).toLocaleString("en-IN")}. Compare every strategy on real NSE data. Free.`
    : `Compare options strategies for a ${v.label.toLowerCase()} view on real NSE data.`;
  return {
    title, description: desc,
    keywords: `best options strategy ${view} market india, ${view} options strategy nifty, which strategy for ${view} view, nifty ${view} option strategy win rate`,
    alternates: { canonical: `https://www.optionsgyani.com/strategy-finder/${view}` },
    openGraph: { title, description: desc, url: `https://www.optionsgyani.com/strategy-finder/${view}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }], type: "article" },
  };
}

export default async function StrategyFinderView({ params }) {
  // Validate the route segment BEFORE touching searchParams. Awaiting
  // searchParams first opts the route into dynamic streaming, which commits a
  // 200 header before notFound() runs — producing a soft 404 (404 content served
  // with HTTP 200) on an unbounded URL space. Bad for crawl budget.
  const { view } = await params;
  const v = VIEWS[view];
  if (!v) notFound();

  const underlying = "NIFTY";
  const ranked = getRanked(view, underlying);
  const best = ranked[0];
  const worstCase = ranked.reduce((w, s) => (s.m.worst < w ? s.m.worst : w), 0);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        "headline": TITLE[view],
        "description": `Historical performance of options strategies for a ${v.label.toLowerCase()} view on ${underlying}, measured across every expiry since ${META.since}.`,
        "author": { "@type": "Organization", "name": "OptionsGyani" },
        "publisher": { "@type": "Organization", "name": "OptionsGyani", "url": "https://www.optionsgyani.com" },
        "dateModified": META.generatedAt.slice(0, 10),
        "mainEntityOfPage": `https://www.optionsgyani.com/strategy-finder/${view}`,
      }) }} />

      <section className="max-w-4xl mx-auto px-4 pt-28 pb-6">
        <Link href="/strategy-finder" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4">
          <ArrowLeft size={13} /> All market views
        </Link>

        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Compass size={14} /> {v.label}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{TITLE[view]}</h1>

        {best ? (
          <p className="text-slate-400 max-w-2xl mb-8">
            {v.blurb} Across <strong className="text-slate-200">{best.m.trades} {underlying} expiries</strong> since {META.since.slice(0, 4)},{" "}
            <strong className="text-white">{best.name}</strong> produced the best average result —{" "}
            <strong className="text-emerald-400">{best.m.winRate}% win rate</strong>. But the worst single expiry in this
            group lost <strong className="text-red-400">₹{Math.abs(worstCase).toLocaleString("en-IN")}</strong> on one lot,
            which is the part most strategy lists leave out.
          </p>
        ) : (
          <p className="text-slate-400 mb-8">No strategies matched this view.</p>
        )}

        <StrategyFinder view={view} />

        <div className="mt-8 rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 p-6">
          <h2 className="text-lg font-bold text-white mb-1.5">Test it with your own strikes</h2>
          <p className="text-sm text-slate-400 mb-4">
            These use a fixed rule (ATM-relative strikes, entry ~{META.entryDays} days out, held to expiry). Your strikes,
            dates and stop-losses will behave differently — run them against the same 8 years of data.
          </p>
          <Link href="/backtest" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
            Open the backtester — free
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {Object.entries(VIEWS).filter(([k]) => k !== view).map(([k, o]) => (
            <Link key={k} href={`/strategy-finder/${k}`} className="text-indigo-400 hover:text-indigo-300">{o.label} →</Link>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart2, Activity, Target, TrendingUp, Info, ArrowRight } from "lucide-react";
import PublicOptionChain from "@/components/PublicOptionChain";
import DhanReferralBanner from "@/components/DhanReferralBanner";
import { FNO_STOCKS, FEATURED_STOCKS, SLUG_TO_SYMBOL } from "@/data/fnoStocks";

export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-render the liquid/featured names; the rest render on-demand.
  return FEATURED_STOCKS.map((sym) => ({ stock: FNO_STOCKS[sym].slug }));
}

function symbolFromSlug(slug) {
  return SLUG_TO_SYMBOL[slug] || null;
}

export async function generateMetadata({ params }) {
  const { stock } = await params;
  const symbol = symbolFromSlug(stock);
  if (!symbol) return {};
  const url = `https://www.optionsgyani.com/option-chain/${stock}`;
  return {
    title: `${symbol} Option Chain Live — OI, IV, PCR & Max Pain (Free) | OptionsGyani`,
    description: `Live ${symbol} option chain with real-time Open Interest, IV, LTP, PCR and Max Pain by strike. Free NSE stock options data. Monthly expiry (last Tuesday). No login.`,
    keywords: `${symbol} option chain, ${symbol} option chain live, ${symbol} oi, ${symbol} pcr, ${symbol} options, nse ${symbol} option chain`,
    alternates: { canonical: url },
    openGraph: {
      title: `${symbol} Option Chain Live — OI, IV, PCR & Max Pain | OptionsGyani`,
      description: `Real-time ${symbol} option chain, PCR and Max Pain. Free NSE data. Monthly (last-Tuesday) expiry.`,
      url,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${symbol} Option Chain — OptionsGyani` }],
      type: "website",
    },
  };
}

export default async function StockOptionChainPage({ params }) {
  const { stock } = await params;
  const symbol = symbolFromSlug(stock);
  if (!symbol) notFound();

  const lot = FNO_STOCKS[symbol]?.lot;
  const FAQ = [
    { q: `When do ${symbol} options expire?`, a: `${symbol} stock options are monthly-only, expiring on the last Tuesday of each month. If that Tuesday is a trading holiday, expiry shifts to the previous trading day. Stock options in India do not have weekly expiries.` },
    { q: `What is PCR in the ${symbol} option chain?`, a: `PCR (Put-Call Ratio) is total Put OI divided by total Call OI. Above 1 leans bullish (heavier put writing/support), below 1 leans bearish (heavier call writing/resistance). It is computed live from the full chain above.` },
    { q: `What is Max Pain for ${symbol}?`, a: `Max Pain is the strike at which option buyers collectively lose the most, and where writers would prefer ${symbol} to settle at expiry. It is derived live from open interest across all strikes above.` },
    { q: `What is the ${symbol} options lot size?`, a: lot ? `${symbol} options have a lot size of ${lot.toLocaleString("en-IN")} shares per contract, as set by NSE. One lot controls ${lot.toLocaleString("en-IN")} shares of the underlying.` : `${symbol} options trade in NSE-defined lot sizes. See the live chain above for current contract details.` },
    { q: `Is this ${symbol} option chain free?`, a: `Yes. Live ${symbol} OI, IV, LTP, PCR and Max Pain are free to view with no login. A free account unlocks strategy backtesting on 8+ years of real NSE data.` },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Activity size={14} /> Live NSE Data · Monthly Expiry (Last Tuesday)
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{symbol} Option Chain — Live OI, IV, PCR &amp; Max Pain</h1>
        <p className="text-slate-400 max-w-3xl mb-5">
          Real-time {symbol} option chain with strike-wise Open Interest, Implied Volatility, LTP, live Put-Call Ratio and Max Pain — free, no login. {symbol} stock options expire <strong className="text-slate-200">monthly, on the last Tuesday</strong>. Read the OI walls, then backtest any strike on years of real NSE data.
        </p>
        <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 mb-8 max-w-3xl">
          <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-300">
            {symbol} options are <strong>monthly-only</strong>{lot ? <> · lot size <strong>{lot.toLocaleString("en-IN")}</strong> shares</> : null}. Indian stock options have no weekly expiry.
          </p>
        </div>

        <PublicOptionChain symbol={symbol} label={symbol} />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">How to read the {symbol} option chain</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: BarChart2, t: "Open Interest (OI)", d: `Outstanding contracts per strike. Heavy Call OI above spot acts as resistance; heavy Put OI below spot acts as support — the OI walls the market defends into ${symbol}'s monthly expiry.` },
            { icon: Activity, t: "Change in OI", d: "Fresh OI build-up shows where today's positioning is flowing. Rising Call OI caps upside; rising Put OI signals support building at that strike." },
            { icon: Target, t: "Max Pain", d: `The strike where most option buyers lose. With monthly expiry, ${symbol} Max Pain matters most in the final week before the last-Tuesday settlement.` },
            { icon: TrendingUp, t: "PCR", d: "Total Put OI ÷ Call OI. Read extremes rather than the absolute value — a sharply rising PCR signals aggressive put writing (support building)." },
            { icon: BarChart2, t: "Implied Volatility", d: "The expected move priced into each option. High IV = expensive premium (favours sellers); low IV = cheap premium (favours buyers). Compare across strikes for skew." },
            { icon: Target, t: "ATM Strike", d: "The strike closest to spot (highlighted). ATM options carry the most gamma and move fastest as monthly expiry approaches." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <c.icon size={22} className="text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white mb-1.5">{c.t}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Other option chains</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/nifty-option-chain", t: "NIFTY" },
            { href: "/bank-nifty-option-chain", t: "BANK NIFTY" },
            { href: "/fii-dii-data", t: "FII/DII Data" },
            { href: "/options-profit-calculator", t: "Profit Calculator" },
            { href: "/margin-calculator", t: "Margin Calculator" },
            ...FEATURED_STOCKS.filter((s) => s !== symbol).slice(0, 10).map((s) => ({ href: `/option-chain/${FNO_STOCKS[s].slug}`, t: s })),
            { href: "/option-chain", t: "All stocks →" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">{symbol} option chain — FAQ</h2>
        <div className="space-y-4 max-w-3xl">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

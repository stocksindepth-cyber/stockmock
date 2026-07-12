import Link from "next/link";
import { BarChart2, Activity, Target, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import PublicOptionChain from "@/components/PublicOptionChain";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "NIFTY Option Chain Live — OI, IV, PCR & Max Pain (Free) | OptionsGyani",
  description: "Live NIFTY option chain with real-time Open Interest, IV, LTP, PCR and Max Pain by strike. Free NSE options data, weekly Tuesday expiry. Backtest any strike on 8+ years of data.",
  keywords: "nifty option chain, nifty option chain live, nifty oi, nifty pcr, nifty max pain, nse option chain nifty, nifty options data",
  alternates: { canonical: "https://www.optionsgyani.com/nifty-option-chain" },
  openGraph: {
    title: "NIFTY Option Chain Live — OI, IV, PCR & Max Pain | OptionsGyani",
    description: "Real-time NIFTY option chain, PCR and Max Pain. Free NSE data. Weekly Tuesday expiry.",
    url: "https://www.optionsgyani.com/nifty-option-chain",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NIFTY Option Chain — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "When does NIFTY option expire?", a: "NIFTY weekly options expire every Tuesday. Since 1 September 2025, NSE moved the NIFTY weekly expiry from Thursday to Tuesday. If Tuesday is a trading holiday, the expiry shifts to the previous trading day." },
  { q: "What is PCR in the NIFTY option chain?", a: "PCR (Put-Call Ratio) is total Put OI divided by total Call OI. A PCR above 1 means puts are being written more heavily (often read as bullish/support-building), while below 1 means calls dominate (often read as resistance/bearish). We compute it live from the full chain above." },
  { q: "What is Max Pain in NIFTY?", a: "Max Pain is the strike price at which option buyers, in aggregate, lose the most — and therefore where option writers would prefer NIFTY to expire. It is calculated from open interest across all strikes and updated live above." },
  { q: "Is this NIFTY option chain data free?", a: "Yes. Viewing the live NIFTY option chain, OI, IV, PCR and Max Pain is completely free with no login. A free account lets you backtest any strategy on this chain across 8+ years of real NSE data." },
];

export default function NiftyOptionChainPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Activity size={14} /> Live NSE Data · Weekly Tuesday Expiry
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">NIFTY Option Chain — Live OI, IV, PCR &amp; Max Pain</h1>
        <p className="text-slate-400 max-w-3xl mb-8">
          Real-time NIFTY 50 option chain with strike-wise Open Interest, Implied Volatility, LTP, live Put-Call Ratio and Max Pain — free, no login. NIFTY weekly options expire every <strong className="text-slate-200">Tuesday</strong>. Pick an expiry, read the OI walls, then backtest any strike on 8+ years of real NSE data.
        </p>

        <PublicOptionChain symbol="NIFTY" label="NIFTY" />
      </section>

      {/* How to read it */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">How to read the NIFTY option chain</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: BarChart2, t: "Open Interest (OI)", d: "The number of outstanding contracts at each strike. Large Call OI above spot acts as resistance; large Put OI below spot acts as support. The highest OI strikes are the 'walls' the market defends into expiry." },
            { icon: Activity, t: "Change in OI", d: "Fresh OI build-up shows where today's money is positioning. Call writing (rising Call OI) caps upside; Put writing (rising Put OI) signals support building at that strike." },
            { icon: Target, t: "Max Pain", d: "The strike where the most option buyers lose. NIFTY often gravitates toward Max Pain into Tuesday expiry as writers defend their positions — useful as a magnet level, not a guarantee." },
            { icon: TrendingUp, t: "PCR (Put-Call Ratio)", d: "Total Put OI ÷ total Call OI. Rising PCR (>1) leans bullish as put writers build support; falling PCR (<1) leans bearish. Read extremes, not the absolute number." },
            { icon: BookOpen, t: "Implied Volatility (IV)", d: "The market's expected move priced into each option. High IV = expensive premium (favours sellers); low IV = cheap premium (favours buyers). Compare IV across strikes to spot skew." },
            { icon: BarChart2, t: "ATM Strike", d: "The strike closest to spot (highlighted). ATM options carry the most gamma and time value — they move fastest near Tuesday expiry, which is where most intraday action concentrates." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <c.icon size={22} className="text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white mb-1.5">{c.t}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Go deeper</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/bank-nifty-option-chain", t: "BANK NIFTY Option Chain" },
            { href: "/fii-dii-data", t: "FII/DII Data Today" },
            { href: "/options-profit-calculator", t: "Options Profit Calculator" },
            { href: "/margin-calculator", t: "Margin Calculator" },
            { href: "/ltp-calculator/nifty", t: "NIFTY LTP Calculator" },
            { href: "/nifty-expiry-day-2026", t: "NIFTY Expiry Dates 2026" },
            { href: "/learn/how-to-read-option-chain", t: "Guide: Read an Option Chain" },
            { href: "/learn/max-pain-options", t: "Guide: Max Pain Explained" },
            { href: "/learn/pcr-ratio-explained", t: "Guide: PCR Explained" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t} <ArrowRight size={14} className="text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">NIFTY option chain — FAQ</h2>
        <div className="space-y-4 max-w-3xl">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <DhanReferralBanner />
      </section>
    </main>
  );
}

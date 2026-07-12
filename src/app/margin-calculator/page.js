import Link from "next/link";
import { Calculator, ShieldCheck, Percent, LineChart } from "lucide-react";
import MarginCalculator from "@/components/MarginCalculator";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "Options Margin Calculator — SPAN + Exposure Estimate (NIFTY, BANK NIFTY) | OptionsGyani",
  description: "Free F&O margin calculator for NSE options. Estimate the SPAN + Exposure margin blocked to sell/write NIFTY & BANK NIFTY options, with live spot and editable rates. An estimate — verify with your broker.",
  keywords: "span margin calculator, option margin calculator, f&o margin calculator, nifty margin calculator, option selling margin, option writing margin calculator, banknifty margin calculator",
  alternates: { canonical: "https://www.optionsgyani.com/margin-calculator" },
  openGraph: {
    title: "Options Margin Calculator — SPAN + Exposure Estimate | OptionsGyani",
    description: "Estimate the margin blocked to sell NIFTY & BANK NIFTY options. Live spot, editable rates, free.",
    url: "https://www.optionsgyani.com/margin-calculator",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Options Margin Calculator — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "What is SPAN and Exposure margin?", a: "SPAN (Standard Portfolio Analysis of Risk) is the core margin the exchange blocks to cover the worst-case one-day move of your F&O position, calculated from NSE's daily risk-parameter files. Exposure margin is an additional buffer on top. Together they are the total margin blocked when you sell (write) an option or trade futures." },
  { q: "How much margin is needed to sell one lot of NIFTY options?", a: "As a rough guide, selling one lot of an index option typically blocks in the region of 11–14% of the contract value as SPAN + Exposure, but the exact figure changes daily with volatility and is finalised by your broker. Enter your spot, lots and rates above for an estimate — then confirm the precise number in your broker's official calculator." },
  { q: "Do option buyers need margin?", a: "No. If you buy (go long) a call or put, you only pay the premium — there is no SPAN or Exposure margin. Margin applies when you sell/write options or trade futures, because those carry open-ended risk. Set the position to 'Buy' above and the tool shows only the premium payable." },
  { q: "Is this margin figure exact?", a: "No — it is a transparent estimate. True SPAN margin comes from NSE's proprietary daily risk files and depends on volatility, calendar spreads and whether your position is hedged (hedged positions get large margin benefits). Always verify the exact margin in your broker's official margin calculator before trading." },
  { q: "Does hedging reduce margin?", a: "Yes, significantly. A defined-risk spread (e.g. selling a call and buying a further call) blocks far less margin than a naked short option, because the exchange recognises the capped risk. This simple estimator models single legs; use your broker's calculator for exact hedged-position margins." },
];

export default function MarginCalculatorPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Options Margin Calculator</h1>
        <p className="text-slate-400 max-w-2xl mb-8">
          Estimate the SPAN + Exposure margin blocked to sell or write NIFTY, BANK NIFTY, FIN NIFTY and SENSEX options.
          Live spot is auto-filled and the rates are editable, so you can match your broker&apos;s published figures.
        </p>
        <MarginCalculator defaultSymbol="NIFTY" />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 border-t border-white/10">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Percent, t: "SPAN + Exposure", d: "See both components and the total margin blocked, on the current live spot." },
            { icon: ShieldCheck, t: "Honest estimate", d: "Transparent, editable rates — never a fake 'exact SPAN'. Verify with your broker before trading." },
            { icon: LineChart, t: "Test before you sell", d: "Option selling can carry large risk. Backtest the strategy on 8+ years of NSE data first." },
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
        <h2 className="text-2xl font-bold text-white mb-6">Margin Calculator — FAQ</h2>
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
          <Link href="/ltp-calculator" className="text-indigo-400 hover:text-indigo-300">LTP Calculator →</Link>
          <Link href="/strategies" className="text-indigo-400 hover:text-indigo-300">Strategy backtests →</Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

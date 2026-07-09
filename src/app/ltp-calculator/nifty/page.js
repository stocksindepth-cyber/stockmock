import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LtpCalculator from "@/components/LtpCalculator";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "NIFTY LTP Calculator — Live Option Price Estimator (Free) | OptionsGyani",
  description: "Free NIFTY LTP Calculator. Estimate any NIFTY option's Last Traded Price at a target spot and date using live IV and Black-Scholes. Weekly Tuesday expiry. No login.",
  keywords: "ltp calculator, nifty ltp calculator, ltp calculator nifty, option ltp calculator, nifty option price calculator, nse ltp calculator",
  alternates: { canonical: "https://www.optionsgyani.com/ltp-calculator/nifty" },
  openGraph: {
    title: "NIFTY LTP Calculator — Live Option Price Estimator | OptionsGyani",
    description: "Estimate any NIFTY option's LTP at a target spot & date. Live IV, Black-Scholes, free.",
    url: "https://www.optionsgyani.com/ltp-calculator/nifty",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NIFTY LTP Calculator" }],
    type: "website",
  },
};

const FAQ = [
  { q: "What is an LTP Calculator?", a: "An LTP (Last Traded Price) calculator estimates what an option's price will be if the underlying moves to a target level by a chosen date. Our NIFTY LTP calculator auto-fills the live spot and ATM implied volatility, then uses the Black-Scholes model to project the option's LTP, delta and theta." },
  { q: "How accurate is the LTP calculator?", a: "It's a theoretical Black-Scholes estimate — very useful for planning entries, exits and what-if scenarios, but real market LTP differs due to changing IV, bid-ask spreads and liquidity. Use it as a guide, not a guarantee." },
  { q: "When does NIFTY expire?", a: "NIFTY weekly options expire every Tuesday (moved from Thursday in September 2025). Set 'Days to Expiry' to the number of days until the coming Tuesday for the most relevant estimate." },
  { q: "Is the NIFTY LTP calculator free?", a: "Yes, completely free with no login. For live LTP across every strike, see the free NIFTY option chain; a free account adds strategy backtesting on 8+ years of NSE data." },
];

export default function NiftyLtpPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />
      <section className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">NIFTY LTP Calculator</h1>
        <p className="text-slate-400 max-w-2xl mb-8">
          Estimate any NIFTY option&apos;s Last Traded Price at your target spot and date. Live spot and ATM IV are filled in automatically — just set a target and see the projected LTP, delta and theta. NIFTY expires weekly on <strong className="text-slate-200">Tuesday</strong>.
        </p>
        <LtpCalculator symbol="NIFTY" label="NIFTY" step={50} />
      </section>
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/ltp-calculator/bank-nifty", t: "BANK NIFTY LTP Calculator" },
            { href: "/nifty-option-chain", t: "NIFTY Option Chain (live LTP)" },
            { href: "/nifty-expiry-day-2026", t: "NIFTY Expiry Dates 2026" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t} <ArrowRight size={14} className="text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">NIFTY LTP Calculator — FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

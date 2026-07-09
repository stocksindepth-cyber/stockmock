import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import LtpCalculator from "@/components/LtpCalculator";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "BANK NIFTY LTP Calculator — Live Option Price Estimator (Free) | OptionsGyani",
  description: "Free BANK NIFTY LTP Calculator. Estimate any BANKNIFTY option's Last Traded Price at a target spot and date using live IV and Black-Scholes. Monthly expiry (last Tuesday). No login.",
  keywords: "bank nifty ltp calculator, banknifty ltp calculator, ltp calculator bank nifty, banknifty option price calculator, bank nifty option calculator",
  alternates: { canonical: "https://www.optionsgyani.com/ltp-calculator/bank-nifty" },
  openGraph: {
    title: "BANK NIFTY LTP Calculator — Live Option Price Estimator | OptionsGyani",
    description: "Estimate any BANKNIFTY option's LTP at a target spot & date. Live IV, Black-Scholes, free.",
    url: "https://www.optionsgyani.com/ltp-calculator/bank-nifty",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BANK NIFTY LTP Calculator" }],
    type: "website",
  },
};

const FAQ = [
  { q: "What is the BANK NIFTY LTP Calculator?", a: "It estimates what a BANKNIFTY option's Last Traded Price will be if the index moves to a target level by a chosen date. Live spot and ATM implied volatility auto-fill, then Black-Scholes projects the LTP, delta and theta." },
  { q: "When does BANK NIFTY expire now?", a: "BANK NIFTY no longer has weekly options — since 2025 it is monthly-only, expiring the last Tuesday of each month. Set 'Days to Expiry' to the days remaining until that last Tuesday." },
  { q: "How accurate is it?", a: "It is a theoretical Black-Scholes estimate for planning and what-if analysis. Real LTP moves with live IV, spreads and liquidity — BANKNIFTY IV in particular runs higher and moves fast, so treat outputs as a guide, not a guarantee." },
  { q: "Is it free?", a: "Yes, free and no login. For live LTP across every strike see the free BANKNIFTY option chain; a free account adds backtesting on 8+ years of NSE data." },
];

export default function BankNiftyLtpPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />
      <section className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">BANK NIFTY LTP Calculator</h1>
        <p className="text-slate-400 max-w-2xl mb-5">
          Estimate any BANK NIFTY option&apos;s Last Traded Price at your target spot and date. Live spot and ATM IV auto-fill — set a target to see projected LTP, delta and theta.
        </p>
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 mb-8 max-w-2xl">
          <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200/90"><strong>BANK NIFTY is now monthly-only</strong>, expiring the last Tuesday of each month. Set days-to-expiry accordingly.</p>
        </div>
        <LtpCalculator symbol="BANKNIFTY" label="BANK NIFTY" step={100} />
      </section>
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/ltp-calculator/nifty", t: "NIFTY LTP Calculator" },
            { href: "/bank-nifty-option-chain", t: "BANK NIFTY Option Chain (live LTP)" },
            { href: "/nifty-expiry-day-2026", t: "Expiry Dates 2026" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t} <ArrowRight size={14} className="text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">BANK NIFTY LTP Calculator — FAQ</h2>
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

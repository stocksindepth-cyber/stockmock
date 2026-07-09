import Link from "next/link";
import { Calculator, ArrowRight, Activity, Target, BookOpen } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "LTP Calculator — Free NSE Option LTP Calculator (NIFTY & BANK NIFTY) | OptionsGyani",
  description: "Free LTP Calculator for NSE options. Estimate any option's Last Traded Price at a target spot and date with live IV and Black-Scholes. NIFTY & BANK NIFTY, no login.",
  keywords: "ltp calculator, ltp calculator nse, option chain ltp calculator, nifty ltp calculator, bank nifty ltp calculator, free ltp calculator",
  alternates: { canonical: "https://www.optionsgyani.com/ltp-calculator" },
  openGraph: {
    title: "LTP Calculator — Free NSE Option LTP Calculator | OptionsGyani",
    description: "Estimate any NSE option's LTP at a target spot & date. NIFTY & BANK NIFTY. Free.",
    url: "https://www.optionsgyani.com/ltp-calculator",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LTP Calculator — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "What is an LTP Calculator?", a: "LTP stands for Last Traded Price — the most recent price at which an option changed hands. An LTP calculator estimates what that price will be if the underlying (NIFTY or BANK NIFTY) moves to a target level by a chosen date, helping you plan entries, exits and what-if scenarios before you trade." },
  { q: "How does the OptionsGyani LTP calculator work?", a: "It pulls the live spot and at-the-money implied volatility from the NSE option chain, then applies the Black-Scholes model to project the option's LTP, delta and theta at your target spot and days-to-expiry. Everything auto-fills, so you only set the target." },
  { q: "Which instruments are supported?", a: "NIFTY (weekly, Tuesday expiry) and BANK NIFTY (monthly-only, last-Tuesday expiry). Pick your index below to open its calculator." },
  { q: "Is the LTP calculator free?", a: "Yes — completely free, no login. It's a Black-Scholes estimate for education and planning; real LTP varies with live IV, spreads and liquidity." },
];

export default function LtpHubPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">LTP Calculator</h1>
        <p className="text-slate-400 max-w-2xl mb-8">
          Estimate any NSE option&apos;s Last Traded Price at a target spot and date. Live spot and implied volatility are pulled from the NSE option chain automatically — you just set your target. Pick an index to begin.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/ltp-calculator/nifty" className="group rounded-2xl border border-white/10 bg-slate-900/40 p-6 hover:border-indigo-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">NIFTY LTP Calculator</h2>
              <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-sm text-slate-400">Weekly, Tuesday expiry. Auto-filled live spot &amp; ATM IV.</p>
          </Link>
          <Link href="/ltp-calculator/bank-nifty" className="group rounded-2xl border border-white/10 bg-slate-900/40 p-6 hover:border-indigo-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">BANK NIFTY LTP Calculator</h2>
              <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-sm text-slate-400">Monthly-only, last-Tuesday expiry. Auto-filled live spot &amp; ATM IV.</p>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 border-t border-white/10">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Activity, t: "Live inputs", d: "Spot and ATM IV auto-fill from the NSE chain so estimates reflect current market conditions." },
            { icon: Target, t: "What-if targets", d: "Set any target spot and date to see the projected option LTP, delta and theta instantly." },
            { icon: BookOpen, t: "Learn as you go", d: "Understand how IV and time decay move option prices before you risk real capital." },
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
        <h2 className="text-2xl font-bold text-white mb-6">LTP Calculator — FAQ</h2>
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

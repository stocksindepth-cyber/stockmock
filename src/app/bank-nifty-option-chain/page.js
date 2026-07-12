import Link from "next/link";
import { BarChart2, Activity, Target, TrendingUp, BookOpen, ArrowRight, Info } from "lucide-react";
import PublicOptionChain from "@/components/PublicOptionChain";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "BANK NIFTY Option Chain Live — OI, IV, PCR & Max Pain (Free) | OptionsGyani",
  description: "Live BANK NIFTY option chain with real-time Open Interest, IV, LTP, PCR and Max Pain by strike. Free NSE data. BANKNIFTY now trades monthly-only, expiring the last Tuesday of the month.",
  keywords: "bank nifty option chain, banknifty option chain live, banknifty oi, banknifty pcr, banknifty max pain, nse option chain banknifty, bank nifty options data",
  alternates: { canonical: "https://www.optionsgyani.com/bank-nifty-option-chain" },
  openGraph: {
    title: "BANK NIFTY Option Chain Live — OI, IV, PCR & Max Pain | OptionsGyani",
    description: "Real-time BANK NIFTY option chain, PCR and Max Pain. Free NSE data. Monthly expiry (last Tuesday).",
    url: "https://www.optionsgyani.com/bank-nifty-option-chain",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BANK NIFTY Option Chain — OptionsGyani" }],
    type: "website",
  },
};

const FAQ = [
  { q: "When does BANK NIFTY option expire now?", a: "BANK NIFTY no longer has weekly options. Following SEBI's 2025 rationalisation, BANKNIFTY trades monthly-only contracts that expire on the last Tuesday of each month. If that Tuesday is a holiday, expiry shifts to the previous trading day. Only NIFTY retains a weekly (Tuesday) expiry on NSE." },
  { q: "Why were BANK NIFTY weekly options discontinued?", a: "SEBI limited weekly expiry contracts to a single benchmark index per exchange to reduce expiry-day speculation that was hurting retail traders. NSE kept the weekly on NIFTY, so BANKNIFTY, FINNIFTY and MIDCPNIFTY became monthly-only from 2025." },
  { q: "What is PCR in the BANK NIFTY option chain?", a: "PCR (Put-Call Ratio) is total Put OI divided by total Call OI. Above 1 leans bullish (heavier put writing/support), below 1 leans bearish (heavier call writing/resistance). It's computed live from the full chain above." },
  { q: "What is Max Pain for BANK NIFTY?", a: "Max Pain is the strike at which option buyers collectively lose the most, and where writers would prefer BANKNIFTY to settle. With BANKNIFTY now monthly, Max Pain becomes most relevant in the final week before the last-Tuesday expiry." },
  { q: "Is this BANK NIFTY option chain free?", a: "Yes. Live BANKNIFTY OI, IV, LTP, PCR and Max Pain are free to view with no login. A free account unlocks backtesting any strategy on this chain across 8+ years of real NSE data." },
];

export default function BankNiftyOptionChainPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">BANK NIFTY Option Chain — Live OI, IV, PCR &amp; Max Pain</h1>
        <p className="text-slate-400 max-w-3xl mb-5">
          Real-time BANK NIFTY option chain with strike-wise Open Interest, Implied Volatility, LTP, live Put-Call Ratio and Max Pain — free, no login. Read the OI walls, then backtest any strike on 8+ years of real NSE data.
        </p>
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 mb-8 max-w-3xl">
          <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200/90">
            <strong>Important:</strong> BANK NIFTY no longer has weekly options. Since 2025 it trades <strong>monthly-only</strong> contracts expiring the <strong>last Tuesday</strong> of each month. Only NIFTY keeps a weekly (Tuesday) expiry.
          </p>
        </div>

        <PublicOptionChain symbol="BANKNIFTY" label="BANK NIFTY" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">How to read the BANK NIFTY option chain</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: BarChart2, t: "Open Interest (OI)", d: "Outstanding contracts per strike. Heavy Call OI above spot = resistance; heavy Put OI below spot = support. BANKNIFTY's OI is spread wider than NIFTY due to higher volatility." },
            { icon: Activity, t: "Change in OI", d: "Where today's positioning is flowing. Fresh Call writing caps upside; fresh Put writing builds support. Watch the largest OI adds for the defended range." },
            { icon: Target, t: "Max Pain", d: "The strike where most buyers lose. With monthly expiry, Max Pain matters most in the final week before the last-Tuesday settlement." },
            { icon: TrendingUp, t: "PCR", d: "Total Put OI ÷ Call OI. Extremes matter more than the absolute value — a sharply rising PCR signals aggressive put writing (support building)." },
            { icon: BookOpen, t: "Implied Volatility", d: "BANKNIFTY IV typically runs 20–30% higher than NIFTY. High IV favours option sellers; low IV favours buyers. Compare across strikes for skew." },
            { icon: BarChart2, t: "ATM Strike", d: "Closest strike to spot (highlighted). Carries the most gamma — moves fastest as monthly expiry approaches." },
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
        <h2 className="text-2xl font-bold text-white mb-6">Go deeper</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/nifty-option-chain", t: "NIFTY Option Chain" },
            { href: "/fii-dii-data", t: "FII/DII Data Today" },
            { href: "/options-profit-calculator", t: "Options Profit Calculator" },
            { href: "/margin-calculator", t: "Margin Calculator" },
            { href: "/ltp-calculator/bank-nifty", t: "BANK NIFTY LTP Calculator" },
            { href: "/nifty-expiry-day-2026", t: "Expiry Dates 2026" },
            { href: "/learn/banknifty-options-guide", t: "Guide: BANKNIFTY Options" },
            { href: "/learn/how-to-read-option-chain", t: "Guide: Read an Option Chain" },
            { href: "/learn/max-pain-options", t: "Guide: Max Pain" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t} <ArrowRight size={14} className="text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">BANK NIFTY option chain — FAQ</h2>
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

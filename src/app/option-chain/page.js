import Link from "next/link";
import { Activity } from "lucide-react";
import { FNO_STOCKS, FEATURED_STOCKS } from "@/data/fnoStocks";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "NSE Option Chain — Live OI, PCR & Max Pain for Nifty, Bank Nifty & 200+ Stocks | OptionsGyani",
  description: "Free live NSE option chains: NIFTY, BANK NIFTY and 200+ F&O stocks (Reliance, HDFC Bank, TCS, Infosys & more) with real-time OI, IV, PCR and Max Pain by strike. No login.",
  keywords: "nse option chain, option chain, live option chain, stock option chain, reliance option chain, hdfc bank option chain, fno option chain india",
  alternates: { canonical: "https://www.optionsgyani.com/option-chain" },
  openGraph: {
    title: "NSE Option Chain — Nifty, Bank Nifty & 200+ Stocks | OptionsGyani",
    description: "Free live NSE option chains with OI, PCR and Max Pain for indices and 200+ F&O stocks.",
    url: "https://www.optionsgyani.com/option-chain",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NSE Option Chain — OptionsGyani" }],
    type: "website",
  },
};

const ALL_STOCKS = Object.keys(FNO_STOCKS).sort();
const featuredSet = new Set(FEATURED_STOCKS);

export default function OptionChainHub() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <section className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Activity size={14} /> Live NSE Data · Free · No Login
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">NSE Option Chain — Indices &amp; 200+ Stocks</h1>
        <p className="text-slate-400 max-w-3xl mb-8">
          Live option chains with strike-wise Open Interest, Implied Volatility, LTP, Put-Call Ratio and Max Pain for NIFTY, BANK NIFTY and every NSE F&amp;O stock. Indices carry weekly (NIFTY, Tuesday) or monthly expiries; stock options are monthly-only (last Tuesday).
        </p>

        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Indices</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/nifty-option-chain" className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-white hover:border-indigo-400 transition">NIFTY Option Chain</Link>
          <Link href="/bank-nifty-option-chain" className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-white hover:border-indigo-400 transition">BANK NIFTY Option Chain</Link>
        </div>

        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Most-traded stocks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
          {FEATURED_STOCKS.map((sym) => (
            <Link key={sym} href={`/option-chain/${FNO_STOCKS[sym].slug}`} className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {sym}
            </Link>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">All F&amp;O stocks ({ALL_STOCKS.length})</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_STOCKS.filter((s) => !featuredSet.has(s)).map((sym) => (
            <Link key={sym} href={`/option-chain/${FNO_STOCKS[sym].slug}`} className="rounded-md border border-white/5 bg-slate-900/30 px-2.5 py-1.5 text-xs text-slate-400 hover:border-indigo-500/40 hover:text-white transition">
              {sym}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

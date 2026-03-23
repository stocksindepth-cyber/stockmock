import Link from "next/link";
import { Target, ExternalLink } from "lucide-react";

const DHAN_REFERRAL_URL = "https://join.dhan.co/?invite=XDCAS95683";

const LINKS = [
  {
    heading: "Tools",
    items: [
      { label: "Strategy Builder", href: "/builder" },
      { label: "Option Chain", href: "/chain" },
      { label: "Backtesting", href: "/backtest" },
      { label: "OI Analysis", href: "/oi-analysis" },
      { label: "Screener", href: "/screener" },
      { label: "Simulator", href: "/simulator" },
      { label: "Paper Trading", href: "/paper-trade" },
    ],
  },
  {
    heading: "Strategies",
    items: [
      { label: "All Strategies", href: "/strategies" },
      { label: "Iron Condor — NIFTY", href: "/strategies/iron-condor-nifty" },
      { label: "Short Straddle — BANKNIFTY", href: "/strategies/short-straddle-banknifty" },
      { label: "NIFTY Weekly Expiry Guide", href: "/strategies/nifty-weekly-expiry-guide" },
      { label: "Bull Call Spread — NIFTY", href: "/strategies/bull-call-spread-nifty" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "Options Academy", href: "/learn" },
      { label: "What Are Options?", href: "/learn/what-are-options" },
      { label: "Option Greeks", href: "/learn/delta-gamma" },
      { label: "Theta Decay", href: "/learn/theta-decay" },
      { label: "Iron Condor Deep Dive", href: "/learn/iron-condor" },
      { label: "How to Backtest", href: "/learn/backtesting-guide" },
      { label: "India VIX Explained", href: "/learn/india-vix" },
    ],
  },
  {
    heading: "Broker Guides",
    items: [
      { label: "All Broker Guides", href: "/brokers" },
      { label: "Dhan Review 2025", href: "/brokers/dhan-review" },
      { label: "Dhan vs Zerodha", href: "/brokers/dhan-vs-zerodha" },
      { label: "Best Broker for F&O", href: "/brokers/best-broker-options-trading-india" },
      { label: "Lowest F&O Brokerage", href: "/brokers/lowest-brokerage-fno-india" },
      { label: "Open Dhan Account", href: "/brokers/how-to-open-dhan-account" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact Us", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#080C16] mt-20">
      {/* Dhan affiliate strip */}
      <div className="border-b border-indigo-500/10 bg-indigo-950/30 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-slate-400 text-center sm:text-left">
            Ready to trade live? Open a free Dhan account —{" "}
            <span className="text-slate-300">₹0 AMC lifetime · ₹20/order · Free Demat</span>
          </p>
          <a
            href={DHAN_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0"
          >
            Open Free Account <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-1">Referral partnership · We may earn a commission</p>
      </div>

      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-indigo-400" />
              <span className="text-base font-bold text-slate-100">OptionsGyani</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              India's free options analytics platform. Backtest strategies on 8+ years of real NSE data.
            </p>
            <p className="text-xs text-slate-600">
              Powered by real NSE Bhavcopy data.<br />
              Not SEBI registered. Educational use only.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-10 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <p className="text-orange-200/50 text-xs leading-relaxed text-center">
            <strong className="text-orange-200/70">Regulatory Disclaimer:</strong> OptionsGyani is a software tool designed strictly for educational, analytical, and backtesting purposes. We are an analytics provider,{" "}
            <strong className="text-orange-200/70">not SEBI registered Investment Advisors or Research Analysts.</strong> We do not provide trading tips, recommendations, or buy/sell signals. All data, calculations, and visualizations (including strategy payoffs, backtest results, and screeners) are based on historical and real-time data feeds and should not be construed as financial advice. Options trading involves significant risk and is not suitable for all investors. Past performance of any trading system or methodology is not necessarily indicative of future results. Please consult a qualified financial advisor before making any investment decisions.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} OptionsGyani Analytics. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/about" className="hover:text-slate-400 transition-colors">About</a>
            <a href="/contact" className="hover:text-slate-400 transition-colors">Contact</a>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="/refund" className="hover:text-slate-400 transition-colors">Refund Policy</a>
            <a href="/terms#risk" className="hover:text-slate-400 transition-colors">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

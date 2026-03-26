export const metadata = {
  title: "Options Backtesting Tool — NIFTY & BANKNIFTY | OptionsGyani",
  description: "Backtest Iron Condor, Short Straddle, Bull Call Spread, and 10+ NSE options strategies on 8+ years of real Bhavcopy data. Filter by IVP, expiry, day of week. Free, no signup needed.",
  alternates: { canonical: "https://optionsgyani.com/backtest" },
  openGraph: {
    title: "Free NSE Options Backtesting Tool — NIFTY & BANKNIFTY | OptionsGyani",
    description: "8+ years of real NSE data. Test any options strategy, see P&L, win rate, max drawdown. Free.",
    url: "https://optionsgyani.com/backtest",
  },
};

export default function BacktestLayout({ children }) {
  return children;
}

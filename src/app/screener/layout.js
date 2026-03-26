export const metadata = {
  title: "Options Screener — High IV, Low IV, Unusual OI | OptionsGyani",
  description: "Screen NSE stocks and indices for elevated IV, low IV buying opportunities, unusual Open Interest activity, and IV Percentile extremes. Find options trading setups across NIFTY, BANKNIFTY, and F&O stocks.",
  alternates: { canonical: "https://optionsgyani.com/screener" },
  openGraph: {
    title: "NSE Options Screener — IV, OI, Greeks | OptionsGyani",
    description: "Find high IV, low IV, and unusual OI setups across NSE F&O stocks. Free options screener.",
    url: "https://optionsgyani.com/screener",
  },
};

export default function ScreenerLayout({ children }) {
  return children;
}

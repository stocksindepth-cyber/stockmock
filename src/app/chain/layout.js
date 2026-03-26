export const metadata = {
  title: "Live NSE Option Chain — IV, Greeks, OI | OptionsGyani",
  description: "Live NIFTY and BANKNIFTY option chain with IV Percentile (IVP), IV Rank (IVR), Delta, Gamma, Theta, Vega, and real-time Open Interest. Free NSE option chain tool for Indian traders.",
  alternates: { canonical: "https://optionsgyani.com/chain" },
  openGraph: {
    title: "Live NSE Option Chain — IV Percentile, Greeks, OI | OptionsGyani",
    description: "Real-time NIFTY & BANKNIFTY option chain. IVP, IVR, all Greeks, Open Interest. Free.",
    url: "https://optionsgyani.com/chain",
  },
};

export default function ChainLayout({ children }) {
  return children;
}

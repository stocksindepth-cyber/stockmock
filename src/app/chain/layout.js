export const metadata = {
  title: "Live NSE Option Chain — IV, Greeks, OI | OptionsGyani",
  description: "Live NIFTY and BANKNIFTY option chain with IV Percentile (IVP), IV Rank (IVR), Delta, Gamma, Theta, Vega, and real-time Open Interest. Free NSE option chain tool for Indian traders.",
  alternates: { canonical: "https://www.optionsgyani.com/chain" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "Live NSE Option Chain — IV Percentile, Greeks, OI | OptionsGyani",
    description: "Real-time NIFTY & BANKNIFTY option chain. IVP, IVR, all Greeks, Open Interest. Free.",
    url: "https://www.optionsgyani.com/chain",
  },
};

export default function ChainLayout({ children }) {
  return children;
}

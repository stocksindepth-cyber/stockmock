export const metadata = {
  title: "Features — NSE Options Analytics Platform | OptionsGyani",
  description: "Explore every feature of OptionsGyani: historical backtesting on 8+ years of NSE Bhavcopy data, live option chain with IV Percentile, OI analysis, strategy builder, paper trading, IV alerts, and more.",
  alternates: { canonical: "https://www.optionsgyani.com/features" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "Features — NSE Options Analytics Platform | OptionsGyani",
    description: "8+ years of real NSE data. Live IV, Greeks, OI. Backtest any strategy in seconds. Free for Indian options traders.",
    url: "https://www.optionsgyani.com/features",
  },
};

export default function FeaturesLayout({ children }) {
  return children;
}

export const metadata = {
  title: "NSE Open Interest Analysis — OI Buildup & PCR | OptionsGyani",
  description: "Track NIFTY and BANKNIFTY Open Interest buildup, PCR (Put-Call Ratio), OI change by strike, and max pain levels. Identify support and resistance from real NSE options data.",
  alternates: { canonical: "https://optionsgyani.com/oi-analysis" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "NSE OI Analysis — Open Interest, PCR, Max Pain | OptionsGyani",
    description: "NIFTY & BANKNIFTY OI buildup, PCR, max pain. Real NSE data. Free for Indian options traders.",
    url: "https://optionsgyani.com/oi-analysis",
  },
};

export default function OIAnalysisLayout({ children }) {
  return children;
}

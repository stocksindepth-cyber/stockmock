import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "OptionsGyani | Free Options Strategy Builder & Backtesting Tool for NSE",
  description: "India's most powerful free options analytics platform. Build multi-leg strategies, backtest on 8+ years of real NSE data, analyze open interest, and paper trade risk-free. Used by NIFTY & BANKNIFTY traders.",
  keywords: "options strategy builder NSE, free option chain analyzer, options backtesting India, nifty weekly expiry strategy, iron condor nifty, short straddle banknifty, india vix options, options simulator with historical data, banknifty options strategy, nifty options tool",
  metadataBase: new URL("https://optionsgyani.in"),
  openGraph: {
    title: "OptionsGyani — Free Options Strategy Builder & Backtesting for NSE",
    description: "Build, backtest, and paper trade options strategies on NIFTY & BANKNIFTY. Real NSE data from 2016. Free.",
    url: "https://optionsgyani.in",
    siteName: "OptionsGyani",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OptionsGyani — NSE Options Analytics Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptionsGyani — Free NSE Options Backtesting & Strategy Builder",
    description: "Iron Condors, Short Straddles, Bull Spreads — backtested on 8 years of real NSE data. Free for Indian traders.",
    images: ["/og-image.png"],
    creator: "@OptionsGyani",
  },
  alternates: {
    canonical: "https://optionsgyani.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0B0F19] text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

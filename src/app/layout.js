import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "OptionsGyani | Advanced Options Strategy Builder & Backtesting Tool",
  description: "OptionsGyani is India's most powerful options analytics software. Build multi-leg strategies, run deep historical backtesting, analyze live open interest, and simulate trades risk-free. Stop guessing, start trading with data.",
  keywords: "options strategy builder NSE, free option chain analyzer, options backtesting India, automated straddle backtester, live PCR ratio Banknifty, options simulator with historical data, Nifty options tool, option pricing calculator",
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

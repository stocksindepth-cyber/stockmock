import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// next/font self-hosts Inter — zero render-blocking, automatic font-display:swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0f1e",
};

export const metadata = {
  title: "OptionsGyani — Free NSE Options Backtesting Tool",
  description: "Free options analytics for NSE traders. Backtest Iron Condor, Short Straddle, and 10+ strategies on 8+ years of real NIFTY & BANKNIFTY data. Live option chain with IV, Greeks, IVP/IVR.",
  keywords: "options backtesting India, free NSE options tool, iron condor nifty backtest, short straddle banknifty, option chain IV analysis, IV percentile IVP NIFTY, options strategy builder NSE, nifty weekly expiry strategy, india vix options, options simulator historical data, banknifty options analytics, free options analytics platform India",
  metadataBase: new URL("https://optionsgyani.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OptionsGyani",
  },
  openGraph: {
    title: "OptionsGyani — Free NSE Options Analytics & Backtesting Platform",
    description: "Backtest Iron Condor, Short Straddle, and 10+ strategies on 8+ years of real NIFTY & BANKNIFTY data. Live option chain, IVP/IVR, OI analysis. Free for Indian traders.",
    url: "https://optionsgyani.com",
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
    title: "OptionsGyani — Free NSE Options Backtesting & Analytics",
    description: "Iron Condor, Short Straddle, Bull Spread — backtested on 8 years of real NSE data. Live IV, Greeks, IVP/IVR. Free for Indian options traders.",
    images: ["/og-image.png"],
    creator: "@OptionsGyani",
  },
  alternates: {
    canonical: "https://optionsgyani.com",
    // LLMs.txt discovery
    types: {
      "text/plain": "https://optionsgyani.com/llms.txt",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Font preconnects removed — next/font handles Inter natively */}
        {/* LLMs.txt discovery — helps ChatGPT, Claude, Perplexity, Gemini find our content */}
        <link rel="ai-content" type="text/plain" href="https://optionsgyani.com/llms.txt" />
        {/* JSON-LD structured data for AI/LLM understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "OptionsGyani",
              "url": "https://optionsgyani.com",
              "logo": "https://optionsgyani.com/logo.png",
              "description": "India's free options analytics platform. Backtest Iron Condor, Short Straddle, and 10+ strategies on 8+ years of real NSE Bhavcopy data. Live option chain with IV Percentile, Greeks, OI analysis.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": [
                { "@type": "Offer", "name": "Free Plan", "price": "0", "priceCurrency": "INR" },
                { "@type": "Offer", "name": "Pro Plan", "price": "499", "priceCurrency": "INR", "billingPeriod": "P1M" }
              ],
              "featureList": [
                "Options backtesting on NSE historical data",
                "Live NIFTY BANKNIFTY option chain",
                "IV Percentile (IVP) and IV Rank (IVR)",
                "ATM Straddle Premium tracker",
                "Option Greeks: Delta, Gamma, Theta, Vega",
                "Open Interest and PCR analysis",
                "A/B strategy comparison",
                "Trade simulator with historical replay",
                "Paper trading with live NSE prices"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Indian options traders, NSE F&O traders, retail investors"
              },
              "inLanguage": "en-IN",
              "provider": {
                "@type": "Organization",
                "name": "OptionsGyani Analytics",
                "url": "https://optionsgyani.com",
                "email": "support@optionsgyani.com",
                "sameAs": ["https://optionsgyani.com"]
              }
            })
          }}
        />
      </head>
      <body className={`antialiased bg-[#0B0F19] text-slate-100 ${inter.className}`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>

        {/* Google Analytics 4 — tracks page views on every client-side navigation */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />

        {/* Microsoft Clarity — loads after page is interactive, never blocks render */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vzsdgibu91");`}
        </Script>

        {/* PWA service worker registration */}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}

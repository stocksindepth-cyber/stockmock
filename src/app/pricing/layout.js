export const metadata = {
  title: "Pricing — Free & Pro Plans | OptionsGyani",
  description: "Start free, upgrade when ready. OptionsGyani Free plan includes 5 backtests/day, live option chain, and IV analytics. Pro at ₹499/month unlocks unlimited backtests, IV alerts, A/B comparison, and priority data.",
  alternates: { canonical: "https://www.optionsgyani.com/pricing" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "Pricing — Free & Pro Plans | OptionsGyani",
    description: "Unlimited backtests, IV alerts, and full NSE options analytics for ₹499/month. Start free — no card required.",
    url: "https://www.optionsgyani.com/pricing",
  },
};

export default function PricingLayout({ children }) {
  return children;
}

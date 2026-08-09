export const metadata = {
  title: "Pricing — Free & Pro Plans | OptionsGyani",
  description: "OptionsGyani has no paid plans. Unlock Pro free by opening a Dhan account through us and placing your first trade — unlimited backtests, IV alerts, A/B comparison, full NSE data.",
  alternates: { canonical: "https://www.optionsgyani.com/pricing" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "Pricing — Free & Pro Plans | OptionsGyani",
    description: "Unlimited backtests, IV alerts, and full NSE options analytics — free via Dhan. No card, no subscription, ever.",
    url: "https://www.optionsgyani.com/pricing",
  },
};

export default function PricingLayout({ children }) {
  return children;
}

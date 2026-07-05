export const metadata = {
  title: "Paper Trading — Practice Options Without Real Money | OptionsGyani",
  description: "Practice options trading on NIFTY and BANKNIFTY without risking real capital. Track virtual P&L, test strategies in live market conditions, and build confidence before trading real money.",
  alternates: { canonical: "https://www.optionsgyani.com/paper-trade" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "NSE Options Paper Trading — Risk-Free Practice | OptionsGyani",
    description: "Practice NIFTY & BANKNIFTY options trading with virtual money. Live market prices, real Greeks, no risk.",
    url: "https://www.optionsgyani.com/paper-trade",
  },
};

export default function PaperTradeLayout({ children }) {
  return children;
}

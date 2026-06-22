export const metadata = {
  title: "Options P&L Simulator — What-If Scenarios | OptionsGyani",
  description: "Simulate how your options position behaves across price moves, time decay, and IV changes. Interactive P&L simulator for NIFTY and BANKNIFTY options — run what-if scenarios before placing real trades.",
  alternates: { canonical: "https://optionsgyani.com/simulator" },
  openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OptionsGyani — NSE Options Analytics" }],
    title: "NSE Options P&L Simulator — Price, Time & IV Scenarios | OptionsGyani",
    description: "Simulate options P&L across price moves, theta decay, and IV changes. Free for Indian traders.",
    url: "https://optionsgyani.com/simulator",
  },
};

export default function SimulatorLayout({ children }) {
  return children;
}

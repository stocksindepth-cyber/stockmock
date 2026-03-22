// Server component — provides metadata for the "use client" terms page
export const metadata = {
  title: "Terms of Service | OptionsGyani",
  description: "Terms of Service for OptionsGyani — the free NSE options analytics and backtesting platform.",
  alternates: { canonical: "https://optionsgyani.com/terms" },
};

export default function TermsLayout({ children }) {
  return children;
}

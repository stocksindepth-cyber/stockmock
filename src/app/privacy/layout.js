// Server component — provides metadata for the "use client" privacy page
export const metadata = {
  title: "Privacy Policy | OptionsGyani",
  description: "Privacy Policy for OptionsGyani — how we collect, use, and protect your data.",
  alternates: { canonical: "https://optionsgyani.com/privacy" },
};

export default function PrivacyLayout({ children }) {
  return children;
}

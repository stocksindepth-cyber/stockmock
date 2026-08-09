import Link from "next/link";

export const metadata = {
  alternates: { canonical: "https://www.optionsgyani.com/refund" },
  title: "Refund & Cancellation Policy | OptionsGyani",
  description: "OptionsGyani has no paid plans — nothing is for sale, so there is nothing to refund. Legacy purchases made before the free pivot are honored in full.",
};

const LAST_UPDATED = "10 August 2026";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Refund &amp; Cancellation Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* Summary box */}
          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-5 text-sm">
            <p className="font-semibold text-white mb-2">Summary (plain language)</p>
            <ul className="space-y-1.5 text-slate-300">
              <li>✅ <strong>Nothing is for sale:</strong> OptionsGyani has no paid plans. Every tier is free — Pro and Elite unlock at no cost via the Dhan referral program. Since you can&apos;t pay, there&apos;s nothing to refund or cancel.</li>
              <li>✅ <strong>Bought a plan in the past?</strong> Email <a href="mailto:support@optionsgyani.com" className="text-indigo-400 hover:underline">support@optionsgyani.com</a> and you&apos;ll be taken care of. Past purchases are honored in full.</li>
            </ul>
          </div>

          <Section title="1. No Paid Plans, Nothing to Refund">
            <p>
              OptionsGyani is built and operated by Rahul Dubey, an individual. As of August 2026 the platform sells
              nothing: there are no subscriptions, no one-time purchases, and no checkout anywhere on the site.
              Pro unlocks free for life when you open a Dhan account through the referral link and share a
              first-trade snapshot; Elite is free for actively-trading Dhan users. Because no money changes hands,
              no refund or cancellation can ever be required.
            </p>
          </Section>

          <Section title="2. Legacy Purchases (Before the Free Pivot)">
            <p>
              If you purchased a Pro or Elite subscription before paid plans were removed, your purchase is honored
              in full — your access remains active for the entire period you paid for, and nothing will auto-renew
              or charge you again. If anything about a past payment looks wrong (duplicate charge, access not
              matching what you paid for, or you simply feel you didn&apos;t get value), email{" "}
              <a href="mailto:support@optionsgyani.com" className="text-indigo-400 hover:underline">support@optionsgyani.com</a>{" "}
              with your registered email and Razorpay payment ID. Every request is read and resolved personally —
              legacy customers are looked after, no fine print.
            </p>
          </Section>

          <Section title="3. The Dhan Referral (Not a Purchase)">
            <p>
              Opening a Dhan account via our referral link is a relationship between you and Dhan, governed by
              Dhan&apos;s own terms. OptionsGyani may earn a referral commission — that commission funds the free
              tools. No money is ever paid to OptionsGyani by you, so nothing there is refundable either.
            </p>
          </Section>

          <Section title="4. Contact">
            <p>
              For anything related to past payments or this policy, contact the operator directly:
            </p>
            <div className="mt-3 bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm">
              <p className="text-white font-semibold">Rahul Dubey — OptionsGyani</p>
              <p className="text-slate-400 mt-1">Email: <a href="mailto:support@optionsgyani.com" className="text-indigo-400 hover:underline">support@optionsgyani.com</a></p>
              <p className="text-slate-400">Replies usually within 24 hours on business days</p>
            </div>
          </Section>

        </div>

        {/* Related links */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact</Link>
          <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors">Go Pro Free</Link>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-slate-400 space-y-2">{children}</div>
    </div>
  );
}

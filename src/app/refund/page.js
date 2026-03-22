import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | OptionsGyani",
  description: "OptionsGyani refund and cancellation policy for Pro and Elite subscription plans.",
};

const LAST_UPDATED = "22 March 2026";

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
              <li>✅ <strong>Free plan:</strong> Always free. No payment, no refund needed.</li>
              <li>✅ <strong>Cancellation:</strong> You can cancel your subscription anytime before the next billing cycle — no questions asked.</li>
              <li>❌ <strong>Refunds:</strong> We generally do not offer refunds for the current billing period. Please read below for exceptions.</li>
            </ul>
          </div>

          <Section title="1. Subscription Plans">
            <p>
              OptionsGyani offers subscription-based access to Pro and Elite plans, billed on a monthly or annual basis
              via Razorpay. All prices are in Indian Rupees (INR) and are exclusive of applicable GST (18%).
            </p>
          </Section>

          <Section title="2. Free Trial">
            <p>
              OptionsGyani does not offer a time-limited free trial. Instead, we offer a permanently free plan with
              access to core features including 5 backtests per day, live option chain, paper trading (10 trades/month),
              and the full Options Academy. We strongly encourage you to use the free plan thoroughly before upgrading
              to a paid subscription.
            </p>
          </Section>

          <Section title="3. Cancellation Policy">
            <p>You may cancel your subscription at any time by:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li>Visiting your profile/account settings page</li>
              <li>Emailing us at <a href="mailto:support@optionsgyani.in" className="text-indigo-400 hover:underline">support@optionsgyani.in</a> with your registered email address and subject line "Cancel Subscription"</li>
            </ul>
            <p className="mt-3">
              Upon cancellation, your paid access will remain active until the end of the current billing period.
              After that, your account will revert to the Free plan. No further charges will be made.
            </p>
            <p className="mt-3">
              For annual plans, cancellation stops the annual auto-renewal. You retain access for the full year paid for.
            </p>
          </Section>

          <Section title="4. Refund Policy">
            <p>
              All payments made to OptionsGyani are <strong className="text-white">non-refundable</strong> except in the
              circumstances listed below. This is because our service provides immediate access to digital content
              (historical data, backtesting results, platform features) upon payment.
            </p>

            <p className="mt-3 font-semibold text-white">Exceptions — Refunds will be considered in the following cases:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 mt-2">
              <li>
                <strong>Duplicate payment:</strong> If you were charged more than once for the same subscription
                period due to a technical error, we will refund the duplicate charge in full.
              </li>
              <li>
                <strong>Payment without plan activation:</strong> If your payment was successfully processed but
                your account was not upgraded within 24 hours, and our support team is unable to manually activate
                your plan, a full refund will be issued.
              </li>
              <li>
                <strong>Service unavailability:</strong> If the platform is entirely inaccessible for more than
                72 consecutive hours due to issues on our end (excluding scheduled maintenance), you may request
                a pro-rated refund for the affected period.
              </li>
            </ul>

            <p className="mt-3">
              Refund requests must be raised within <strong className="text-white">7 days</strong> of the payment date
              by emailing <a href="mailto:support@optionsgyani.in" className="text-indigo-400 hover:underline">support@optionsgyani.in</a> with
              your registered email, Razorpay payment ID, and reason for the refund request.
            </p>
          </Section>

          <Section title="5. Refund Processing Time">
            <p>
              Approved refunds are processed within <strong className="text-white">5–7 business days</strong> from
              the date of approval. The refunded amount will be credited to the original payment method (credit card,
              debit card, UPI, net banking, etc.) used at the time of purchase. OptionsGyani is not responsible for
              delays caused by your bank or payment processor.
            </p>
          </Section>

          <Section title="6. Chargebacks">
            <p>
              We encourage you to contact us at <a href="mailto:support@optionsgyani.in" className="text-indigo-400 hover:underline">support@optionsgyani.in</a>{" "}
              before initiating a chargeback with your bank. Initiating an unjustified chargeback may result in
              immediate suspension of your account and may be subject to dispute resolution under applicable law.
            </p>
          </Section>

          <Section title="7. Changes to This Policy">
            <p>
              We reserve the right to update this Refund &amp; Cancellation Policy at any time. Material changes will
              be communicated via email to registered users or via a notice on the platform. Continued use of the
              service after such changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="8. Contact Us">
            <p>
              For all refund and cancellation requests or queries, please contact us at:
            </p>
            <div className="mt-3 bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm">
              <p className="text-white font-semibold">OptionsGyani Analytics</p>
              <p className="text-slate-400 mt-1">Email: <a href="mailto:support@optionsgyani.in" className="text-indigo-400 hover:underline">support@optionsgyani.in</a></p>
              <p className="text-slate-400">Support hours: Monday–Friday, 10:00 AM – 6:00 PM IST</p>
            </div>
          </Section>

        </div>

        {/* Related links */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact Us</Link>
          <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors">Pricing</Link>
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

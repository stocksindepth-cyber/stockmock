import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";

export const metadata = {
  alternates: { canonical: "https://optionsgyani.com/contact" },
  title: "Contact Us | OptionsGyani",
  description: "Get in touch with the OptionsGyani team for support, feedback, or partnership enquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Contact Us</h1>
          <p className="text-slate-400 text-lg">We're a small team and we read every message. Usually reply within 24 hours on business days.</p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Email Support</h3>
            <p className="text-slate-500 text-sm mb-3">For account issues, billing queries, and technical support.</p>
            <a
              href="mailto:support@optionsgyani.com"
              className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors"
            >
              support@optionsgyani.com
            </a>
          </div>

          <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Business & Partnerships</h3>
            <p className="text-slate-500 text-sm mb-3">For partnership, collaboration, or press enquiries.</p>
            <a
              href="mailto:hello@optionsgyani.com"
              className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors"
            >
              hello@optionsgyani.com
            </a>
          </div>

          <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Support Hours</h3>
            <p className="text-slate-500 text-sm mb-1">Monday – Friday: 10:00 AM – 6:00 PM IST</p>
            <p className="text-slate-500 text-sm">Saturday: 10:00 AM – 1:00 PM IST</p>
            <p className="text-slate-600 text-xs mt-2">Closed on NSE market holidays</p>
          </div>

          <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Registered Address</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              OptionsGyani Analytics<br />
              India<br />
              CIN: (Pending incorporation)
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-sm text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">Before emailing support, please check:</p>
          <ul className="list-disc list-outside ml-4 space-y-1 mt-2">
            <li>For billing or payment issues, include your registered email address and Razorpay payment ID (if available).</li>
            <li>For plan activation delays, please allow up to 20 minutes after payment before contacting us.</li>
            <li>For data or backtest queries, mention the underlying (NIFTY / BANKNIFTY etc.) and date range.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-700 mt-8">
          OptionsGyani is not SEBI registered. We do not provide investment advice. Please consult a SEBI-registered advisor for financial decisions.
        </p>

      </div>
    </div>
  );
}

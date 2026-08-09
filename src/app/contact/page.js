import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";

export const metadata = {
  alternates: { canonical: "https://www.optionsgyani.com/contact" },
  title: "Contact | OptionsGyani",
  description: "OptionsGyani is run by one person — Rahul Dubey. Email him directly for support, feedback, or collaborations.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080C16] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Contact</h1>
          <p className="text-slate-400 text-lg">
            OptionsGyani is built and run by one person — Rahul Dubey. There&apos;s no support department:
            when you email, he&apos;s the one who reads it and replies, usually within 24 hours on business days.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-[#0C1221] border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Email the Founder</h3>
            <p className="text-slate-500 text-sm mb-3">For account issues, Pro unlock questions, bugs, and anything technical.</p>
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
            <p className="text-slate-500 text-sm mb-3">For collaborations, press, or anything else — email me directly, or find me on LinkedIn.</p>
            <a
              href="mailto:hello@optionsgyani.com"
              className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors"
            >
              hello@optionsgyani.com
            </a>
            <br />
            <a
              href="https://www.linkedin.com/in/rahuldubeyui/"
              target="_blank"
              rel="me noopener"
              className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors"
            >
              linkedin.com/in/rahuldubeyui
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
            <h3 className="text-white font-semibold mb-1">Based In</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bangalore, Karnataka<br />
              India
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-sm text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">To help me reply faster, please include:</p>
          <ul className="list-disc list-outside ml-4 space-y-1 mt-2">
            <li>For Pro unlock (Dhan referral) queries, your registered email and Dhan Client ID.</li>
            <li>For a legacy payment made before paid plans were removed, your registered email and Razorpay payment ID (if available).</li>
            <li>For data or backtest queries, the underlying (NIFTY / BANKNIFTY etc.) and date range.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-700 mt-8">
          OptionsGyani is educational analytics, operated by an individual. Not SEBI registered — no investment advice, tips, or signals. Please consult a SEBI-registered advisor for financial decisions.
        </p>

      </div>
    </div>
  );
}

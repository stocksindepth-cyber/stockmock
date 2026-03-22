"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "March 21, 2025";
  return (
    <div className="min-h-screen bg-[#080C16]">
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="flex items-center gap-3 mb-3">
          <Lock className="w-7 h-7 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-slate-500 text-sm mb-12">Last updated: {lastUpdated}</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use OptionsGyani, we collect the following information:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Account Info:</strong> Name, email address, profile picture (via Google Sign-In)</li>
              <li><strong className="text-slate-300">Usage Data:</strong> Pages visited, features used, number of backtests run, timestamps of sessions</li>
              <li><strong className="text-slate-300">Subscription Data:</strong> Plan type, payment history (stored by Razorpay, not us)</li>
              <li><strong className="text-slate-300">Device Info:</strong> Browser type, operating system, IP address for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>To provide and improve the OptionsGyani service</li>
              <li>To manage your account and subscription plan</li>
              <li>To enforce free-tier daily usage limits</li>
              <li>To send important service updates (not marketing spam)</li>
              <li>To prevent fraud and secure our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage & Security</h2>
            <p className="mb-3">Your data is stored securely using <strong className="text-white">Google Firebase</strong> (Firestore) with the following protections:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>All data is stored on Google Cloud servers (asia-south1, Mumbai region)</li>
              <li>Firebase Security Rules restrict data access to authenticated users only</li>
              <li>HTTPS/TLS encryption for all data in transit</li>
              <li>We do not store credit card or payment information — this is handled by Razorpay PCI-DSS compliant infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following trusted third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Google Firebase:</strong> Authentication and database</li>
              <li><strong className="text-slate-300">Razorpay:</strong> Payment processing (subject to Razorpay's Privacy Policy)</li>
              <li><strong className="text-slate-300">Google Analytics:</strong> Anonymized usage analytics</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to any third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>We use session cookies to keep you logged in across browser sessions. These are stored in your browser's local storage via Firebase Authentication. You can clear these at any time by logging out or clearing browser storage. We do not use marketing or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-slate-300">Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong className="text-slate-300">Correction:</strong> Update your profile information at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:support@optionsgyani.com" className="text-blue-400 hover:underline">support@optionsgyani.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy occasionally. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
            <p>For privacy-related concerns or data requests, contact <a href="mailto:support@optionsgyani.com" className="text-blue-400 hover:underline">support@optionsgyani.com</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

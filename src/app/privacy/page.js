"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "August 10, 2026";
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
            <h2 className="text-xl font-semibold text-white mb-3">1. Who Operates This & What Is Collected</h2>
            <p className="mb-3">OptionsGyani is operated by <strong className="text-white">Rahul Dubey, an individual based in India</strong> — he is the data controller for the information described below. There is no company, no sales team, and no data-sharing business behind this platform. When you use OptionsGyani, the following information is collected:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Account Info:</strong> Name, email address, profile picture (via Google Sign-In / Firebase Authentication)</li>
              <li><strong className="text-slate-300">Usage Data:</strong> Pages visited, features used, number of backtests run, timestamps of sessions (stored in Firestore)</li>
              <li><strong className="text-slate-300">Plan Tier:</strong> Which free tier you are on (Free / Pro / Elite — all free). Legacy payment history from before paid plans were removed is stored by Razorpay, not here.</li>
              <li><strong className="text-slate-300">Device Info:</strong> Browser type, operating system, IP address for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>To provide and improve the OptionsGyani service</li>
              <li>To manage your account and plan tier (all tiers are free)</li>
              <li>To enforce free-tier daily usage limits</li>
              <li>To send important service updates (not marketing spam)</li>
              <li>To send transactional and occasional product emails (every one has an unsubscribe path — email support@optionsgyani.com or use your profile settings)</li>
              <li>To prevent fraud and keep the platform secure</li>
            </ul>
            <p className="mt-3">Your data is never sold, and there are no ads on this platform.</p>
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
            <p className="mb-3">The platform relies on the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Google Firebase:</strong> Authentication and database (Firestore)</li>
              <li><strong className="text-slate-300">Vercel:</strong> Website hosting</li>
              <li><strong className="text-slate-300">Resend:</strong> Transactional email delivery (welcome emails, alerts, service updates)</li>
              <li><strong className="text-slate-300">Google Analytics &amp; Microsoft Clarity:</strong> Anonymized usage analytics and session insights, used to improve the product</li>
              <li><strong className="text-slate-300">Razorpay:</strong> Processed payments for legacy paid plans only (there are no paid plans today); subject to Razorpay&apos;s Privacy Policy</li>
            </ul>
            <p className="mt-3">Your personal data is never sold to any third party.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>We use session cookies to keep you logged in across browser sessions. These are stored in your browser's local storage via Firebase Authentication. You can clear these at any time by logging out or clearing browser storage. We do not use marketing or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li><strong className="text-slate-300">Access:</strong> Request a copy of the personal data held about you</li>
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
            <p>For privacy-related concerns or data requests, email the operator directly at <a href="mailto:support@optionsgyani.com" className="text-blue-400 hover:underline">support@optionsgyani.com</a> — messages are read and answered personally.</p>
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

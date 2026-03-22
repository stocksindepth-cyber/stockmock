"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "March 21, 2025";
  return (
    <div className="min-h-screen bg-[#080C16]">
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-7 h-7 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>
        <p className="text-slate-500 text-sm mb-12">Last updated: {lastUpdated}</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using OptionsGyani ("Service", "Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. OptionsGyani is operated as a sole proprietorship business in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Not Financial Advice</h2>
            <p className="mb-3">OptionsGyani is strictly an <strong className="text-white">educational software tool</strong> for backtesting and simulating options strategies. The platform does NOT provide:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>Financial advice, investment recommendations, or trading tips</li>
              <li>Market forecasts or predictions of any kind</li>
              <li>SEBI-registered Research Analyst (RA) services</li>
            </ul>
            <p className="mt-3">All backtesting results are simulated and based on historical data. Past performance is not indicative of future results. Trading in F&O derivatives carries substantial risk of loss. Please consult a SEBI-registered financial advisor before making any investment decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Subscription & Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>Payments are processed securely via Razorpay. All prices are in Indian Rupees (INR) and are inclusive of applicable GST.</li>
              <li>Subscriptions are <strong className="text-white">non-refundable</strong> once activated. Please use the free tier to evaluate the platform before subscribing.</li>
              <li>Plans activate within minutes of successful payment. In rare cases, activation may take up to 24 hours.</li>
              <li>OptionsGyani reserves the right to modify pricing with 30 days notice to existing subscribers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>One account per person. Sharing accounts or credentials is not permitted.</li>
              <li>We reserve the right to suspend accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
              <li>Scrape, crawl, or systematically extract data from the platform via automated means</li>
              <li>Reverse engineer, decompile, or disassemble the software</li>
              <li>Use the platform for any unlawful purpose or in violation of SEBI regulations</li>
              <li>Share, sell, or redistribute your account access to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data & Analytics</h2>
            <p>Options data sourced within the platform is based on publicly available NSE data and simulated models. While we strive for accuracy, we do not guarantee the completeness or accuracy of any data displayed. The platform's backtesting engine uses mathematical models (Black-Scholes) which are theoretical approximations, not exact market conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>OptionsGyani and its operators shall not be liable for any trading losses, financial damages, or indirect losses arising from the use of this platform. Your use of OptionsGyani is entirely at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>For any queries, write to us at <a href="mailto:support@optionsgyani.com" className="text-blue-400 hover:underline">support@optionsgyani.com</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { CalendarDays, Info, ArrowRight } from "lucide-react";
import UpcomingExpiries from "@/components/UpcomingExpiries";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export const metadata = {
  title: "NIFTY Expiry Day 2026 — Weekly (Tuesday) & Monthly Dates | OptionsGyani",
  description: "NIFTY & BANK NIFTY expiry days for 2026. NIFTY weekly options expire every Tuesday; BANK NIFTY, FINNIFTY & MIDCPNIFTY are monthly-only (last Tuesday). Full 2026 monthly expiry calendar.",
  keywords: "nifty expiry day 2026, nifty expiry date, nifty tuesday expiry, bank nifty expiry 2026, banknifty monthly expiry, nifty weekly expiry day, when does nifty expire",
  alternates: { canonical: "https://www.optionsgyani.com/nifty-expiry-day-2026" },
  openGraph: {
    title: "NIFTY Expiry Day 2026 — Weekly (Tuesday) & Monthly Dates | OptionsGyani",
    description: "NIFTY weekly expiry is now Tuesday. BANK NIFTY is monthly-only. Full 2026 calendar.",
    url: "https://www.optionsgyani.com/nifty-expiry-day-2026",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NIFTY Expiry Day 2026" }],
    type: "article",
  },
};

// Last Tuesday of each month in 2026 → monthly expiry for index derivatives.
// (Holiday shifts to the previous trading day are noted below.)
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function lastTuesday(year, monthIdx) {
  const d = new Date(Date.UTC(year, monthIdx + 1, 0)); // last day of month
  while (d.getUTCDay() !== 2) d.setUTCDate(d.getUTCDate() - 1); // 2 = Tuesday
  return d;
}
const MONTHLY_2026 = MONTHS.map((m, i) => {
  const d = lastTuesday(2026, i);
  return { month: m, date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) };
});

const FAQ = [
  { q: "What day does NIFTY expire in 2026?", a: "NIFTY weekly options expire every Tuesday in 2026. NSE moved the NIFTY weekly expiry from Thursday to Tuesday on 1 September 2025. If a Tuesday is a trading holiday, that week's expiry shifts to the previous trading day (usually Monday)." },
  { q: "What day does BANK NIFTY expire now?", a: "BANK NIFTY no longer has weekly options. It trades monthly-only contracts that expire on the last Tuesday of each month. The same applies to FINNIFTY and MIDCPNIFTY — all are monthly-only since 2025." },
  { q: "Why did NIFTY expiry change from Thursday to Tuesday?", a: "SEBI directed exchanges to limit weekly expiry to a single benchmark index each and to spread expiries across the week, reducing expiry-day speculation that was hurting retail traders. NSE assigned the weekly to NIFTY and set its day to Tuesday; BSE runs its weekly (Sensex) on a different day." },
  { q: "What happens if expiry Tuesday is a holiday?", a: "The expiry moves to the immediately preceding trading day. For example, if a monthly last-Tuesday is a holiday, the monthly contract settles on the Monday before. Always confirm against the live upcoming dates shown above, which come straight from NSE." },
];

export default function NiftyExpiry2026Page() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <CalendarDays size={14} /> Updated for the Tuesday expiry cycle
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">NIFTY Expiry Day 2026 — Weekly &amp; Monthly Dates</h1>
        <p className="text-slate-400 max-w-2xl mb-6">
          Since 1 September 2025, <strong className="text-slate-200">NIFTY weekly options expire every Tuesday</strong> (previously Thursday). <strong className="text-slate-200">BANK NIFTY, FINNIFTY and MIDCPNIFTY are now monthly-only</strong>, expiring on the last Tuesday of the month. Here are the live upcoming dates and the full 2026 monthly calendar.
        </p>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Upcoming NIFTY weekly expiries (live from NSE)</h2>
          <UpcomingExpiries symbol="NIFTY" />
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 max-w-2xl">
          <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200/90">If an expiry Tuesday is a trading holiday, the expiry shifts to the previous trading day. The live dates above are always holiday-adjusted.</p>
        </div>
      </section>

      {/* Monthly calendar */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">2026 Monthly Expiry Calendar</h2>
        <p className="text-sm text-slate-400 mb-6">Last Tuesday of each month — the monthly expiry for BANK NIFTY, FINNIFTY, MIDCPNIFTY and the NIFTY monthly contract. Subject to holiday shifts.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MONTHLY_2026.map((m) => (
            <div key={m.month} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3">
              <span className="text-slate-400">{m.month} 2026</span>
              <span className="font-semibold text-white tabular-nums">{m.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Expiry rules at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/5 text-slate-300 text-left">
                <th className="px-4 py-3 font-semibold">Index</th>
                <th className="px-4 py-3 font-semibold">Weekly?</th>
                <th className="px-4 py-3 font-semibold">Expiry Day</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                ["NIFTY 50", "Yes", "Every Tuesday"],
                ["BANK NIFTY", "No (monthly only)", "Last Tuesday of month"],
                ["FIN NIFTY", "No (monthly only)", "Last Tuesday of month"],
                ["MIDCP NIFTY", "No (monthly only)", "Last Tuesday of month"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-white/10">
                  <td className="px-4 py-3 font-medium text-white">{r[0]}</td>
                  <td className="px-4 py-3">{r[1]}</td>
                  <td className="px-4 py-3">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/nifty-option-chain", t: "NIFTY Option Chain" },
            { href: "/bank-nifty-option-chain", t: "BANK NIFTY Option Chain" },
            { href: "/learn/nifty-expiry-day-strategy", t: "Guide: Expiry-Day Strategy" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500/50 hover:text-white transition">
              {l.t} <ArrowRight size={14} className="text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">NIFTY expiry 2026 — FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

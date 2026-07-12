import Link from "next/link";
import { TrendingUp, TrendingDown, Database, Info } from "lucide-react";
import DhanReferralBanner from "@/components/DhanReferralBanner";
import { runQuery, DATASET, PROJECT_ID, isBigQueryConfigured } from "@/lib/bigquery/client";

// Server-rendered so the real numbers are in the HTML (SEO + AEO). Refreshed
// every 30 min; underlying data updates once a day post-market.
export const revalidate = 1800;

export const metadata = {
  title: "FII DII Data Today — Live NSE Cash Activity (Buy, Sell, Net) | OptionsGyani",
  description: "FII and DII trading activity for the latest NSE session — buy, sell and net cash figures in ₹ crore, with recent history. Updated daily post-market. Free.",
  keywords: "fii dii data, fii dii data today, fii dii activity, fii dii net, fii buying selling, dii data nse, fii dii cash market",
  alternates: { canonical: "https://www.optionsgyani.com/fii-dii-data" },
  openGraph: {
    title: "FII DII Data Today — Live NSE Cash Activity | OptionsGyani",
    description: "FII & DII buy, sell and net cash figures (₹ crore) for the latest NSE session, updated daily. Free.",
    url: "https://www.optionsgyani.com/fii-dii-data",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FII DII Data — OptionsGyani" }],
    type: "website",
  },
};

const T = `\`${PROJECT_ID}.${DATASET}.fii_dii_activity\``;
const dv = (v) => (v?.value ? v.value : v);
const cr = (n) => (Number.isFinite(n) ? `₹${Math.round(n).toLocaleString("en-IN")} cr` : "—");
const fmtDate = (s) => { try { return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return s; } };

async function getData() {
  if (!isBigQueryConfigured()) return { latest: null, history: [] };
  try {
    const rows = await runQuery(`
      SELECT trade_date,
        MAX(IF(category='FII/FPI', net_value, NULL)) AS fii_net,
        MAX(IF(category='FII/FPI', buy_value, NULL)) AS fii_buy,
        MAX(IF(category='FII/FPI', sell_value, NULL)) AS fii_sell,
        MAX(IF(category='DII', net_value, NULL)) AS dii_net,
        MAX(IF(category='DII', buy_value, NULL)) AS dii_buy,
        MAX(IF(category='DII', sell_value, NULL)) AS dii_sell
      FROM ${T} GROUP BY trade_date ORDER BY trade_date DESC LIMIT 60
    `);
    const history = rows.map((r) => ({
      date: dv(r.trade_date),
      fiiNet: r.fii_net, fiiBuy: r.fii_buy, fiiSell: r.fii_sell,
      diiNet: r.dii_net, diiBuy: r.dii_buy, diiSell: r.dii_sell,
    }));
    return { latest: history[0] || null, history };
  } catch {
    return { latest: null, history: [] };
  }
}

function NetCard({ label, value }) {
  const up = (value ?? 0) >= 0;
  return (
    <div className={`rounded-2xl border p-5 ${up ? "bg-emerald-500/10 border-emerald-500/25" : "bg-red-500/10 border-red-500/25"}`}>
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label} — Net</div>
      <div className={`text-2xl font-bold tabular-nums flex items-center gap-2 ${up ? "text-emerald-400" : "text-red-400"}`}>
        {up ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        {value == null ? "—" : `${up ? "+" : ""}${cr(value)}`}
      </div>
      <div className="text-[11px] text-slate-500 mt-1">{up ? "Net buyers" : "Net sellers"} in the cash market</div>
    </div>
  );
}

const FAQ = [
  { q: "What is FII and DII data?", a: "FII (Foreign Institutional Investors, also called FPI) and DII (Domestic Institutional Investors like mutual funds and insurers) are the large institutions that move the Indian market. Their daily buy, sell and net cash-market figures — published by NSE after each session in ₹ crore — show which side big money leaned that day." },
  { q: "What does FII/DII net positive or negative mean?", a: "A positive net means the group bought more than it sold that day (net buyers); negative means it sold more than it bought (net sellers). Many traders watch whether FIIs and DIIs are on the same side or opposing each other as a gauge of sentiment — it is context, not a trading signal." },
  { q: "How often is this FII/DII data updated?", a: "NSE publishes provisional FII/DII cash figures after market close on each trading day. This page ingests them automatically every evening and shows the latest session plus recent history." },
  { q: "Is FII/DII data a buy or sell signal?", a: "No. It is descriptive market data for education and context, not investment advice. Institutional flows can persist or reverse quickly, and the daily figures are provisional. Always do your own analysis — and if you trade options around these flows, backtest your strategy first." },
];

export default async function FiiDiiDataPage() {
  const { latest, history } = await getData();
  const combined = latest ? (latest.fiiNet ?? 0) + (latest.diiNet ?? 0) : null;

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }) }} />

      <section className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-3">
          <Database size={14} /> Live NSE Data · Updated Daily
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">FII DII Data Today</h1>
        {latest ? (
          <p className="text-slate-400 mb-8">
            Foreign (FII/FPI) and domestic (DII) institutional cash-market activity for the NSE session on{" "}
            <strong className="text-slate-200">{fmtDate(latest.date)}</strong>, in ₹ crore.
          </p>
        ) : (
          <p className="text-slate-400 mb-8">Latest FII/DII cash-market activity from NSE. Data refreshes every evening after market close.</p>
        )}

        {latest && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <NetCard label="FII / FPI" value={latest.fiiNet} />
              <NetCard label="DII" value={latest.diiNet} />
              <NetCard label="FII + DII" value={combined} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="text-slate-300 font-semibold mb-2">FII / FPI (cash)</div>
                <div className="flex justify-between text-slate-400"><span>Buy</span><span className="tabular-nums text-slate-200">{cr(latest.fiiBuy)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Sell</span><span className="tabular-nums text-slate-200">{cr(latest.fiiSell)}</span></div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="text-slate-300 font-semibold mb-2">DII (cash)</div>
                <div className="flex justify-between text-slate-400"><span>Buy</span><span className="tabular-nums text-slate-200">{cr(latest.diiBuy)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Sell</span><span className="tabular-nums text-slate-200">{cr(latest.diiSell)}</span></div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* History table */}
      {history.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">FII/DII activity — recent history</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-2.5">Date</th>
                  <th className="text-right px-4 py-2.5">FII Net</th>
                  <th className="text-right px-4 py-2.5">DII Net</th>
                  <th className="text-right px-4 py-2.5 hidden sm:table-cell">FII+DII</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => {
                  const comb = (r.fiiNet ?? 0) + (r.diiNet ?? 0);
                  const cls = (n) => (n >= 0 ? "text-emerald-400" : "text-red-400");
                  return (
                    <tr key={r.date} className="border-t border-white/5">
                      <td className="px-4 py-2.5 text-slate-300">{fmtDate(r.date)}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums ${cls(r.fiiNet ?? 0)}`}>{r.fiiNet == null ? "—" : cr(r.fiiNet)}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums ${cls(r.diiNet ?? 0)}`}>{r.diiNet == null ? "—" : cr(r.diiNet)}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums hidden sm:table-cell ${cls(comb)}`}>{cr(comb)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
            <Info size={12} /> Provisional NSE figures in ₹ crore. History grows daily as new sessions are ingested.
          </p>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">FII/DII Data — FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
              <h3 className="font-semibold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/nifty-option-chain" className="text-indigo-400 hover:text-indigo-300">NIFTY Option Chain →</Link>
          <Link href="/options-profit-calculator" className="text-indigo-400 hover:text-indigo-300">Options Profit Calculator →</Link>
          <Link href="/backtest" className="text-indigo-400 hover:text-indigo-300">Backtest a strategy →</Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16"><DhanReferralBanner /></section>
    </main>
  );
}

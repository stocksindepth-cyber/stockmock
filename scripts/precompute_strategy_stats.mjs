/**
 * Pre-computes real historical performance for each options strategy from the
 * NSE options history in BigQuery, and writes src/data/strategyStats.json.
 *
 * Why precompute: the Strategy Finder must be SERVER-RENDERED with real numbers
 * (a client-side widget over an empty page is exactly why the per-stock pages
 * failed to index). Precomputing also keeps per-visit BigQuery cost at zero.
 *
 * Every strategy is evaluated by ONE validated formula:
 *   netCredit  = Σ sign * premium_at_entry     (sign: SELL +1, BUY -1)
 *   intrinsic  = Σ sign * intrinsic_at_expiry
 *   P&L        = netCredit - intrinsic
 * Verified against a hand-checked short straddle (402 trades, 60.7% win rate).
 *
 * Run: GOOGLE_APPLICATION_CREDENTIALS=... node scripts/precompute_strategy_stats.mjs
 */
import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";

const bq = new BigQuery({ projectId: "optionsindepth" });
const T = "`optionsindepth.optionsgyani.options_eod`";
const S = "`optionsindepth.optionsgyani.spot_prices`";
const FROM_DATE = "2018-01-01";
const ENTRY_DAYS_BEFORE = 4; // enter ~4 calendar days before expiry

const UNDERLYINGS = {
  NIFTY:     { lot: 75, interval: 50 },
  BANKNIFTY: { lot: 30, interval: 100 },
};

// offset = strikes away from ATM (+ = higher strike). action: SELL | BUY
const STRATEGIES = [
  { id: "short-straddle", name: "Short Straddle", view: "neutral", risk: "high",
    desc: "Sell the ATM call and put. Profits when the index sits still and premium decays.",
    legs: [{ t: "CE", a: "SELL", o: 0 }, { t: "PE", a: "SELL", o: 0 }] },
  { id: "short-strangle", name: "Short Strangle", view: "neutral", risk: "high",
    desc: "Sell an OTM call and an OTM put. Wider breakevens than a straddle, smaller credit.",
    legs: [{ t: "CE", a: "SELL", o: 2 }, { t: "PE", a: "SELL", o: -2 }] },
  { id: "iron-condor", name: "Iron Condor", view: "neutral", risk: "defined",
    desc: "Short strangle with protective wings. Defined maximum loss.",
    legs: [{ t: "CE", a: "SELL", o: 2 }, { t: "CE", a: "BUY", o: 4 },
           { t: "PE", a: "SELL", o: -2 }, { t: "PE", a: "BUY", o: -4 }] },
  { id: "iron-butterfly", name: "Iron Butterfly", view: "neutral", risk: "defined",
    desc: "Short ATM straddle with wings. Bigger credit than a condor, narrower profit zone.",
    legs: [{ t: "CE", a: "SELL", o: 0 }, { t: "PE", a: "SELL", o: 0 },
           { t: "CE", a: "BUY", o: 4 }, { t: "PE", a: "BUY", o: -4 }] },
  { id: "long-straddle", name: "Long Straddle", view: "volatile", risk: "defined",
    desc: "Buy the ATM call and put. Needs a big move either way to pay off.",
    legs: [{ t: "CE", a: "BUY", o: 0 }, { t: "PE", a: "BUY", o: 0 }] },
  { id: "long-strangle", name: "Long Strangle", view: "volatile", risk: "defined",
    desc: "Buy an OTM call and put. Cheaper than a straddle, needs a bigger move.",
    legs: [{ t: "CE", a: "BUY", o: 2 }, { t: "PE", a: "BUY", o: -2 }] },
  { id: "bull-call-spread", name: "Bull Call Spread", view: "bullish", risk: "defined",
    desc: "Buy an ATM call, sell a higher call. Capped profit, capped loss.",
    legs: [{ t: "CE", a: "BUY", o: 0 }, { t: "CE", a: "SELL", o: 4 }] },
  { id: "bull-put-spread", name: "Bull Put Spread", view: "bullish", risk: "defined",
    desc: "Sell an OTM put, buy a lower put. Collects credit while the index holds up.",
    legs: [{ t: "PE", a: "SELL", o: -2 }, { t: "PE", a: "BUY", o: -4 }] },
  { id: "bear-put-spread", name: "Bear Put Spread", view: "bearish", risk: "defined",
    desc: "Buy an ATM put, sell a lower put. Capped profit, capped loss.",
    legs: [{ t: "PE", a: "BUY", o: 0 }, { t: "PE", a: "SELL", o: -4 }] },
  { id: "bear-call-spread", name: "Bear Call Spread", view: "bearish", risk: "defined",
    desc: "Sell an OTM call, buy a higher call. Collects credit while the index stays capped.",
    legs: [{ t: "CE", a: "SELL", o: 2 }, { t: "CE", a: "BUY", o: 4 }] },
];

function buildSql(sym, cfg, legs) {
  // one row per leg, joined back to the ATM strike for that expiry
  const legRows = legs.map((l, i) =>
    `SELECT ${i} AS leg, '${l.t}' AS opt_type, ${l.a === "SELL" ? 1 : -1} AS sign, ${l.o} AS off`
  ).join(" UNION ALL ");

  return `
WITH expiries AS (
  SELECT DISTINCT expiry_date FROM ${T}
  WHERE underlying=@sym AND expiry_date BETWEEN @from AND CURRENT_DATE()
),
entry AS (
  SELECT e.expiry_date, MAX(o.trade_date) AS entry_date
  FROM expiries e JOIN ${T} o
    ON o.underlying=@sym AND o.expiry_date=e.expiry_date
   AND o.trade_date <= DATE_SUB(e.expiry_date, INTERVAL ${ENTRY_DAYS_BEFORE} DAY)
  GROUP BY e.expiry_date
),
strikes AS (SELECT DISTINCT expiry_date, trade_date, strike FROM ${T} WHERE underlying=@sym),
atm AS (
  SELECT * EXCEPT(rn) FROM (
    SELECT en.expiry_date, en.entry_date, s.close AS entry_spot, k.strike AS atm_k,
      ROW_NUMBER() OVER (PARTITION BY en.expiry_date ORDER BY ABS(k.strike - s.close)) rn
    FROM entry en
    JOIN ${S} s ON s.underlying=@sym AND s.trade_date=en.entry_date
    JOIN strikes k ON k.expiry_date=en.expiry_date AND k.trade_date=en.entry_date
  ) WHERE rn=1
),
legs AS (${legRows}),
filled AS (  -- every leg must have a real quote, else drop the whole trade
  SELECT a.expiry_date, a.entry_date, a.entry_spot, a.atm_k,
         l.leg, l.sign, l.opt_type, a.atm_k + l.off*${cfg.interval} AS k, o.close AS prem
  FROM atm a CROSS JOIN legs l
  JOIN ${T} o ON o.underlying=@sym AND o.expiry_date=a.expiry_date
             AND o.trade_date=a.entry_date AND o.option_type=l.opt_type
             AND o.strike = a.atm_k + l.off*${cfg.interval}
  WHERE o.close > 0
),
complete AS (
  SELECT expiry_date FROM filled GROUP BY expiry_date HAVING COUNT(*) = ${legs.length}
),
trade AS (
  SELECT f.expiry_date, ANY_VALUE(f.entry_spot) entry_spot,
         SUM(f.sign * f.prem) AS net_credit,
         SUM(f.sign * CASE WHEN f.opt_type='CE' THEN GREATEST(sp.close - f.k, 0)
                                                ELSE GREATEST(f.k - sp.close, 0) END) AS intrinsic,
         ANY_VALUE(sp.close) AS exp_spot
  FROM filled f
  JOIN complete c ON c.expiry_date=f.expiry_date
  JOIN ${S} sp ON sp.underlying=@sym AND sp.trade_date=f.expiry_date
  GROUP BY f.expiry_date
),
pnl AS (SELECT *, (net_credit - intrinsic) * ${cfg.lot} AS pl FROM trade)
SELECT COUNT(*) trades,
       ROUND(100*COUNTIF(pl>0)/COUNT(*),1) win_rate,
       ROUND(AVG(pl)) avg_pl, ROUND(MIN(pl)) worst, ROUND(MAX(pl)) best,
       ROUND(SUM(pl)) total_pl,
       ROUND(AVG(ABS(net_credit))*${cfg.lot}) avg_premium,
       ROUND(SUM(IF(pl>0,pl,0)) / NULLIF(-SUM(IF(pl<0,pl,0)),0), 2) profit_factor,
       MIN(expiry_date) from_date, MAX(expiry_date) to_date
FROM pnl`;
}

const out = { generatedAt: new Date().toISOString(), entryDaysBeforeExpiry: ENTRY_DAYS_BEFORE, since: FROM_DATE, strategies: [] };

for (const st of STRATEGIES) {
  const perUnderlying = {};
  for (const [sym, cfg] of Object.entries(UNDERLYINGS)) {
    try {
      const [rows] = await bq.query({
        query: buildSql(sym, cfg, st.legs),
        params: { sym, from: FROM_DATE },
      });
      const r = rows[0];
      if (!r || !r.trades) { console.log(`  ${st.id}/${sym}: no data`); continue; }
      perUnderlying[sym] = {
        trades: Number(r.trades), winRate: Number(r.win_rate),
        avgPl: Number(r.avg_pl), worst: Number(r.worst), best: Number(r.best),
        totalPl: Number(r.total_pl), avgPremium: Number(r.avg_premium),
        profitFactor: r.profit_factor === null ? null : Number(r.profit_factor),
        from: r.from_date?.value || r.from_date, to: r.to_date?.value || r.to_date,
        lot: cfg.lot,
      };
      console.log(`  ${st.id}/${sym}: ${r.trades} trades, ${r.win_rate}% win, avg ₹${r.avg_pl}`);
    } catch (e) {
      console.log(`  ${st.id}/${sym}: FAILED — ${e.message.slice(0, 120)}`);
    }
  }
  if (Object.keys(perUnderlying).length) {
    out.strategies.push({ id: st.id, name: st.name, view: st.view, risk: st.risk, desc: st.desc, stats: perUnderlying });
  }
}

fs.writeFileSync("src/data/strategyStats.json", JSON.stringify(out, null, 2));
console.log(`\nwrote src/data/strategyStats.json — ${out.strategies.length} strategies`);

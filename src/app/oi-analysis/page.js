"use client";

import { useState, useEffect, useMemo } from "react";
const UNDERLYINGS = [{symbol: "NIFTY"}, {symbol: "BANKNIFTY"}, {symbol: "FINNIFTY"}];
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ReferenceLine, PieChart, Pie,
} from "recharts";
import { Activity, TrendingUp, TrendingDown, Target } from "lucide-react";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-lg p-3 border border-white/10 text-sm">
      <p className="text-slate-400">Strike: {d.strike}</p>
      {d.ceOI !== undefined && <p className="text-emerald-400">CE OI: {(d.ceOI / 100000).toFixed(1)}L</p>}
      {d.peOI !== undefined && <p className="text-rose-400">PE OI: {(d.peOI / 100000).toFixed(1)}L</p>}
      {d.ceOIChange !== undefined && <p className="text-blue-400">CE Chg: {(d.ceOIChange / 1000).toFixed(1)}K</p>}
      {d.peOIChange !== undefined && <p className="text-amber-400">PE Chg: {(d.peOIChange / 1000).toFixed(1)}K</p>}
    </div>
  );
}

/**
 * Calculate Max Pain (strike where option writers lose the least)
 */
function calculateMaxPain(chain) {
  let minPain = Infinity;
  let maxPainStrike = 0;

  for (const row of chain) {
    let totalPain = 0;
    for (const r of chain) {
      // CE writers' pain at this expiry price
      const cePain = Math.max(row.strike - r.strike, 0) * r.ce.oi;
      // PE writers' pain at this expiry price
      const pePain = Math.max(r.strike - row.strike, 0) * r.pe.oi;
      totalPain += cePain + pePain;
    }
    if (totalPain < minPain) {
      minPain = totalPain;
      maxPainStrike = row.strike;
    }
  }
  return maxPainStrike;
}

import ProtectedRoute from "@/components/ProtectedRoute";

export default function OIAnalysisPage() {
  return (
    <ProtectedRoute>
      <OIAnalysisContent />
    </ProtectedRoute>
  );
}

function OIAnalysisContent() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pcrHistory, setPcrHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setPcrHistory([]);
    (async () => {
      try {
        const res = await fetch(`/api/chain/pcr-history?underlying=${symbol}&days=30`);
        const json = await res.json();
        if (!cancelled && Array.isArray(json.data)) setPcrHistory(json.data);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [symbol]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const expData = await fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json());
        if (cancelled) return;
        if (!expData.expiries?.length) throw new Error("No expiries found");
        const data = await fetch(`/api/chain?symbol=${symbol}&expiry=${expData.expiries[0]}`).then((r) => r.json());
        if (cancelled) return;
        setChainData(data);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load live OI data:", err);
          setChainData(null);
          setLoading(false);
        }
      }
    }
    load().catch(() => {});
    return () => { cancelled = true; };
  }, [symbol]);

  const analytics = useMemo(() => {
    if (!chainData || !chainData.chain) return null;
    const { chain, spot, atmStrike } = chainData;

    // OI data for bar chart (top 25 strikes near ATM)
    const nearATM = chain.filter(
      (r) => Math.abs(r.strike - atmStrike) <= 10 * (symbol === "BANKNIFTY" ? 100 : 50)
    );

    const oiData = nearATM.map((r) => ({
      strike: r.strike,
      ceOI: r.ce.oi,
      peOI: r.pe.oi,
    }));

    const oiChangeData = nearATM.map((r) => ({
      strike: r.strike,
      ceOIChange: r.ce.oiChange,
      peOIChange: r.pe.oiChange,
    }));

    // PCR (Put-Call Ratio)
    const totalCallOI = chain.reduce((sum, r) => sum + r.ce.oi, 0);
    const totalPutOI = chain.reduce((sum, r) => sum + r.pe.oi, 0);
    const pcr = totalCallOI > 0 ? (totalPutOI / totalCallOI).toFixed(2) : 0;

    // Max Pain
    const maxPain = calculateMaxPain(chain);

    // Highest OI strikes
    const highestCallOI = [...chain].sort((a, b) => b.ce.oi - a.ce.oi)[0];
    const highestPutOI = [...chain].sort((a, b) => b.pe.oi - a.pe.oi)[0];

    // IV analysis
    const avgCallIV = (chain.reduce((s, r) => s + r.ce.iv, 0) / chain.length).toFixed(1);
    const avgPutIV = (chain.reduce((s, r) => s + r.pe.iv, 0) / chain.length).toFixed(1);

    return {
      oiData, oiChangeData, pcr, maxPain, spot, atmStrike,
      highestCallOI, highestPutOI, totalCallOI, totalPutOI,
      avgCallIV, avgPutIV,
    };
  }, [chainData, symbol]);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <main className="pt-24 flex items-center justify-center">
          <div className="animate-pulse text-slate-500 text-lg">Loading OI analysis...</div>
        </main>
      </div>
    );
  }

  const pcrSentiment = analytics.pcr > 1.2 ? "Bullish" : analytics.pcr < 0.8 ? "Bearish" : "Neutral";
  const pcrColor = analytics.pcr > 1.2 ? "text-emerald-400" : analytics.pcr < 0.8 ? "text-rose-400" : "text-amber-400";

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">OI Analysis</h1>
            <p className="text-slate-400">Open Interest analysis, PCR, Max Pain, and OI heatmaps for <span className="text-blue-400 font-semibold">{symbol}</span></p>
          </div>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm w-fit"
          >
            {UNDERLYINGS.map((u) => (
              <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">PCR</p>
            <p className={`text-2xl font-bold ${pcrColor}`}>{analytics.pcr}</p>
            <p className={`text-xs mt-1 ${pcrColor}`}>{pcrSentiment}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Max Pain</p>
            <p className="text-2xl font-bold text-blue-400">₹{analytics.maxPain.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Spot</p>
            <p className="text-2xl font-bold text-white">₹{analytics.spot.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Highest CE OI</p>
            <p className="text-lg font-bold text-emerald-400">{analytics.highestCallOI.strike}</p>
            <p className="text-xs text-slate-500">{(analytics.highestCallOI.ce.oi / 100000).toFixed(1)}L</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Highest PE OI</p>
            <p className="text-lg font-bold text-rose-400">{analytics.highestPutOI.strike}</p>
            <p className="text-xs text-slate-500">{(analytics.highestPutOI.pe.oi / 100000).toFixed(1)}L</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Avg IV</p>
            <p className="text-lg font-bold text-amber-400">CE: {analytics.avgCallIV}%</p>
            <p className="text-xs text-slate-500">PE: {analytics.avgPutIV}%</p>
          </div>
        </div>

        {/* OI Distribution Chart */}
        <div className="glass-card rounded-2xl p-4 md:p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Open Interest Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analytics.oiData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
              <YAxis dataKey="strike" type="category" stroke="#64748B" fontSize={10} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ceOI" fill="#10B981" opacity={0.7} radius={[0, 4, 4, 0]} name="CE OI" />
              <Bar dataKey="peOI" fill="#EF4444" opacity={0.7} radius={[0, 4, 4, 0]} name="PE OI" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* OI Change Chart */}
        <div className="glass-card rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">OI Change (Build-up / Unwinding)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.oiChangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="strike" stroke="#64748B" fontSize={10} />
              <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="ceOIChange" name="CE Chg">
                {analytics.oiChangeData.map((entry, i) => (
                  <Cell key={i} fill={entry.ceOIChange >= 0 ? "#3B82F6" : "#64748B"} opacity={0.7} />
                ))}
              </Bar>
              <Bar dataKey="peOIChange" name="PE Chg">
                {analytics.oiChangeData.map((entry, i) => (
                  <Cell key={i} fill={entry.peOIChange >= 0 ? "#F59E0B" : "#64748B"} opacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PCR History Chart */}
        {pcrHistory.length > 1 && (
          <div className="glass-card rounded-2xl p-4 md:p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">PCR Trend — Last 30 Days</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Put-Call Ratio by Open Interest · {`>`}1 = more put OI (bearish hedge) · {`<`}1 = more call OI (bullish)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Latest</p>
                <p className={`text-lg font-bold font-mono ${
                  pcrHistory[pcrHistory.length-1]?.pcr > 1.3 ? "text-rose-400" :
                  pcrHistory[pcrHistory.length-1]?.pcr < 0.7 ? "text-emerald-400" : "text-white"
                }`}>
                  {pcrHistory[pcrHistory.length-1]?.pcr?.toFixed(2)}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={pcrHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={10}
                  tickFormatter={(d) => d?.slice(5)}
                  minTickGap={20}
                />
                <YAxis stroke="#64748B" fontSize={10} domain={[0.5, 2]} />
                <Tooltip
                  formatter={(v) => [v?.toFixed(3), "PCR"]}
                  labelFormatter={(d) => d}
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                />
                <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 2" label={{ value: "Neutral", fill: "#64748b", fontSize: 9 }} />
                <ReferenceLine y={1.3} stroke="#f87171" strokeDasharray="2 2" label={{ value: "Bearish", fill: "#f87171", fontSize: 9 }} />
                <ReferenceLine y={0.7} stroke="#34d399" strokeDasharray="2 2" label={{ value: "Bullish", fill: "#34d399", fontSize: 9 }} />
                <Line
                  type="monotone"
                  dataKey="pcr"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 4, fill: "#60a5fa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}

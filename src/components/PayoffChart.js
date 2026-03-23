"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-lg p-3 border border-white/10 text-sm shadow-xl">
      <p className="text-slate-400 font-mono mb-2">Spot: ₹{d.price?.toLocaleString()}</p>
      {d.t0Pnl !== undefined && d.t0Pnl !== d.pnl && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-violet-400 font-medium">T+0 P&L</span>
          <span className={d.t0Pnl >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            ₹{d.t0Pnl?.toLocaleString()}
          </span>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <span className="text-slate-500 font-medium">Expiry P&L</span>
        <span className={d.pnl >= 0 ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
          ₹{d.pnl?.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function PayoffChart({ data, breakevens = [], spotPrice, liveSpot }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 glass-card rounded-2xl text-slate-500">
        Add option legs to see the payoff chart
      </div>
    );
  }

  const dataMax = Math.max(...data.map((i) => i.pnl), 0);
  const dataMin = Math.min(...data.map((i) => i.pnl), 0);

  const gradientOffset = (dataMax <= 0) ? 0 : (dataMin >= 0) ? 1 : dataMax / (dataMax - dataMin);

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Payoff at Expiry</h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 text-[10px] uppercase font-bold tracking-wider mr-2 hidden md:flex">
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-500"></div>T+0 Curve</div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/50 border border-emerald-500"></div>Expiry Area</div>
          </div>
          {breakevens && breakevens.length > 0 && (
            <div className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              <span className="text-slate-500 mr-2">BREAKEVENS:</span>
              {breakevens.map((be) => `₹${be.toLocaleString()}`).join(' & ')}
            </div>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset} stopColor="#10B981" stopOpacity={0.4} />
              <stop offset={gradientOffset} stopColor="#EF4444" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="t0Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            domain={['dataMin', 'dataMax']}
            dataKey="price"
            stroke="#64748B"
            fontSize={11}
            tickFormatter={(v) => v.toLocaleString()}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickFormatter={(v) => `₹${v.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Zero line */}
          <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
          {/* Origin Spot price line */}
          {spotPrice && (
            <ReferenceLine x={spotPrice} stroke="#8B5CF6" strokeDasharray="4 4" label={{ value: "Entry Spot", fill: "#8B5CF6", fontSize: 11, position: "insideTopLeft" }} />
          )}
          {/* Live Replay Head Spot */}
          {liveSpot && (
            <ReferenceLine 
              x={liveSpot} 
              stroke="#0EA5E9" 
              strokeWidth={2}
              label={{ value: "🔴 LIVE", fill: "#0EA5E9", fontSize: 11, position: "insideTopRight" }} 
            />
          )}
          {/* Expiry Profit area */}
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="url(#splitColor)"
            fill="url(#splitColor)"
            strokeWidth={2}
            activeDot={{ r: 5, fill: "#ffffff" }}
            baseValue={0}
            isAnimationActive={false}
          />
          {/* T+0 real-time P&L line */}
          <Area
            type="monotone"
            dataKey="t0Pnl"
            stroke="#8B5CF6"
            fill="none"
            strokeWidth={3}
            activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#080C16", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

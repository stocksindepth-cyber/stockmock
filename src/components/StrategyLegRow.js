"use client";

import { X } from "lucide-react";

/**
 * StrategyLegRow — compact single-line leg editor.
 *
 * Industry-standard table row:
 *   L#  [B/S]  [CE/PE]  [Strike]  [Prem ₹]  [Lots]  ×N  [✕]
 *
 * B/S and CE/PE are click-to-toggle buttons (single click, no dropdown).
 * Works at any panel width ≥ 320 px.
 */

const DARK = { colorScheme: "dark" };

const inputCls =
  "min-w-0 h-7 bg-slate-800 border border-slate-700 rounded " +
  "px-2 text-xs font-semibold text-white tabular-nums " +
  "focus:outline-none focus:border-blue-500 focus:bg-slate-700/60 transition-colors";

export default function StrategyLegRow({ leg, index, onChange, onRemove }) {
  const set = (field, value) => onChange(index, { ...leg, [field]: value });

  const isBuy  = leg.action === "BUY";
  const isCall = leg.type   === "CE";

  return (
    <div className="flex items-center gap-1.5 group py-0.5">

      {/* L# */}
      <span className="shrink-0 w-5 text-center text-[10px] font-bold text-slate-600 font-mono select-none">
        L{index + 1}
      </span>

      {/* BUY / SELL — click to toggle */}
      <button
        onClick={() => set("action", isBuy ? "SELL" : "BUY")}
        title={isBuy ? "Click to SELL" : "Click to BUY"}
        className={`shrink-0 w-7 h-7 rounded font-black text-[11px] tracking-tight transition-colors ${
          isBuy
            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            : "bg-rose-500/20   text-rose-400   hover:bg-rose-500/30"
        }`}
      >
        {isBuy ? "B" : "S"}
      </button>

      {/* CE / PE — click to toggle */}
      <button
        onClick={() => set("type", isCall ? "PE" : "CE")}
        title={isCall ? "Click for PUT" : "Click for CALL"}
        className={`shrink-0 w-9 h-7 rounded font-bold text-[11px] transition-colors ${
          isCall
            ? "bg-blue-500/20  text-blue-400  hover:bg-blue-500/30"
            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
        }`}
      >
        {isCall ? "CE" : "PE"}
      </button>

      {/* Strike */}
      <input
        type="number"
        value={leg.strike}
        onChange={(e) => set("strike", Number(e.target.value))}
        step={50}
        style={DARK}
        className={`flex-[2] ${inputCls}`}
      />

      {/* Premium */}
      <input
        type="number"
        value={leg.premium}
        onChange={(e) => set("premium", Number(e.target.value))}
        step={0.5}
        min={0}
        style={DARK}
        className={`flex-[1.5] ${inputCls}`}
      />

      {/* Lots */}
      <input
        type="number"
        value={leg.lots}
        onChange={(e) => set("lots", Math.max(1, Number(e.target.value)))}
        min={1}
        style={DARK}
        className={`shrink-0 w-10 h-7 bg-slate-800 border border-slate-700 rounded
                    px-1.5 text-xs font-semibold text-white tabular-nums text-center
                    focus:outline-none focus:border-blue-500 focus:bg-slate-700/60 transition-colors`}
      />

      {/* Lot-size badge */}
      <span className="shrink-0 text-[10px] font-medium text-slate-500 whitespace-nowrap">
        ×{leg.lotSize}
      </span>

      {/* Remove — hover reveal */}
      <button
        onClick={() => onRemove(index)}
        title="Remove leg"
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded
                   text-slate-700 hover:text-rose-400 hover:bg-rose-500/10
                   opacity-0 group-hover:opacity-100 transition-all ml-auto"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

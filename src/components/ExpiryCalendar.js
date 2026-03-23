"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const DATA_MIN = "2016-01-04";
const DATA_MAX = "2024-06-03";

/**
 * NSE expiry weekday per underlying (for the 2016-2024 historical data range).
 * getDay() values: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
 *
 *  NIFTY      — Thursday  (always, throughout)
 *  BANKNIFTY  — Wednesday (Thursday pre-2022, changed to Wed in late-2022;
 *                          monthly only from Oct-2023 onward via SEBI circular)
 *  FINNIFTY   — Tuesday   (launched Jan 2022; monthly only from Oct-2023)
 *  MIDCPNIFTY — Monday    (launched Mar 2023; monthly only from Oct-2023)
 */
const EXPIRY_WEEKDAY = {
  NIFTY:      4,   // Thursday
  BANKNIFTY:  3,   // Wednesday
  FINNIFTY:   2,   // Tuesday
  MIDCPNIFTY: 1,   // Monday
};

const EXPIRY_DAY_NAME = {
  NIFTY:      "Thursday",
  BANKNIFTY:  "Wednesday",
  FINNIFTY:   "Tuesday",
  MIDCPNIFTY: "Monday",
};

// Badge colour per underlying (Tailwind classes)
const UNDERLYING_COLOR = {
  NIFTY:      { bg: "bg-blue-500/20",   border: "border-blue-500/40",   text: "text-blue-300" },
  BANKNIFTY:  { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-300" },
  FINNIFTY:   { bg: "bg-cyan-500/20",   border: "border-cyan-500/40",   text: "text-cyan-300" },
  MIDCPNIFTY: { bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-300" },
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYMD(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isExpiryDay(date, wd) {
  return date.getDay() === wd;
}

function isMonthlyExpiry(date, wd) {
  if (date.getDay() !== wd) return false;
  const nextWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
  return nextWeek.getMonth() !== date.getMonth();
}

function inDataRange(dateStr) {
  return dateStr >= DATA_MIN && dateStr <= DATA_MAX;
}

function tradingDaysBetween(startStr, endStr) {
  let count = 0;
  const cur = parseYMD(startStr);
  const end = parseYMD(endStr);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const cells    = [];
  for (let i = 0; i < firstDay.getDay(); i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ExpiryCalendar
 *
 * Props:
 *   entryDate       {string}   "YYYY-MM-DD"
 *   expiryDate      {string}   "YYYY-MM-DD"
 *   onEntryChange   {fn}       (dateStr) => void
 *   onExpiryChange  {fn}       (dateStr) => void
 *   underlying      {string}   "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "MIDCPNIFTY"
 */
export default function ExpiryCalendar({
  entryDate, expiryDate,
  onEntryChange, onExpiryChange,
  underlying = "NIFTY",
}) {
  const expiryWd   = EXPIRY_WEEKDAY[underlying]   ?? 4;
  const dayName    = EXPIRY_DAY_NAME[underlying]   ?? "Thursday";
  const uColor     = UNDERLYING_COLOR[underlying]  ?? UNDERLYING_COLOR.NIFTY;

  const initialDate = entryDate ? parseYMD(entryDate) : parseYMD("2024-01-01");
  const [viewYear,  setViewYear]  = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [mode,      setMode]      = useState("entry");

  const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function handleClick(date) {
    const str = ymd(date);
    if (!inDataRange(str)) return;
    if (mode === "entry") {
      onEntryChange(str);
      setMode("expiry");
    } else {
      if (entryDate && str <= entryDate) return;
      onExpiryChange(str);
      setMode("entry");
    }
  }

  const tradingDays  = entryDate && expiryDate ? tradingDaysBetween(entryDate, expiryDate) : null;
  const calendarDays = entryDate && expiryDate
    ? Math.round((parseYMD(expiryDate) - parseYMD(entryDate)) / 86400000)
    : null;

  return (
    <div className="select-none">

      {/* ── Underlying + expiry-day info badge ── */}
      <div className={`flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg border ${uColor.bg} ${uColor.border}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${uColor.text}`}>{underlying}</span>
        <span className="text-slate-600 text-[10px]">•</span>
        <span className="text-[10px] text-slate-400">
          Weekly expiry: <span className={`font-bold ${uColor.text}`}>{dayName}</span>
        </span>
        {underlying !== "NIFTY" && (
          <span className="ml-auto text-[9px] text-slate-600 italic">monthly-only post Oct 2023</span>
        )}
      </div>

      {/* ── Mode toggle ── */}
      <div className="flex gap-1.5 mb-3">
        <button
          onClick={() => setMode("entry")}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
            mode === "entry"
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
          }`}
        >
          📍 Set Entry{entryDate && <span className="ml-1 font-mono text-[10px] opacity-70">{entryDate}</span>}
        </button>
        <button
          onClick={() => setMode("expiry")}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
            mode === "expiry"
              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
              : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
          }`}
        >
          🎯 Set Expiry{expiryDate && <span className="ml-1 font-mono text-[10px] opacity-70">{expiryDate}</span>}
        </button>
      </div>

      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-bold text-white">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Day-of-week header — highlights the correct expiry column ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, idx) => (
          <div
            key={d}
            className={`text-center text-[9px] font-bold uppercase tracking-widest py-1 ${
              idx === expiryWd ? `${uColor.text}` : "text-slate-600"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;

          const str        = ymd(date);
          const inRange    = inDataRange(str);
          const isEntry    = str === entryDate;
          const isExp      = str === expiryDate;
          const isExpDay   = isExpiryDay(date, expiryWd);
          const isMonthly  = isMonthlyExpiry(date, expiryWd);
          const inTrade    = entryDate && expiryDate && str > entryDate && str < expiryDate;
          const clickable  = inRange && (mode === "entry" || (mode === "expiry" && (!entryDate || str > entryDate)));

          let cellBg  = "";
          let textCls = inRange ? "text-slate-300" : "text-slate-700 cursor-not-allowed";
          let ring    = "";

          if (isEntry) {
            cellBg  = "bg-emerald-500/30";
            textCls = "text-emerald-300 font-black";
            ring    = "ring-1 ring-emerald-500/60";
          } else if (isExp) {
            cellBg  = "bg-amber-500/30";
            textCls = "text-amber-300 font-black";
            ring    = "ring-1 ring-amber-500/60";
          } else if (inTrade) {
            cellBg  = isExpDay ? `${uColor.bg}` : "bg-blue-500/8";
            textCls = inRange ? (isExpDay ? `${uColor.text}` : "text-slate-400") : "text-slate-700";
          } else if (isExpDay && inRange) {
            cellBg  = `${uColor.bg}`;
            textCls = `${uColor.text}`;
          }

          if (clickable && !isEntry && !isExp) {
            cellBg += " hover:bg-white/10 cursor-pointer transition-colors";
          }

          return (
            <div
              key={str}
              onClick={() => clickable && handleClick(date)}
              className={`relative flex flex-col items-center justify-center h-9 rounded-lg text-[11px] font-semibold ${cellBg} ${textCls} ${ring}`}
            >
              <span>{date.getDate()}</span>

              {/* Expiry dot — weekly = filled, monthly = brighter */}
              {isExpDay && inRange && !isEntry && !isExp && (
                <span
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    isMonthly ? "bg-orange-400" : `${uColor.text.replace("text-", "bg-").replace("300", "400/70")}`
                  }`}
                />
              )}

              {isEntry  && <span className="absolute -top-0.5 text-[7px] font-black text-emerald-400 uppercase leading-none">IN</span>}
              {isExp    && <span className="absolute -top-0.5 text-[7px] font-black text-amber-400 uppercase leading-none">EXP</span>}
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-2 border-t border-white/8">
        <span className="flex items-center gap-1 text-[9px] text-slate-500">
          <span className="w-2 h-2 rounded-sm bg-emerald-500/40 ring-1 ring-emerald-500/50" />
          Entry
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-500">
          <span className="w-2 h-2 rounded-sm bg-amber-500/40 ring-1 ring-amber-500/50" />
          Expiry
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${uColor.text.replace("text-", "bg-").replace("300", "400/70")}`} />
          Weekly {dayName.slice(0, 3)}
        </span>
        <span className="flex items-center gap-1 text-[9px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          Monthly {dayName.slice(0, 3)}
        </span>
      </div>

      {/* ── Trade summary strip ── */}
      {entryDate && expiryDate && (
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Entry</p>
            <p className="text-[11px] font-bold text-emerald-400 tabular-nums">{entryDate}</p>
          </div>
          <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Expiry</p>
            <p className="text-[11px] font-bold text-amber-400 tabular-nums">{expiryDate}</p>
          </div>
          <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Duration</p>
            <p className="text-[11px] font-bold text-slate-300 tabular-nums">
              {tradingDays}d <span className="text-slate-600">({calendarDays}cal)</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

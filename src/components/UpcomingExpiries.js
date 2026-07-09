"use client";

// Live upcoming NSE expiries (authoritative, holiday-adjusted) for the expiry page.
import { useEffect, useState } from "react";

export default function UpcomingExpiries({ symbol = "NIFTY" }) {
  const [dates, setDates] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch(`/api/expiries?symbol=${symbol}`).then((r) => r.json()).then((d) => {
      if (alive && Array.isArray(d?.expiries)) setDates(d.expiries.slice(0, 6));
    }).catch(() => { if (alive) setDates([]); });
    return () => { alive = false; };
  }, [symbol]);

  if (dates === null) return <p className="text-sm text-slate-500">Loading live expiry dates…</p>;
  if (!dates.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((d, i) => {
        const dt = new Date(d + "T00:00:00");
        const label = dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
        return (
          <span key={d} className={`rounded-lg border px-3 py-2 text-sm tabular-nums ${i === 0 ? "border-indigo-500/50 bg-indigo-500/10 text-white" : "border-white/10 bg-slate-900/40 text-slate-300"}`}>
            {label}{i === 0 ? " · next" : ""}
          </span>
        );
      })}
    </div>
  );
}

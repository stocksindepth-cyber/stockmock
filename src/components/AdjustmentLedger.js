import React from "react";
import { GitCommit, Plus, Trash2, Edit3, Info } from "lucide-react";

export default function AdjustmentLedger({ adjustments = [] }) {
  return (
    <div className="glass-card border border-white/5 rounded-2xl p-4 flex flex-col h-full bg-[#0d1323]">
      <div className="flex items-center gap-2 mb-4">
        <GitCommit className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Trade Journal & Adjustments</h3>
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        Every time you modify the strategy during the historical replay, the AI logs your action here.
      </p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {adjustments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 border border-dashed border-white/10 rounded-xl">
            <Info className="w-8 h-8 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">No adjustments logged yet. Play the simulation and edit your legs to record actions.</p>
          </div>
        ) : (
          adjustments.map((log, i) => (
            <div key={i} className="flex gap-3 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
                {i !== adjustments.length - 1 && <div className="w-px h-full bg-slate-700 my-1" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-400">Day {log.day} • {log.time}</span>
                  <span className="text-[10px] font-mono text-slate-500">Spot: {log.spot.toFixed(2)}</span>
                </div>
                <p className="text-slate-200">
                  {log.action === "ADD" && <Plus className="inline w-3 h-3 text-emerald-400 mr-1"/>}
                  {log.action === "REMOVE" && <Trash2 className="inline w-3 h-3 text-rose-400 mr-1"/>}
                  {log.action === "UPDATE" && <Edit3 className="inline w-3 h-3 text-blue-400 mr-1"/>}
                  {log.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

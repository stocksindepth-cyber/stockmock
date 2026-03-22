"use client";

export default function StrategyLegRow({ leg, index, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange(index, { ...leg, [field]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-[auto_100px_120px_1fr_1fr_100px_auto] items-center md:items-end gap-3 md:gap-4 p-3 md:p-4 glass-card rounded-xl group transition-all border border-white/5 hover:border-blue-500/30">
      
      <div className="hidden md:flex items-center h-[38px]">
        <span className="text-slate-500 text-sm font-mono font-bold w-6">L{index + 1}</span>
      </div>

      {/* Buy/Sell */}
      <div className="flex flex-col w-full">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 md:hidden">Action</label>
        <select
          value={leg.action}
          onChange={(e) => handleChange("action", e.target.value)}
          className={`w-full h-[38px] px-3 rounded-lg text-sm font-semibold border-0 cursor-pointer ${
            leg.action === "BUY"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      </div>

      {/* CE/PE */}
      <div className="flex flex-col w-full">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 md:hidden">Option Type</label>
        <select
          value={leg.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className={`w-full h-[38px] px-3 rounded-lg text-sm font-semibold border-0 cursor-pointer ${
            leg.type === "CE"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          <option value="CE">CALL (CE)</option>
          <option value="PE">PUT (PE)</option>
        </select>
      </div>

      {/* Strike */}
      <div className="flex flex-col w-full">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Strike</label>
        <input
          type="number"
          value={leg.strike}
          onChange={(e) => handleChange("strike", Number(e.target.value))}
          className="w-full h-[38px] bg-[#0A0E17] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          step={50}
        />
      </div>

      {/* Premium */}
      <div className="flex flex-col w-full">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Premium (₹)</label>
        <input
          type="number"
          value={leg.premium}
          onChange={(e) => handleChange("premium", Number(e.target.value))}
          className="w-full h-[38px] bg-[#0A0E17] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          step={1}
          min={0}
        />
      </div>

      {/* Lots */}
      <div className="flex flex-col w-full">
        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Lots</label>
        <div className="relative w-full">
          <input
            type="number"
            value={leg.lots}
            onChange={(e) => handleChange("lots", Math.max(1, Number(e.target.value)))}
            className="w-full h-[38px] bg-[#0A0E17] border border-white/10 rounded-lg pl-3 pr-8 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            min={1}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">x{leg.lotSize}</span>
        </div>
      </div>

      {/* Remove */}
      <div className="col-span-2 md:col-span-1 flex justify-end md:h-[38px] mt-2 md:mt-0">
        <button
          onClick={() => onRemove(index)}
          className="text-rose-400 hover:text-white text-sm px-4 py-1.5 rounded-lg hover:bg-rose-500 transition-all font-medium border border-rose-500/20 hover:border-rose-500 flex items-center justify-center w-full md:w-auto md:opacity-0 md:group-hover:opacity-100"
        >
          ✕ Remove
        </button>
      </div>
    </div>
  );
}

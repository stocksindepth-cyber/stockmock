import React from "react";
import { Sparkles, TrendingUp, TrendingDown, Target, Info, X } from "lucide-react";

export default function AIMonitorModal({ 
  isOpen, 
  onClose, 
  initialPnL, 
  adjustedPnL, 
  adjustmentsCount 
}) {
  if (!isOpen) return null;

  const difference = adjustedPnL - initialPnL;
  const isBetter = difference > 0;
  const isSame = difference === 0 && adjustmentsCount === 0;

  let aiMessage = "";
  if (isSame) {
    aiMessage = "You held your nerve! By letting the strategy run without panic adjustments, you absorbed the volatility and let Theta do its job.";
  } else if (isBetter) {
    aiMessage = `Excellent risk management! Your mid-trade adjustments saved your capital or maximized gains. You outperformed the "do-nothing" baseline by ₹${difference.toLocaleString()}.`;
  } else {
    aiMessage = `You over-managed this trade. The original strategy actually recovered or decayed favorably by Expiry. Your manual adjustments resulted in a ₹${Math.abs(difference).toLocaleString()} underperformance compared to doing nothing.`;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Simulation Complete</h2>
            <p className="text-sm text-blue-400 font-medium tracking-wide uppercase mt-0.5">AI Post-Mortem Analysis</p>
          </div>
        </div>
        
        <p className="text-slate-300 leading-relaxed mb-8">
          You have reached the Expiry of this positional campaign. Here is how your active trade management affected your final outcome compared to a strict "buy and hold" mechanical approach.
        </p>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Unadjusted Baseline</p>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">If you had never touched the original entry legs.</p>
            <p className={`text-4xl font-mono font-bold ${initialPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {initialPnL >= 0 ? '+' : '-'}₹{Math.abs(initialPnL).toLocaleString()}
            </p>
          </div>

          <div className={`border rounded-2xl p-6 relative overflow-hidden ${
            isSame ? 'bg-white/5 border-white/10' :
            isBetter ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                     : 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-white uppercase tracking-wider">Your Adjusted Result</p>
              {adjustmentsCount > 0 && (
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-black/30 text-slate-300">
                  {adjustmentsCount} Actions
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-4 line-clamp-2">The final value of your actively managed legs.</p>
            <p className={`text-4xl font-mono font-bold ${adjustedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {adjustedPnL >= 0 ? '+' : '-'}₹{Math.abs(adjustedPnL).toLocaleString()}
            </p>
          </div>
        </div>

        {/* AI Verdict */}
        <div className="bg-blue-950/40 border border-blue-500/20 rounded-2xl p-5 flex gap-4">
          <div className="shrink-0">
            <Target className="w-6 h-6 text-blue-400 mt-1" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-1">Coach Verdict</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {aiMessage}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

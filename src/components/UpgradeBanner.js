import { Lock, Zap, X } from "lucide-react";
import Link from "next/link";

export default function UpgradeBanner({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.3)] overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-3">Daily Limit Reached</h2>
        
        <p className="text-center text-slate-300 mb-8 leading-relaxed">
          {message || "You have exhausted your Free Tier daily simulation limit. Upgrade your account to unlock unlimited Time-Machine backtesting and advanced Analytics."}
        </p>

        <div className="space-y-4">
          <Link 
            href="/pricing"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
          >
            <Zap className="w-5 h-5" />
            Upgrade to Pro
          </Link>
          
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-semibold"
          >
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}

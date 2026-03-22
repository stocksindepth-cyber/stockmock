export const callVsPutContent = {
  title: "Call vs Put Options: The Quantitative Guide",
  meta: "Master the foundation of derivatives: Calls and Puts. Understand how to use them for directional betting, their probability math, and the Greeks involved.",
  sections: [
    {
      heading: "1. The Two Pillars of Directional Options",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">Every single complex options strategy—from a beginner's naked bet to a multi-million dollar institutional Iron Condor—is constructed using just two fundamental building blocks: <strong>Calls</strong> and <strong>Puts</strong>.</p>
        
        <p class="text-slate-300 leading-relaxed mb-8">Before diving into complex spreads, you must understand the exact physics of how a Call and a Put behave when the underlying asset (like Nifty) moves, when time passes, and when volatility expands.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="bg-gradient-to-br from-[#064E3B] to-[#022C22] p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)] transform transition-transform hover:-translate-y-2">
            <div class="absolute -right-10 -top-10 opacity-10">
              <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/></svg>
            </div>
            
            <div class="inline-flex items-center justify-center p-3 bg-emerald-500/20 text-emerald-400 rounded-xl mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            
            <h3 class="text-emerald-400 font-black text-3xl mb-4 tracking-tight">Call Option (CE)</h3>
            <p class="text-emerald-50 text-lg font-medium mb-6">The Right to BUY</p>
            
            <p class="text-emerald-100/70 mb-8 leading-relaxed">Purchasing a Call gives you the contractual right to buy the underlying index at a specific strike price. You deploy this when your quantitative models scream <strong>BULLISH</strong>.</p>
            
            <div class="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20">
              <h5 class="text-emerald-300 font-bold mb-3 text-sm tracking-wider uppercase">The Mathematical Trade</h5>
              <div class="space-y-2 font-mono text-sm">
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Nifty Spot:</span> <span>22,000</span></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Action:</span> <span class="text-emerald-400">Buy 22,000 CE</span></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Premium Paid:</span> <span>₹150</span></div>
                <div class="h-px bg-emerald-500/20 my-2"></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Nifty Rallies to:</span> <span class="text-emerald-400">22,400</span></div>
                <div class="flex justify-between font-bold text-emerald-400 mt-2 text-base pt-2"><span>Total Profit:</span> <span>+₹250 / share</span></div>
                <div class="text-right text-emerald-500/70 text-xs">₹12,500 per lot</div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#7F1D1D] to-[#450A0A] p-8 rounded-3xl border border-rose-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.15)] transform transition-transform hover:-translate-y-2">
            <div class="absolute -right-10 -top-10 opacity-10">
              <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M3 7l6 6 4-4 8 8"/></svg>
            </div>
            
            <div class="inline-flex items-center justify-center p-3 bg-rose-500/20 text-rose-400 rounded-xl mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            
            <h3 class="text-rose-400 font-black text-3xl mb-4 tracking-tight">Put Option (PE)</h3>
            <p class="text-rose-50 text-lg font-medium mb-6">The Right to SELL</p>
            
            <p class="text-rose-100/70 mb-8 leading-relaxed">Purchasing a Put gives you the contractual right to "short sell" the underlying index at a specific strike price. You deploy this when your models scream <strong>BEARISH</strong>.</p>
            
            <div class="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-rose-500/20">
              <h5 class="text-rose-300 font-bold mb-3 text-sm tracking-wider uppercase">The Mathematical Trade</h5>
              <div class="space-y-2 font-mono text-sm">
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Nifty Spot:</span> <span>22,000</span></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Action:</span> <span class="text-rose-400">Buy 22,000 PE</span></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Premium Paid:</span> <span>₹150</span></div>
                <div class="h-px bg-rose-500/20 my-2"></div>
                <div class="flex justify-between text-slate-300"><span class="opacity-60">Nifty Crashes to:</span> <span class="text-rose-400">21,600</span></div>
                <div class="flex justify-between font-bold text-rose-400 mt-2 text-base pt-2"><span>Total Profit:</span> <span>+₹250 / share</span></div>
                <div class="text-right text-rose-500/70 text-xs">₹12,500 per lot</div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
       heading: "2. The Retail Probability Trap: Why 90% Lose Money",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">New traders naturally gravitate toward buying naked Calls and Puts because it feels exactly like buying a stock (Capital deployed = Max Risk). However, purchasing a directional option means you are now statistically fighting three separate dimensions of physics simultaneously.</p>
         
         <div class="my-10 bg-[#0B1120] rounded-2xl border border-white/5 overflow-hidden">
            <div class="p-6 bg-slate-800/50 border-b border-white/5">
               <h4 class="text-xl font-bold text-white mb-2">The Dimension Matrix of Option Buyers</h4>
               <p class="text-slate-400 text-sm">To be profitable buying a Call/Put, you must beat all three variables simultaneously.</p>
            </div>
            
            <div class="divide-y divide-white/5">
               <!-- Dimension 1 -->
               <div class="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors">
                  <div class="md:col-span-3 flex flex-col items-center text-center">
                     <div class="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/><path d="m2 12 10 4 10-4"/><path d="M12 2v20"/></svg>
                     </div>
                     <h5 class="text-blue-400 font-bold text-lg">1. Dimension of Space</h5>
                     <span class="text-slate-500 text-xs font-mono font-semibold uppercase tracking-widest mt-1">Delta (Δ)</span>
                  </div>
                  <div class="md:col-span-9">
                     <p class="text-slate-300 leading-relaxed"><strong>You must be right about Direction.</strong> If you buy a Call, the market must absolutely go up. If it goes down, you lose money. If it stays completely flat, you also mathematically lose money.</p>
                  </div>
               </div>
               
               <!-- Dimension 2 -->
               <div class="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors">
                  <div class="md:col-span-3 flex flex-col items-center text-center">
                     <div class="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                     </div>
                     <h5 class="text-rose-400 font-bold text-lg">2. Dimension of Time</h5>
                     <span class="text-slate-500 text-xs font-mono font-semibold uppercase tracking-widest mt-1">Theta (Θ)</span>
                  </div>
                  <div class="md:col-span-9">
                     <p class="text-slate-300 leading-relaxed"><strong>You must be right quickly.</strong> You have an expiration countdown. If you buy a Call, and the Nifty stays perfectly flat for 3 days before rocketing upwards on Expiry, the 3 days of "Time Decay" will have already destroyed your premium. You predicted space correctly, but failed time.</p>
                  </div>
               </div>
               
               <!-- Dimension 3 -->
               <div class="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors">
                  <div class="md:col-span-3 flex flex-col items-center text-center">
                     <div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                     </div>
                     <h5 class="text-amber-400 font-bold text-lg">3. Dimension of Volatility</h5>
                     <span class="text-slate-500 text-xs font-mono font-semibold uppercase tracking-widest mt-1">Vega (ν)</span>
                  </div>
                  <div class="md:col-span-9">
                     <p class="text-slate-300 leading-relaxed"><strong>You must be right against fear.</strong> Option premiums are pumped up by market fear (Implied Volatility). If you buy a Put before Union Budget expecting a crash, the premium is mathematically bloated by Vega. After the budget, the fear vanishes, IV crashes, and your premium collapses (IV Crush), even if the market actually drops.</p>
                  </div>
               </div>
            </div>
         </div>
       `
    },
    {
      heading: "3. Synthetic Long vs Short (Putting it together)",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">A true quant does not view the market as "Buy Calls" and "Buy Puts". They build <em>Synthetic Positions</em> to mathematically mirror stock movement without deploying the immense capital required for naked equity.</p>
        
        <div class="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-2xl mb-8 relative overflow-hidden">
           <div class="absolute -right-20 -bottom-20 opacity-[0.03]">
              <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
           </div>
           
           <h4 class="text-indigo-400 font-bold text-xl mb-4">The Synthetic Long Setup</h4>
           <div class="flex items-center gap-4 mb-4">
              <div class="bg-indigo-500/20 px-4 py-2 rounded font-mono text-indigo-300 font-bold border border-indigo-500/30">Buy ATM Call</div>
              <div class="text-slate-400 font-bold">+</div>
              <div class="bg-rose-500/20 px-4 py-2 rounded font-mono text-rose-300 font-bold border border-rose-500/30">Sell ATM Put</div>
           </div>
           
           <p class="text-slate-300 leading-relaxed mt-6">
              By buying an ATM Call and simultaneously writing (Selling) an ATM Put at the exact same strike, your absolute Payoff Graph becomes a flawless 45-degree diagonal line. This means your Options portfolio behaves exactly 1-to-1 as if you had bought 50 shares of Nifty on the cash market. 
           </p>
           <p class="text-slate-300 leading-relaxed mt-4">
              <strong>Why do Hedge Funds do this?</strong> To buy 50 shares of Nifty directly would cost ~₹11 Lakhs in locked cash capital. To build a Synthetic Long via options requires roughly ~₹1.2 Lakhs in margin. The fund achieves the exact same mathematical upside while keeping ₹9.8 Lakhs free to deploy in treasury bonds earning risk-free interest.
           </p>
        </div>
      `
    }
  ]
};

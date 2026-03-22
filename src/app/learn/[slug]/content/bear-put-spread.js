export const bearPutSpreadContent = {
  title: "Bear Put Spread: Controlled Downside Betting",
  meta: "Master the Bear Put Spread. Learn how institutions bet on market crashes without succumbing to the devastating Theta burn of naked Put buying.",
  sections: [
    {
       heading: "1. The Psychology of the Panic Put",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">When global news breaks—a banking collapse in the US, an unexpected rate hike from the RBI, or escalating geopolitical tension—the entire retail trading community immediately rushes to buy naked Put Options.</p>
         
         <div class="bg-rose-900/10 border-l-4 border-rose-500 p-6 rounded-xl relative shadow-inner group mb-8">
            <h4 class="text-rose-400 font-bold text-xl mb-4">The Volatility Trap</h4>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
               What retail traders fail to realize is that the moment negative news breaks, the <strong>India VIX (Implied Volatility) violently spikes.</strong> Because VIX expands, the premiums of all Put options instantly bloat to 300% of their normal mathematical value. If you buy a naked Put option right after the news breaks, you are paying the maximum possible <strong>Fear Premium</strong>.
            </p>
            <div class="bg-rose-500/20 px-4 py-3 rounded font-mono text-sm text-rose-300 border border-rose-500/30">
               If the market drops 1% the next day, but the panic subsides (VIX drops from 22 to 16), your Put Option will completely collapse due to <strong>IV Crush</strong>. You get the crash right, but you lose 60% of your money.
            </div>
         </div>

         <p class="text-slate-300 leading-relaxed mb-8">Professional quants never buy naked Puts during a panic. They execute a <strong>Bear Put Spread (A Bearish Debit Spread)</strong> to mathematically eliminate the IV Crush risk.</p>
       `
    },
    {
       heading: "2. The Hedged Architecture",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">A Bear Put Spread is a 2-leg directional strategy. You simultaneously buy an At-The-Money (ATM) Put Option, and sell an Out-of-The-Money (OTM) Put Option further down the chain. The cash you collect from selling the OTM Put partially finances the massive cost of your ATM Put.</p>
         
         <div class="bg-[#0B1120] border border-emerald-500/30 p-8 rounded-2xl mb-10 relative overflow-hidden shadow-2xl">
            <div class="absolute -right-6 -top-6 text-emerald-500/10">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            
            <h4 class="text-emerald-400 font-bold mb-6 text-xl">Constructing the Trade</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               <div class="bg-black/40 border border-white/5 p-5 rounded-xl shadow-inner border-t-2 border-t-rose-500">
                  <div class="flex justify-between items-center mb-3">
                     <span class="text-rose-400 font-bold">Leg 1: The Crash Engine</span>
                     <span class="bg-emerald-500/20 text-emerald-300 px-2 py-1 text-xs rounded font-mono border border-emerald-500/30">Debit</span>
                  </div>
                  <ul class="text-slate-300 font-mono text-sm space-y-2">
                     <li>Buy 22,000 PE (ATM)</li>
                     <li>Pay Premium: <strong>-₹180</strong></li>
                  </ul>
                  <p class="text-slate-400 text-xs mt-3">This is the naked downside exposure. It gains value as the market falls, but it bleeds ₹15 every day to Theta decay.</p>
               </div>
               
               <div class="bg-black/40 border border-white/5 p-5 rounded-xl shadow-inner border-t-2 border-t-emerald-500">
                  <div class="flex justify-between items-center mb-3">
                     <span class="text-emerald-400 font-bold">Leg 2: The Shock Absorber</span>
                     <span class="bg-emerald-500/20 text-emerald-300 px-2 py-1 text-xs rounded font-mono border border-emerald-500/30">Credit</span>
                  </div>
                  <ul class="text-slate-300 font-mono text-sm space-y-2">
                     <li>Sell 21,800 PE (OTM)</li>
                     <li>Collect Premium: <strong>+₹80</strong></li>
                  </ul>
                  <p class="text-slate-400 text-xs mt-3">By selling this put to a panicked retail trader, you collect upfront cash. This creates an impassable floor at 21,800.</p>
               </div>
            </div>
            
            <div class="mt-6 bg-black/60 p-4 rounded-xl border-l-4 border-rose-500 font-mono text-sm flex flex-wrap gap-4 items-center shadow-inner">
               <div class="text-slate-300">Total Net Cost = </div>
               <div class="text-white">-₹180 (Paid)</div>
               <div class="text-white">+</div>
               <div class="text-white">+₹80 (Collected)</div>
               <div class="text-rose-400 font-bold text-lg">= ₹100 Max Risk</div>
            </div>
         </div>
       `
    },
    {
       heading: "3. Visualizing the Floor",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Because you sold the 21,800 Put, you have formally capped your downside profits. If Nifty drops a catastrophic 1,000 points to 21,000, your profits completely stop growing at 21,800. You traded "unlimited infinite crashes" for massive cost reduction and probability enhancement.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-rose-500/20 relative overflow-hidden text-center shadow-xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Bear Put Spread Payoff Graph</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="250" viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGradBear" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.4"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGradBear" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.4"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="125" x2="580" y2="125" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="115" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Profit Zone Polygon (Left Floor) -->
                 <polygon points="40,40 200,40 285,125 40,125" fill="url(#profitGradBear)"/>
                 <path d="M 40,40 L 200,40" stroke="#10B981" stroke-width="3"/>
                 <path d="M 200,40 L 285,125" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- Loss Zone Polygon (Right Base) -->
                 <polygon points="285,125 360,200 560,200 560,125" fill="url(#lossGradBear)"/>
                 <path d="M 285,125 L 360,200" stroke="#F43F5E" stroke-width="3"/>
                 <path d="M 360,200 L 560,200" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Labels -->
                 <!-- Short Put Leg (The Floor) -->
                 <circle cx="200" cy="40" r="5" fill="#10B981"/>
                 <text x="200" y="25" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹5,000</text>
                 <text x="200" y="70" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Sell 21,800 PE</text>
                 
                 <!-- Breakeven -->
                 <circle cx="285" cy="125" r="5" fill="#94A3B8"/>
                 <text x="285" y="105" fill="#94A3B8" font-size="11" text-anchor="middle" class="font-mono">BE: 21,900</text>
                 
                 <!-- Long Put Leg -->
                 <circle cx="360" cy="200" r="5" fill="#F43F5E"/>
                 <text x="360" y="225" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Buy 22,000 PE</text>
                 <text x="360" y="240" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">Max Risk: ₹5,000</text>
              </svg>
            </div>
          </div>
       `
    },
    {
       heading: "4. The Greek Matrix: Taming the Bear",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Downside moves in the Indian stock market are fundamentally different than upside moves. Crashes happen 3x faster than rallies, which causes Implied Volatility (Fear) to expand incredibly fast. A Bear Put Spread directly weaponizes this mathematical phenomenon.</p>
         
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div class="bg-black/60 p-6 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
               <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#818CF8" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               </div>
               <h5 class="text-indigo-400 font-bold mb-3">Theta Neutralization</h5>
               <ul class="text-slate-400 text-sm space-y-3 font-mono relative z-10">
                  <li><span class="text-rose-400 font-bold">Buy 22k PE:</span> Burns -₹15 a day.</li>
                  <li><span class="text-emerald-400 font-bold">Sell 21.8k PE:</span> Prints +₹13 a day.</li>
                  <li class="border-t border-white/10 pt-2"><span class="text-white font-bold">Net Theta:</span> Insignificant -₹2 bleed.</li>
               </ul>
               <p class="text-slate-300 text-sm leading-relaxed mt-4 italic relative z-10">
                  A naked Put buyer prays that the market crashes immediately today. You, holding the Bear Put Spread, can calmly sit in the trade for an entire week waiting for the technical breakdown to occur because the short Put pays your Theta rent.
               </p>
            </div>
            
            <div class="bg-black/60 p-6 rounded-2xl border border-rose-500/20 shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition-colors">
               <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
               </div>
               <h5 class="text-rose-400 font-bold mb-3">Vega Compression</h5>
               <ul class="text-slate-400 text-sm space-y-3 font-mono relative z-10">
                  <li><span class="text-rose-400 font-bold">VIX Spikes:</span> Your Long Put inflates in value. Your Short Put also inflates (causing a temporary paper loss). Net impact is highly muted.</li>
                  <li><span class="text-emerald-400 font-bold">VIX Collapses:</span> Both contract premiums deflate together. Net impact is almost zero.</li>
               </ul>
               <p class="text-slate-300 text-sm leading-relaxed mt-4 italic relative z-10">
                  By shorting the OTM wing, you completely strip the "Fear Premium" out of your directional bet. You are betting purely on physical movement (Delta), not emotion.
               </p>
            </div>
         </div>
       `
    },
    {
       heading: "5. Return on Capital (ROC) Mastery",
       content: `
         <div class="bg-gradient-to-l from-[#0B1120] to-[#1e1b4b] p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden text-left shadow-2xl mb-8">
            <h4 class="text-white font-black text-2xl tracking-tight mb-4 border-b border-indigo-500/20 pb-4">Capital Efficiency</h4>
            
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
               A Naked 22,000 PE costs ₹9,000 per lot. If Nifty drops to 21,800 on expiry (A massive move!), that Put is intrinsically worth ₹10,000. <strong>You risked ₹9,000 to profit exactly ₹1,000 (+11% ROI).</strong>
            </p>
            
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
               By capping your profits with a 21,800 Short Put, you reduced your entry cost to just ₹5,000. When Nifty drops to 21,800 on expiry, your spread reaches maximum profit (200 point spread × 50 lot size = ₹10,000 payload value).
            </p>

            <div class="bg-indigo-500/20 p-5 rounded-xl border border-indigo-500/40 text-center text-indigo-100 font-bold text-xl">
               You risked ₹5,000 to profit ₹5,000 (+100% ROI).
            </div>

            <p class="text-slate-400 text-sm text-center italic mt-6">
               By capping the "Theoretical Infinite Upside" that almost never happens anyway, you mathematically doubled your physical Return on Capital for the exact same market move.
            </p>
         </div>
       `
    }
  ]
};

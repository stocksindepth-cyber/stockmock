export const ironButterflyContent = {
  title: "Iron Butterfly: The Precision Strike",
  meta: "Master the Iron Butterfly Strategy. Learn why traders compress the Iron Condor wings into a single 'Tent', sacrificing probability of profit for explosive premium collection.",
  sections: [
    {
       heading: "1. Condor vs Butterfly",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If the Iron Condor is a wide, comfortable bridge across a river, the <strong>Iron Butterfly</strong> is a tightrope. Both are risk-defined, delta-neutral strategies designed to farm Theta decay in a sideways market. However, they structure their risk very differently.</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">Instead of selling an OTM Call and an OTM Put to create a wide horizontal flat plateau, an Iron Butterfly trader <strong>sells the exact same At-The-Money (ATM) strike twice</strong> (Both the Call and the Put). They then buy OTM wings to define the risk.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-black/40 border border-white/5 p-6 rounded-xl shadow-inner relative">
               <div class="absolute right-4 top-4 text-emerald-500/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
               </div>
               <h4 class="text-emerald-400 font-bold mb-3">The Iron Condor (Wide)</h4>
               <ul class="text-slate-300 font-mono text-xs space-y-2 mb-4">
                  <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy</span> 21,500 PE (Wing)</li>
                  <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell</span> 21,800 PE (Body)</li>
                  <li class="border-t border-white/10 my-2 pt-2"></li>
                  <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell</span> 22,200 CE (Body)</li>
                  <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy</span> 22,500 CE (Wing)</li>
               </ul>
               <p class="text-slate-400 text-sm leading-relaxed border-t border-emerald-500/30 pt-3">
                 <strong>Result:</strong> 400 point wide flat profit zone. High probability (~70%), but collects very low net premium.
               </p>
            </div>
            
            <div class="bg-[#0B1120] border border-indigo-500/30 p-6 rounded-xl shadow-inner relative">
               <div class="absolute right-4 top-4 text-indigo-500/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               </div>
               <h4 class="text-indigo-400 font-bold mb-3">The Iron Butterfly (Pin)</h4>
               <ul class="text-slate-300 font-mono text-xs space-y-2 mb-4">
                  <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy</span> 21,500 PE (Wing)</li>
                  <li class="border-t border-white/10 my-2 pt-2"></li>
                  <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell</span> <strong class="text-white">22,000 PE</strong> (ATM Body)</li>
                  <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell</span> <strong class="text-white">22,000 CE</strong> (ATM Body)</li>
                  <li class="border-t border-white/10 my-2 pt-2"></li>
                  <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy</span> 22,500 CE (Wing)</li>
               </ul>
               <p class="text-slate-400 text-sm leading-relaxed border-t border-indigo-500/30 pt-3">
                 <strong>Result:</strong> A sharp "Tent" profit zone. Lower probability (~35%), but collects absolutely massive net premium upfront.
               </p>
            </div>
         </div>
       `
    },
    {
       heading: "2. Visualizing The Tent",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Because the Iron Butterfly trader sells the ATM strikes, they are effectively selling the most expensive Extrinsic Value on the entire option chain (as covered in the Theta module). This means the initial Credit collected is massive, completely restructuring the payoff geometry.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-rose-500/20 relative overflow-hidden text-center shadow-xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Iron Butterfly Payoff Graph</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="250" viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGradTent" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.5"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGradTent" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.5"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="150" x2="580" y2="150" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="140" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Profit Zone Polygon (The Tent) -->
                 <polygon points="200,150 300,40 400,150" fill="url(#profitGradTent)"/>
                 <path d="M 200,150 L 300,40" stroke="#10B981" stroke-width="3"/>
                 <path d="M 300,40 L 400,150" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- Max Profit Pin Label -->
                 <circle cx="300" cy="40" r="6" fill="#10B981"/>
                 <text x="300" y="25" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹15,000</text>
                 <text x="300" y="80" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Exact Pin @ 22,000</text>
                 
                 <!-- Loss Zone Polygon (Left Floor) -->
                 <polygon points="60,220 200,150 200,220" fill="url(#lossGradTent)"/>
                 <path d="M 60,220 L 200,150" stroke="#F43F5E" stroke-width="3"/>
                 <!-- Left Hard Floor line representing the long put wing -->
                 <path d="M 20,220 L 60,220" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Loss Zone Polygon (Right Floor) -->
                 <polygon points="400,150 540,220 400,220" fill="url(#lossGradTent)"/>
                 <path d="M 400,150 L 540,220" stroke="#F43F5E" stroke-width="3"/>
                 <!-- Right Hard Floor line representing the long call wing -->
                 <path d="M 540,220 L 580,220" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Max Loss Labels -->
                 <text x="100" y="240" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">Max Risk: ₹10,000</text>
                 <text x="500" y="240" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">Max Risk: ₹10,000</text>
              </svg>
            </div>
            
            <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mt-4">
              Notice the geometry. There is no flat plateau bridging a 400 point gap. To achieve Maximum Profit, Nifty must <strong>"Pin"</strong> perfectly at exactly 22,000 at Thursday 3:30 PM. For every single point Nifty diverges from the apex, you bleed profitability.
            </p>
         </div>
       `
    },
    {
       heading: "3. The Greek Matrix: Massive Gamma Risk",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Because you are structurally clustered exactly At-The-Money, the Greek profile of an Iron Butterfly is far more volatile than a wide Iron Condor.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <!-- Theta -->
            <div class="bg-black/60 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
               <h5 class="text-emerald-400 font-bold mb-2 text-lg">Peak Theta Engine</h5>
               <p class="text-slate-400 text-sm leading-relaxed">Since ATM options inherently hold the absolute highest extrinsic value on the board, selling two of them simultaneously creates an absolute Theta monster. Within 12 hours of placing the trade, your P&L will rapidly expand green if the market stalls.</p>
            </div>
            
            <!-- Vega -->
            <div class="bg-black/60 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
               <h5 class="text-amber-400 font-bold mb-2 text-lg">Extreme IV Crush Harvest</h5>
               <p class="text-slate-400 text-sm leading-relaxed">Most professional traders only execute Butterflies specifically on Wednesday afternoons before major Thursday morning gap events (like the RBI policy) to exclusively harvest the massive drop in Vega that occurs at 10:00 AM.</p>
            </div>
            
            <!-- Gamma -->
            <div class="bg-black/60 p-6 rounded-2xl border border-rose-500/20 shadow-lg">
               <h5 class="text-rose-400 font-bold mb-2 text-lg">Catastrophic Gamma Exposure</h5>
               <p class="text-slate-400 text-sm leading-relaxed">This is the cost of the trade. If Nifty aggressively moves 1% in either direction halfway through Thursday, the ATM Delta will rapidly shift from 0.50 to 0.85 (Massive Gamma acceleration). You will slide down the tent extraordinarily fast.</p>
            </div>
         </div>
       `
    },
    {
       heading: "4. The \"Risk-To-Reward\" Illusion",
       content: `
         <div class="bg-indigo-900/10 p-8 rounded-2xl border border-indigo-500/20 relative overflow-hidden text-left shadow-2xl mb-8">
            <h4 class="text-indigo-400 font-black text-2xl tracking-tight mb-4 flex items-center gap-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818CF8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
               The Retail Trap
            </h4>
            
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
               When a new options trader builds an Iron Condor, they see their Max Profit is ₹4,000 and Max Risk is ₹21,000 (1:5 ROI). When they build an Iron Butterfly, they see their Max Profit is ₹15,000 and Max Risk is ₹10,000 (1.5:1 ROI).
            </p>
            <p class="text-slate-300 text-lg leading-relaxed mb-6 font-bold text-rose-400">
               They immediately assume the Butterfly is the superior trade. This is a fatal misconception.
            </p>
            
            <p class="text-slate-300 leading-relaxed text-sm bg-black/40 p-5 rounded-xl border border-indigo-500/30">
               <strong>The reality:</strong> The Butterfly appears to have better risk-reward only because the Probability of hitting the apex of the tent is virtually 0%. A professional trader NEVER expects to capture the "Pin" max profit. They expect to capture 10% to 20% of the total tent value via rapid theta decay early in the week, and immediately exit the trade before Gamma risk activates on Expiry Day.
            </p>
         </div>
       `
    }
  ]
};

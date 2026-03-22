export const batmanSpreadContent = {
  title: "The Batman Strategy: Mastering the Double Ratio",
  meta: "Learn the Batman Options Strategy. A professional institutional architecture that builds a massive zero-risk profit tent that visually perfectly mimics the Batman logo.",
  sections: [
    {
       heading: "1. The Physics of the Double Ratio",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you want to trade like a true quantitative hedge fund, you must move beyond flat 1:1 spreads like Iron Condors. The <strong>Batman Strategy</strong> (technically an Iron Double Ratio Spread) leverages asymmetric quantities to create a "Zero Risk" baseline with explosive upside on the edges.</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">Unlike an Iron Condor where you Sell 1 Lot and Buy 1 Lot, the Batman Strategy intentionally unbalances the ratio to finance the trade. You buy the immediate At-The-Money (ATM) strikes, and you sell double the quantity of Out-of-The-Money (OTM) strikes.</p>
         
         <div class="bg-gradient-to-r from-[#0B1120] to-[#022c22] border border-emerald-500/30 p-8 rounded-2xl mb-12 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
            <div class="absolute -right-6 -top-6 opacity-10">
               <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            
            <h3 class="text-emerald-400 font-bold text-xl mb-4">The 1:2 Architecture</h3>
            <p class="text-slate-300 mb-6 leading-relaxed text-sm">Assume Nifty is at exactly 22,000. You deploy the Batman on a Thursday for the next Expiry.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                  <h5 class="text-emerald-300 font-bold mb-2 border-b border-emerald-500/20 pb-2">The Call Wing (Upside)</h5>
                  <ul class="font-mono text-xs text-slate-300 space-y-2 mb-2">
                     <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy 1x</span> 22,000 CE (Pay ₹200)</li>
                     <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell 2x</span> 22,200 CE (Collect ₹110 x 2 = ₹220)</li>
                  </ul>
                  <div class="text-emerald-400 text-xs font-bold pt-1">Net Credit: +₹20</div>
               </div>
               
               <div class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                  <h5 class="text-emerald-300 font-bold mb-2 border-b border-emerald-500/20 pb-2">The Put Wing (Downside)</h5>
                  <ul class="font-mono text-xs text-slate-300 space-y-2 mb-2">
                     <li><span class="text-rose-400 bg-rose-500/10 px-1 rounded">Buy 1x</span> 22,000 PE (Pay ₹200)</li>
                     <li><span class="text-emerald-400 bg-emerald-500/10 px-1 rounded">Sell 2x</span> 21,800 PE (Collect ₹110 x 2 = ₹220)</li>
                  </ul>
                  <div class="text-emerald-400 text-xs font-bold pt-1">Net Credit: +₹20</div>
               </div>
            </div>
            
            <div class="mt-4 bg-emerald-900/20 p-3 rounded font-mono text-sm border-l-4 border-emerald-500 text-emerald-100">
               <strong>Total Entry Math:</strong> You entered a massive positional trade, but your execution literally deposited <strong>+₹40 Total Credit</strong> directly into your account upfront.
            </div>
         </div>
       `
    },
    {
       heading: "2. Visualizing The Batman Logo (The Payoff)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you chart the 1:2:2:1 mathematical payoff we just constructed, you will immediately see why algorithmic traders gave this strategy its iconic name. The payoff graph physical manifests as the "Ears" of the Batman logo.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-slate-700/50 relative overflow-hidden text-center shadow-2xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Batman Payoff Map</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGradBatman" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.4"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGradBatman" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.4"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="180" x2="580" y2="180" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="170" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Profit Zone Polygon (The Batman Ears) -->
                 <!-- Assuming Center is 300. Left ear apex at 200, right ear apex at 400 -->
                 <polygon points="120,180 200,60 300,165 400,60 480,180" fill="url(#profitGradBatman)"/>
                 
                 <!-- Left Ear Line -->
                 <path d="M 120,180 L 200,60" stroke="#10B981" stroke-width="3"/>
                 <!-- Left Drop to Center Valley -->
                 <path d="M 200,60 L 300,165" stroke="#10B981" stroke-width="3"/>
                 <!-- Right Climb to Ear -->
                 <path d="M 300,165 L 400,60" stroke="#10B981" stroke-width="3"/>
                 <!-- Right Drop to BE -->
                 <path d="M 400,60 L 480,180" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- Loss Zone Polygon (Left Crash) -->
                 <polygon points="40,260 120,180 120,260" fill="url(#lossGradBatman)"/>
                 <path d="M 40,260 L 120,180" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Loss Zone Polygon (Right Rally) -->
                 <polygon points="480,180 560,260 480,260" fill="url(#lossGradBatman)"/>
                 <path d="M 480,180 L 560,260" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Labels -->
                 <!-- Center Valley -->
                 <circle cx="300" cy="165" r="5" fill="#10B981"/>
                 <text x="300" y="200" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">22,000 (Market Stalls)</text>
                 <text x="300" y="215" fill="#10B981" font-size="12" font-weight="bold" text-anchor="middle">Profit: ₹2,000 (Initial Credit)</text>
                 
                 <!-- Left Ear Apex -->
                 <circle cx="200" cy="60" r="5" fill="#10B981"/>
                 <text x="200" y="45" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹12,000</text>
                 <text x="200" y="80" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">21,800 PE Spike</text>
                 
                 <!-- Right Ear Apex -->
                 <circle cx="400" cy="60" r="5" fill="#10B981"/>
                 <text x="400" y="45" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹12,000</text>
                 <text x="400" y="80" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">22,200 CE Spike</text>
                 
                 <!-- Death Zones -->
                 <text x="80" y="230" fill="#F43F5E" font-size="14" font-weight="bold" text-anchor="middle">V-Crash Risk</text>
                 <text x="520" y="230" fill="#F43F5E" font-size="14" font-weight="bold" text-anchor="middle">V-Rally Risk</text>
              </svg>
            </div>
            
            <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mt-4">
              Look closely at the "Valley" in the center where Nifty opened at 22,000. Unlike a Straddle where staying in exactly one spot prints money, in a Batman, if the market stalls completely, you just collect your initial ₹40 entry credit (The Valey Floor). The true power of the Batman is exposed when the market <strong>makes a moderate directional move (e.g. ±1%).</strong> Your Profit scales aggressively to the apex of the Ear!
            </p>
         </div>
       `
    },
    {
       heading: "3. Trap: The \"Double Sell\" Risk",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">No strategy is perfect. To finance the massive probability tent of the Batman, you had to sell TWO options for every ONE option you bought. This mathematical ratio carries a massive hidden vulnerability: <strong>Naked Gamma Risk.</strong></p>
         
         <div class="bg-rose-900/10 border border-rose-500/30 p-8 rounded-2xl mb-8 relative border-l-4">
            <h4 class="text-rose-400 font-bold text-xl mb-3 flex items-center gap-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
               The "V-Shape" Disaster
            </h4>
            
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
               If Nifty moves up exactly 200 points to 22,200, you hit your right Ear apex and score Max Profit. You are ecstatic. But what if the RBI cuts interest rates suddenly, and Nifty violently gaps up 1,000 points to 23,000?
            </p>
            
            <div class="bg-black/40 p-5 rounded-xl border border-white/5 font-mono text-sm space-y-3">
               <div class="text-emerald-400 border-b border-emerald-500/20 pb-2">
                 Your <strong>Buy 1x 22,000 CE</strong> is deeply In-The-Money. It yields massive profit. (+1,000 points)
               </div>
               <div class="text-rose-400">
                 However, your <strong>Sell 2x 22,200 CE</strong> is also deeply In-The-Money. You literally sold two contracts to finance the trade. (-800 points × 2 = -1,600 points)
               </div>
               <div class="text-white font-bold bg-rose-500/20 px-3 py-2 rounded mt-2">
                 Net Result: You are bleeding -600 points of raw unhedged debt. Your account will blow up.
               </div>
            </div>
            
            <p class="text-slate-300 text-sm leading-relaxed mt-4 italic text-rose-300">
               Rule of Thumb: Never hold a Ratio Spread completely to Expiry if a volatile event is scheduled. You must actively manage the untested wing.
            </p>
         </div>
       `
    },
    {
       heading: "4. The Ultimate Hedge for VIX IV Crush",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If the danger of Black Swans is so high, why do algorithmic funds deploy the Batman so aggressively? Because of its devastating efficiency against Implied Volatility (IV).</p>
         
         <div class="bg-slate-900/50 p-6 rounded-xl border border-white/10 shadow-xl mb-6">
            <h5 class="text-white font-bold mb-3 tracking-wide">The "Pre-Budget" Architecture</h5>
            <ol class="list-decimal list-inside space-y-3 text-slate-300 text-sm leading-relaxed">
               <li>The day before the Union Budget, India VIX is artificially pumped to 26.0.</li>
               <li>Option Sellers are terrified to sell Iron Condors because they might hit max loss on a gap.</li>
               <li>Option Buyers are terrified to buy Straddles because they know IV Crush will melt the premiums even if they get the direction right.</li>
               <li><strong>The Quant executes a Batman.</strong> Because they are selling 4 total OTM options (2 Calls, 2 Puts) and only buying 2 total ATM options, their <strong>Vega profile is heavily negative</strong>.</li>
               <li>Result: The next morning, when the Finance Minister speaks and VIX collapses from 26 down to 18, <strong>the massive IV Crush physically prints thousands of rupees, forcing the entire Batman structure into maximum profitability instantly.</strong></li>
            </ol>
         </div>
         <p class="text-slate-400 text-sm text-center">Mastering the Batman effectively grants you immunity to IV Crush while retaining directional elasticity.</p>
       `
    }
  ]
};

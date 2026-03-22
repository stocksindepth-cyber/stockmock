export const ratioSpreadsContent = {
  title: "Ratio Spreads: The Quant's Directional Edge",
  meta: "Master Ratio Spreads (1:2 and 1:3). Learn how to eliminate upfront entry costs by selling multiple OTM options to finance a single ATM directional bet.",
  sections: [
    {
       heading: "1. Moving Beyond the 1:1 Symmetrical Spread",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Traditional spreads (like the Bull Call or Iron Condor) are perfectly symmetrical. For every 1 Option you Buy, you Sell exactly 1 Option. This 1:1 ratio is extremely safe, but it fundamentally requires you to either pay a "Net Debit" (risking capital) or accept a "Hard Profit Ceiling."</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">Institutional quants hate paying entry debits. To solve this, they deploy the <strong>Ratio Spread</strong>. Instead of trading 1:1, they unbalance the trade geometrically—usually <strong>buying 1 ATM option and selling 2 or 3 OTM options.</strong></p>

         <div class="bg-gradient-to-br from-[#0B1120] to-[#1e1b4b] border border-indigo-500/30 p-8 rounded-2xl mb-12 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-indigo-500/10">
               <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            
            <h3 class="text-indigo-400 font-bold text-xl mb-4">The "Zero Cost" Entry Philosophy</h3>
            <p class="text-slate-300 mb-6 leading-relaxed text-sm">Assume Nifty is at 22,000. You are moderately bullish but refuse to risk your own capital on a directional bet.</p>
            
            <ul class="text-slate-300 font-mono text-sm space-y-4">
               <li class="flex items-center gap-3">
                  <span class="bg-rose-500/20 text-rose-300 px-3 py-1 rounded">Buy 1x</span> 22,000 CE @ <strong>₹150</strong> (Cost = -₹150)
               </li>
               <li class="flex items-center gap-3">
                  <span class="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded">Sell 2x</span> 22,300 CE @ <strong>₹85</strong> (Credit = +₹170)
               </li>
            </ul>
            
            <div class="mt-6 bg-indigo-500/20 p-4 rounded-xl border border-indigo-500/40 text-center text-indigo-100 font-bold text-lg">
               Net Entry Cost: <span class="text-emerald-400">+₹20 Credit</span>
            </div>
            
            <p class="text-slate-400 text-sm mt-4 italic font-mono text-center">
               You just bought massive upside exposure, but instead of paying ₹150, the market literally paid you ₹20 to take the trade.
            </p>
         </div>
       `
    },
    {
       heading: "2. The Mathematical Payoff (The Hook)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">There is no free lunch in options. By selling TWO Calls (22,300 CE) to finance ONE Call (22,000 CE), you have taken on Naked Gamma Risk. The payoff graph looks like a massive hook that falls off a cliff.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-slate-700/50 relative overflow-hidden text-center shadow-xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The 1:2 Call Ratio Spread Payoff</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="250" viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGradRatio" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.4"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGradRatio" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.4"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="160" x2="580" y2="160" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="150" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Downside Flat Profit (The Initial Credit) -->
                 <polygon points="40,140 200,140 200,160 40,160" fill="url(#profitGradRatio)"/>
                 <path d="M 40,140 L 200,140" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- Upside Profit Spike (The Tent) -->
                 <polygon points="200,160 200,140 350,40 500,160" fill="url(#profitGradRatio)"/>
                 <path d="M 200,140 L 350,40" stroke="#10B981" stroke-width="3"/>
                 <path d="M 350,40 L 500,160" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- The Death Drop (Naked Gamma) -->
                 <polygon points="500,160 560,240 500,240" fill="url(#lossGradRatio)"/>
                 <path d="M 500,160 L 560,240" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Labels -->
                 <circle cx="200" cy="140" r="5" fill="#10B981"/>
                 <text x="200" y="125" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Buy 22k CE (Base)</text>
                 
                 <!-- Apex Target -->
                 <circle cx="350" cy="40" r="5" fill="#10B981"/>
                 <text x="350" y="25" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹15,000</text>
                 <text x="350" y="65" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Pin @ 22,300 CE</text>
                 
                 <!-- Right Breakeven -->
                 <circle cx="500" cy="160" r="5" fill="#F43F5E"/>
                 <text x="500" y="180" fill="#F43F5E" font-size="11" text-anchor="middle" class="font-mono">Upper BE: 22,600</text>
                 <text x="540" y="210" fill="#F43F5E" font-size="14" font-weight="bold" text-anchor="middle">Infinite Risk</text>
              </svg>
            </div>
            
            <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mt-4">
              Look closely at the left side of the chart. If you are dead wrong about the direction and the market crashes 1,000 points... <strong>you still make money.</strong> All options expire worthless, and you keep your initial ₹20 net credit. Your only enemy is a catastrophic "Black Swan" melt-up that violently breaches your 22,600 upper breakeven where the naked 2nd Sell contract drags you to zero.
            </p>
         </div>
       `
    },
    {
       heading: "3. Decoding the T-0 Line (The Greek Trap)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">A novice looks at the Ratio Spread payoff graph and thinks: "Incredible, I'll just hold it to Expiry and try to hit the exact 22,300 pin strike for ₹15,000 pure profit." A Quant looks at the graph and immediately maps out the <strong>T-0 (Today) Gamma risk.</strong></p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div class="bg-black/60 p-6 rounded-2xl border border-rose-500/20 shadow-lg relative overflow-hidden group">
               <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
               </div>
               <h5 class="text-rose-400 font-bold mb-3">The Gamma Problem</h5>
               <p class="text-slate-400 text-sm leading-relaxed mb-4">
                  Because you sold 2 contracts to buy 1 contract, your total position is mathematically <strong>Negative Vega</strong> and <strong>Negative Gamma</strong> exactly at the strike point. If Nifty rips violently past your 22,300 Short Strikes on Tuesday, the double Gamma acceleration of your short legs will instantly violently overpower your single Long Call.
               </p>
               <div class="bg-rose-500/10 p-2 rounded border border-rose-500/20 text-xs font-mono text-rose-300">
                  Paper M2M loss will hit you immediately even though Expiry Payoff is still green.
               </div>
            </div>
            
            <div class="bg-black/60 p-6 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden group">
               <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               </div>
               <h5 class="text-emerald-400 font-bold mb-3">The Theta Solution</h5>
               <p class="text-slate-400 text-sm leading-relaxed mb-4">
                  As long as Nifty crawls up slowly toward the 22,300 strike without triggering extreme Gamma acceleration, your heavily <strong>Positive Theta</strong> (derived from selling two OTM options) dominates the trade. Every day that passes, the T-0 line aggressively pulls upward toward the ultimate Tent payload.
               </p>
               <div class="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 text-xs font-mono text-emerald-300">
                  You are farming Theta and Delta simultaneously in a controlled burn.
               </div>
            </div>
         </div>
       `
    },
    {
       heading: "4. Front Ratio vs Back Ratio",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Execution ratios can be inverted perfectly depending on your Vega (Implied Volatility) forecast for the coming week.</p>
         
         <div class="space-y-6 mb-8">
            <div class="bg-slate-900/40 border-l-4 border-indigo-500 p-6 rounded-r-xl">
               <h4 class="text-indigo-400 font-bold text-lg mb-2">Front Ratio Spread (1:2)</h4>
               <p class="text-slate-400 text-sm leading-relaxed mb-3">You buy 1 ATM Call, Sell 2 OTM Calls. (The standard spread discussed above).</p>
               <ul class="font-mono text-xs space-y-2 text-slate-300">
                  <li><strong>Credit/Debit:</strong> Generates Upfront Credit.</li>
                  <li><strong>Vega Profile:</strong> Short Vega & Short Gamma.</li>
                  <li><strong>Playbook:</strong> Deploy when you expect a SLOW, grinding rally into decreasing IV. Absolutely never deploy before major explosive news events.</li>
               </ul>
            </div>
            
            <div class="bg-slate-900/40 border-l-4 border-amber-500 p-6 rounded-r-xl">
               <h4 class="text-amber-400 font-bold text-lg mb-2">Back Ratio Spread (2:1 or 3:1)</h4>
               <p class="text-slate-400 text-sm leading-relaxed mb-3">You Sell 1 ATM Put, and BUY 3 deeply OTM Puts. (Often executed for a net-zero cost).</p>
               <ul class="font-mono text-xs space-y-2 text-slate-300">
                  <li><strong>Credit/Debit:</strong> Usually costs zero upfront.</li>
                  <li><strong>Vega Profile:</strong> Massively Long Vega & Long Gamma.</li>
                  <li><strong>Playbook:</strong> Deploy purely for <strong>Black Swan Hunting</strong>. Cost you almost nothing to hold. If the market stays flat, you lose ₹0. If the market crashes violently, your 3x Long Puts violently accelerate past your 1x Short Put, yielding explosive infinite returns.</li>
               </ul>
            </div>
         </div>
       `
    }
  ]
};

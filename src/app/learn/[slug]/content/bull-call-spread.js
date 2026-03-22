export const bullCallSpreadContent = {
  title: "Bull Call Spread: The Smart Directional Play",
  meta: "Master the Bull Call Spread (Debit Spread). Learn why professional traders refuse to buy Naked Calls, and instead use Call vertical spreads to eliminate Theta drag and survive IV Crush.",
  sections: [
    {
       heading: "1. The Folly of the Naked Call",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Every new options trader makes the exact same mistake. They look at a chart, identify a strong breakout on Reliance, and immediately buy a Naked Call Option because they want "unlimited upside."</p>
         
         <div class="bg-rose-900/10 border-l-4 border-rose-500 p-6 rounded-xl relative shadow-inner group mb-8">
            <h4 class="text-rose-400 font-bold text-xl mb-4">The Extrinsic Value Trap</h4>
            <ul class="space-y-3 font-mono text-sm text-slate-300 mb-4">
               <li><span class="text-slate-500">Reliance Spot:</span> ₹2,900</li>
               <li><span class="text-slate-500">Trader Buys:</span> 3,000 CE @ ₹40 Premium</li>
               <li><span class="text-slate-500">Lot Size:</span> 250 (Total Cost = ₹10,000)</li>
            </ul>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
               The trader expects Reliance to go up to ₹2,950 and make money. But what actually happens? Reliance slowly grinds up to ₹2,950 over 10 days. The trader opens their P&L expecting a massive profit, but the ₹40 premium has <strong>cratered to ₹15</strong>. Why? Because while the Delta gained ₹10 of value, <strong>Theta destroyed ₹35 of extrinsic value over the 10 days.</strong> The trader was right about the direction, but wrong about the math.
            </p>
         </div>

         <p class="text-slate-300 leading-relaxed mb-8">Professional traders know that Extrinsic Value is a mathematical anchor. To solve this, they execute a <strong>Bull Call Spread (A Debit Spread)</strong>.</p>
       `
    },
    {
       heading: "2. Constructing the Architecture",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">A Bull Call Spread is a 2-leg strategy where you simultaneously buy a Call Option, and sell another Call Option sitting further away (at a higher strike). The premium collected from selling the second leg physically pays for the first let.</p>
         
         <div class="bg-[#0B1120] border border-emerald-500/30 p-8 rounded-2xl mb-10 relative overflow-hidden shadow-2xl">
            <div class="absolute -right-6 -top-6 text-emerald-500/10">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            
            <h4 class="text-emerald-400 font-bold mb-6 text-xl">Building the Trade</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               <div class="bg-black/40 border border-white/5 p-5 rounded-xl shadow-inner">
                  <div class="flex justify-between items-center mb-3">
                     <span class="text-emerald-300 font-bold">Leg 1: The Engine</span>
                     <span class="bg-rose-500/20 text-rose-300 px-2 py-1 text-xs rounded font-mono border border-rose-500/30">Debit</span>
                  </div>
                  <ul class="text-slate-300 font-mono text-sm space-y-2">
                     <li>Buy 22,000 CE (ATM)</li>
                     <li>Pay Premium: <strong>-₹150</strong></li>
                  </ul>
                  <p class="text-slate-400 text-xs mt-3">This is the standard naked call. It gives us positive Delta (upside exposure) but massive negative Theta drag.</p>
               </div>
               
               <div class="bg-black/40 border border-white/5 p-5 rounded-xl shadow-inner">
                  <div class="flex justify-between items-center mb-3">
                     <span class="text-emerald-300 font-bold">Leg 2: The Financier</span>
                     <span class="bg-emerald-500/20 text-emerald-300 px-2 py-1 text-xs rounded font-mono border border-emerald-500/30">Credit</span>
                  </div>
                  <ul class="text-slate-300 font-mono text-sm space-y-2">
                     <li>Sell 22,200 CE (OTM)</li>
                     <li>Collect Premium: <strong>+₹60</strong></li>
                  </ul>
                  <p class="text-slate-400 text-xs mt-3">By selling this option to someone else, we collect raw cash to subsidize our expensive Leg 1 purchase.</p>
               </div>
            </div>
            
            <div class="mt-6 bg-black/60 p-4 rounded-xl border-l-4 border-emerald-500 font-mono text-sm flex flex-wrap gap-4 items-center">
               <div class="text-slate-300">Total Net Cost = </div>
               <div class="text-white">-₹150 (Paid)</div>
               <div class="text-white">+</div>
               <div class="text-white">+₹60 (Collected)</div>
               <div class="text-emerald-400 font-bold text-lg">= ₹90 Max Risk</div>
            </div>
         </div>
       `
    },
    {
       heading: "3. Visualizing the Roof",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">The catch is that by selling the 22,200 Call, you have officially capped your profits. If Nifty rips to 23,000, you are mathematically locked in at the 22,200 ceiling. You traded "unlimited infinite upside" for drastically improved mathematical probabilities.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-slate-700/50 relative overflow-hidden text-center shadow-xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Bull Call Spread Payoff Graph</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="250" viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGradBull" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.4"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGradBull" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.4"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="125" x2="580" y2="125" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="115" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Loss Zone Polygon (Left Base) -->
                 <polygon points="40,200 240,200 315,125 40,125" fill="url(#lossGradBull)"/>
                 <path d="M 40,200 L 240,200" stroke="#F43F5E" stroke-width="3"/>
                 <path d="M 240,200 L 315,125" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Profit Zone Polygon (Right Roof) -->
                 <polygon points="315,125 400,40 560,40 560,125" fill="url(#profitGradBull)"/>
                 <path d="M 315,125 L 400,40" stroke="#10B981" stroke-width="3"/>
                 <path d="M 400,40 L 560,40" stroke="#10B981" stroke-width="3"/>
                 
                 <!-- Labels -->
                 <!-- Long Call Leg -->
                 <circle cx="240" cy="200" r="5" fill="#F43F5E"/>
                 <text x="240" y="225" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Buy 22,000 CE</text>
                 <text x="240" y="240" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">Max Risk: ₹4,500</text>
                 
                 <!-- Breakeven -->
                 <circle cx="315" cy="125" r="5" fill="#94A3B8"/>
                 <text x="315" y="105" fill="#94A3B8" font-size="11" text-anchor="middle" class="font-mono">BE: 22,090</text>
                 
                 <!-- Short Call Leg -->
                 <circle cx="400" cy="40" r="5" fill="#10B981"/>
                 <text x="400" y="25" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹5,500</text>
                 <text x="400" y="70" fill="#E2E8F0" font-size="11" text-anchor="middle" class="font-mono">Sell 22,200 CE</text>
              </svg>
            </div>
          </div>
       `
    },
    {
       heading: "4. The Greek Matrix: Immunity to Time",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Why give up unlimited profit? Because the math of the Greeks demands it. When you construct a vertical spread, the opposing legs magically neutralize the deadliest threats in the market.</p>
         
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div class="bg-black/60 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
               <h5 class="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Neutralizing Theta Decay
               </h5>
               <ul class="text-slate-400 text-sm space-y-3 font-mono">
                  <li><span class="text-rose-400 font-bold">Buy 22k CE:</span> Loses ₹15 a day.</li>
                  <li><span class="text-emerald-400 font-bold">Sell 22.2k CE:</span> Collects ₹12 a day.</li>
                  <li class="border-t border-white/10 pt-2"><span class="text-white font-bold">Net Theta:</span> Only bleeding ₹3 a day!</li>
               </ul>
               <p class="text-slate-300 text-sm leading-relaxed mt-4 italic">
                  You can sit in the trade for an entire week and watch your "Rent" barely move. The Short Call acts as a pure shock-absorber for Time Decay.
               </p>
            </div>
            
            <div class="bg-black/60 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
               <h5 class="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Immunity to IV Crush (Vega)
               </h5>
               <ul class="text-slate-400 text-sm space-y-3 font-mono">
                  <li><span class="text-rose-400 font-bold">Buy 22k CE:</span> Vega drops, loses ₹40.</li>
                  <li><span class="text-emerald-400 font-bold">Sell 22.2k CE:</span> Vega drops, gains ₹35.</li>
                  <li class="border-t border-white/10 pt-2"><span class="text-white font-bold">Net Vega Impact:</span> -₹5</li>
               </ul>
               <p class="text-slate-300 text-sm leading-relaxed mt-4 italic">
                  Event Traders completely abandon naked options during Earnings and exclusively use Debit Spreads. Because Vega is hedged, if the stock goes up, they actually get paid instead of suffering IV Crush.
               </p>
            </div>
         </div>
       `
    },
    {
       heading: "5. When To Use It",
       content: `
         <div class="bg-gradient-to-l from-indigo-900/10 to-emerald-900/10 p-8 rounded-2xl border border-white/10 relative overflow-hidden text-left shadow-2xl mb-8">
            <h4 class="text-white font-black text-2xl tracking-tight mb-4">The Quant Action Plan</h4>
            
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
               Never buy a naked option unless you have explicitly modeled a massive Volatility Explosion. Under normal market regimes, you must force yourself to sell an opposing leg.
            </p>
            
            <div class="space-y-4 font-mono text-sm">
               <div class="bg-black/50 p-4 rounded-xl border-l-2 border-emerald-500 text-slate-300">
                  <strong class="text-emerald-400 text-base">Usage 1: Low Capital Requirements</strong><br/><br/>
                  Unlike Short Strangles which cost ₹1.5L, Debit Spreads only cost the "Net Premium" Paid. You can literally execute a Nifty Bull Call Spread with just ₹4,500 of capital in your account.
               </div>
               
               <div class="bg-black/50 p-4 rounded-xl border-l-2 border-indigo-500 text-slate-300">
                  <strong class="text-indigo-400 text-base">Usage 2: Taming Volatile Assets</strong><br/><br/>
                  Executing directional trades on ultra-volatile underlyings like Tesla or Adani Enterprises is suicide without a hedge. The ceiling protects you from massive VIX compression following unpredictable news drops.
               </div>
            </div>
         </div>
       `
    }
  ]
};

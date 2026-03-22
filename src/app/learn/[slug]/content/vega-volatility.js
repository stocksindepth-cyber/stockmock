export const vegaVolatilityContent = {
  title: "Vega & Volatility: The Engine of Option Pricing",
  meta: "Master Implied Volatility (IV), the India VIX, and Vega. Learn how to survive IV Crush and capitalize on fear premiums surrounding central bank events and earnings.",
  sections: [
    {
       heading: "1. The Concept of Implied Volatility (IV)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you pull up the option chain right now, you might notice that the BankNifty 48,000 Call expires in exactly 15 days, and costs ₹300. Six months ago, you looked at an identical BankNifty option, expiring in exactly 15 days, perfectly At-The-Money, but it only cost ₹180. <strong>Why did the exact same option cost 66% more today?</strong></p>
         
         <p class="text-slate-300 leading-relaxed mb-8">The answer is <strong>Implied Volatility (IV)</strong>. Option prices are not static; they breathe based on the psychological state of the market. IV is the market's mathematical estimation of how violently the index might swing over the life of the option block.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-2xl border border-indigo-500/30 relative">
               <div class="absolute -right-6 -top-6 text-indigo-500/20">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
               </div>
               <h4 class="text-indigo-400 font-bold text-xl mb-2">High IV (The Hurricane)</h4>
               <p class="text-slate-300 text-sm leading-relaxed mb-4">The market is terrified of an upcoming event (Election, Budget, FOMC). Because extreme moves are expected, Option Sellers demand massive premiums to take on the risk. <strong>Options are brutally expensive.</strong></p>
               <div class="bg-indigo-500/10 px-3 py-2 rounded font-mono text-indigo-300 text-xs border border-indigo-500/20">Strategy: Sell Options (Iron Condors)</div>
            </div>
            
            <div class="bg-gradient-to-br from-emerald-900/40 to-black p-8 rounded-2xl border border-emerald-500/30 relative">
               <div class="absolute -right-6 -top-6 text-emerald-500/20">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
               </div>
               <h4 class="text-emerald-400 font-bold text-xl mb-2">Low IV (The Calm Lake)</h4>
               <p class="text-slate-300 text-sm leading-relaxed mb-4">The market is complacent. No major news is expected. The index is moving in tiny 20 point increments daily. Option Sellers collect very little premium because there is no perceived risk. <strong>Options are dirt cheap.</strong></p>
               <div class="bg-emerald-500/10 px-3 py-2 rounded font-mono text-emerald-300 text-xs border border-emerald-500/20">Strategy: Buy Options (Long Straddles)</div>
            </div>
         </div>
       `
    },
    {
       heading: "2. India VIX: The Fear Gauge",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">You cannot directly trade "Implied Volatility", but you can track its general temperature across the entire market using the <strong>India VIX (Volatility Index)</strong>. Created by the NSE, the VIX calculates the blended IV of the near-month Nifty options.</p>
         
         <div class="overflow-x-auto rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 mb-10 mt-6">
            <table class="w-full text-left border-collapse">
               <thead>
                  <tr>
                     <th class="w-1/4 p-5 bg-black text-slate-400 font-bold text-sm tracking-wider uppercase border-b border-r border-white/10">VIX Level</th>
                     <th class="w-1/4 p-5 bg-black text-white font-bold text-sm tracking-wider uppercase border-b border-r border-white/10">Market State</th>
                     <th class="w-1/2 p-5 bg-black text-emerald-400 font-bold text-sm tracking-wider uppercase border-b border-white/10">Option Pricing Impact</th>
                  </tr>
               </thead>
               <tbody class="text-base text-slate-300">
                  <tr class="bg-black/40 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                     <td class="p-5 border-r border-white/5 font-mono text-emerald-400">10.0 to 12.5</td>
                     <td class="p-5 border-r border-white/5">Extreme Complacency</td>
                     <td class="p-5 font-normal text-sm">Premiums are mathematically starved. A 100-wide BankNifty Credit Spread might only yield ₹15. It is dangerous to sell neutral strategies here.</td>
                  </tr>
                  <tr class="bg-amber-500/10 border-b border-white/5 relative z-10 shadow-inner">
                     <td class="p-5 border-r border-amber-500/20 font-mono text-amber-400 font-bold border-l-4 border-l-amber-500">14.0 to 18.0</td>
                     <td class="p-5 border-r border-amber-500/20 text-amber-300 font-bold">Historical Average (Normal)</td>
                     <td class="p-5 font-normal text-sm">The "Goldilocks" zone. Premiums are rich enough to sell Iron Condors for ~₹35 to ₹40 credit, but not so unstable that you fear violent overnight gaps.</td>
                  </tr>
                  <tr class="bg-rose-900/20 hover:bg-rose-900/30 transition-colors">
                     <td class="p-5 border-r border-rose-500/20 font-mono text-rose-400 font-bold font-white">20.0 to 35.0+</td>
                     <td class="p-5 border-r border-rose-500/20 text-rose-400 font-bold">Panic / Crash / Major Event</td>
                     <td class="p-5 font-normal text-sm">Extreme fear. Market is reacting to a black swan or huge elections. Option premiums are massive. Buying options here is extremely toxic due to impending IV Crush.</td>
                  </tr>
               </tbody>
            </table>
         </div>
       `
    },
    {
       heading: "3. Vega (ν): The Speed of Inflation",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you want to know exactly how much money your option will inflate when the VIX spikes, you look at its <strong>Vega</strong>. Vega tells you exactly how much the option premium will gain (or lose) for every 1.0 point increase (or decrease) in Implied Volatility.</p>
         
         <div class="bg-[#0B1120] p-8 rounded-2xl border-l-4 border-purple-500 relative mb-10 shadow-xl overflow-hidden">
            <div class="absolute -right-10 -top-10 opacity-5">
               <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            
            <h4 class="text-purple-400 font-bold text-xl mb-4">The Vega Math Example</h4>
            <ul class="text-slate-300 space-y-3 font-mono text-sm mb-6 bg-black/40 p-5 rounded-lg border border-white/5">
               <li><span class="text-slate-500 uppercase tracking-widest text-xs">Current Nifty Spot:</span> <span class="text-white ml-2">22,000</span></li>
               <li><span class="text-slate-500 uppercase tracking-widest text-xs">You Buy the 22,000 Call at:</span> <span class="text-white ml-2">₹150</span></li>
               <li><span class="text-slate-500 uppercase tracking-widest text-xs">The Option's Vega is:</span> <span class="text-purple-400 font-bold ml-2">12.0</span></li>
            </ul>
            
            <p class="text-slate-300 leading-relaxed mb-4 text-sm">
               Suddenly, news breaks that the RBI is holding an emergency unscheduled press conference. Pure terror floods the street. <strong>India VIX violently spikes up by 5 full points.</strong> Nifty itself has not moved a single inch (it is still sitting perfectly at 22,000).
            </p>
            
            <div class="flex items-center gap-4 bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 font-mono">
               <span class="text-purple-300">New Premium = ₹150 + (5 VIX points × 12 Vega) = </span>
               <span class="text-purple-400 font-bold text-xl">₹210</span>
            </div>
            
            <p class="text-slate-400 leading-relaxed mt-4 text-sm italic">
               You just made a 40% absolute return on your Call Option without the underlying index moving a single point. You captured pure Vega expansion.
            </p>
         </div>
       `
    },
    {
       heading: "4. The Silent Killer: IV Crush",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">The exact inverse of the RBI example above happens constantly to retail traders around predictable scheduled events like Corporate Earnings (Reliance, HDFC Bank) or Government Budgets.</p>
         
         <div class="flex flex-col lg:flex-row gap-8 mb-10 items-center">
            <div class="w-full lg:w-1/2">
               <h4 class="text-rose-400 font-black text-2xl mb-4 tracking-tight">The Earnings Trap</h4>
               <p class="text-slate-300 leading-relaxed mb-4">
                  For 20 days leading up to Reliance's Q4 Earnings report, the Implied Volatility of Reliance options slowly inflates. The options get more and more expensive (Vega expansion). A retail trader buys a naked Reliance Call at 3:25 PM the day before the report, paying a massive ₹60 premium because they expect "huge results."
               </p>
               <p class="text-slate-300 leading-relaxed">
                  The next morning, Reliance opens 1% Green! The retail trader is ecstatic. However, when they check their P&L, <strong>their Call option has imploded from ₹60 down to ₹25.</strong>
               </p>
            </div>
            
            <div class="w-full lg:w-1/2 bg-rose-900/10 border border-rose-500/20 p-6 rounded-2xl relative shadow-xl text-center">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" class="mx-auto mb-4 opacity-70"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
               <h5 class="text-rose-400 font-bold text-xl mb-3">Why did they lose 58%?</h5>
               <p class="text-slate-300 text-sm leading-relaxed mb-4">Because the "Unknown Event" is now in the past. There is no more fear or uncertainty. The Black-Scholes algorithm instantly sucks all the IV out of the options chain at 9:15 AM. The IV drops from 40 down to 18.</p>
               <div class="bg-black/50 p-3 rounded font-mono text-xs text-rose-300 mt-2">
                 Profit from 1% Up Move (+₹15 Delta) <br/>
                 Loss from IV Collapse (-₹50 Vega) <br/>
                 Net Result = Massive Loss
               </div>
            </div>
         </div>
       `
    },
    {
       heading: "5. Institutional Strategy: Short Volatility",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Because implied volatility mathematically always overstates the actual realized volatility (the market prices in a 200 point crash, but it only drops 80 points), <strong>Volatility inherently has a structural risk premium.</strong></p>
         
         <div class="my-8 p-8 bg-gradient-to-br from-[#0B1120] to-black border border-emerald-500/30 rounded-2xl shadow-2xl relative overflow-hidden">
             <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
             
             <h4 class="text-emerald-400 font-black text-xl tracking-tight mb-4">The Quant Playbook</h4>
             <ul class="space-y-4 text-slate-300 text-sm leading-relaxed relative z-10 font-mono">
                <li class="flex items-start gap-3">
                   <div class="bg-emerald-500/20 w-6 h-6 rounded flex items-center justify-center text-emerald-400 shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <span>Wait for VIX to hit historical extremes (e.g., 22.0+ during a geopolitical headline).</span>
                </li>
                <li class="flex items-start gap-3">
                   <div class="bg-emerald-500/20 w-6 h-6 rounded flex items-center justify-center text-emerald-400 shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <span>Execute highly padded Out-Of-The-Money Credit Spreads (like deeply OTM Iron Condors) because the premiums are artificially inflated.</span>
                </li>
                <li class="flex items-start gap-3">
                   <div class="bg-emerald-500/20 w-6 h-6 rounded flex items-center justify-center text-emerald-400 shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <span>Hold the position for exactly 3 to 4 days until the panic subsides and VIX reverts to its 14.0 mean.</span>
                </li>
                <li class="flex items-start gap-3">
                   <div class="bg-emerald-500/20 w-6 h-6 rounded flex items-center justify-center text-emerald-400 shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <span>Buy the positions back strictly to capture the IV Crush, ignoring Theta completely. Close the trade at 60% max profit.</span>
                </li>
             </ul>
         </div>
       `
    }
  ]
};

export const optionsPricingContent = {
  title: "Options Pricing: The Math Behind the Premium",
  meta: "Understand exactly how option prices are calculated. Deep dive into Black-Scholes, Theta decay curves, Implied Volatility (Vega) expansion, and Extrinsic collapse.",
  sections: [
    {
      heading: "1. The Black-Scholes Machine",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">If you look at the Nifty Option Chain and notice that the 22,000 Call is trading at exactly ₹142.50, you must realize that this number is not generated randomly by humans yelling on a trading floor. It is calculated in milliseconds by machines using the <strong>Black-Scholes Mathematical Model</strong>.</p>
        
        <p class="text-slate-300 leading-relaxed mb-8">You do not need to memorize the complex calculus of the Black-Scholes formula to be a profitable trader, but you absolutely must understand its <em>Inputs</em>. If you put 5 pieces of data into the machine, it spits out the exact price the option should be trading at.</p>

        <div class="bg-gradient-to-r from-[#0B1120] to-[#1e1b4b] border border-indigo-500/30 p-8 rounded-2xl mb-12 shadow-[0_0_40px_rgba(99,102,241,0.1)] relative overflow-hidden">
           <div class="absolute -right-20 -top-20 opacity-10">
              <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#818CF8" stroke-width="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
           </div>
           
           <h3 class="text-indigo-400 font-bold text-2xl mb-6">The 5 Inputs of Option Pricing</h3>
           
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-black/40 border border-white/5 p-5 rounded-xl backdrop-blur-sm">
                 <div class="text-emerald-400 font-bold text-lg mb-1 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-sm">1</span> 
                    Spot Price
                 </div>
                 <p class="text-slate-400 text-sm">Where Nifty is currently trading right now. (Creates Delta/Gamma)</p>
              </div>
              <div class="bg-black/40 border border-white/5 p-5 rounded-xl backdrop-blur-sm">
                 <div class="text-slate-300 font-bold text-lg mb-1 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-slate-500/20 flex items-center justify-center text-sm text-slate-400">2</span> 
                    Strike Price
                 </div>
                 <p class="text-slate-400 text-sm">The specific contract level you are looking at (e.g., 22000).</p>
              </div>
              <div class="bg-black/40 border border-amber-500/20 p-5 rounded-xl backdrop-blur-sm">
                 <div class="text-amber-400 font-bold text-lg mb-1 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-sm">3</span> 
                    Time to Expiry
                 </div>
                 <p class="text-slate-400 text-sm">Days remaining until Thursday 3:30 PM. (Creates Theta)</p>
              </div>
              <div class="bg-black/40 border border-rose-500/20 p-5 rounded-xl backdrop-blur-sm">
                 <div class="text-rose-400 font-bold text-lg mb-1 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-rose-500/20 flex items-center justify-center text-sm">4</span> 
                    Implied Volatility
                 </div>
                 <p class="text-slate-400 text-sm">The projected fear/panic in the market. (Creates Vega)</p>
              </div>
              <div class="bg-black/40 border border-white/5 p-5 rounded-xl backdrop-blur-sm">
                 <div class="text-slate-300 font-bold text-lg mb-1 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-slate-500/20 flex items-center justify-center text-sm text-slate-400">5</span> 
                    Interest Rates
                 </div>
                 <p class="text-slate-400 text-sm">Risk-free rate (RBI repo). Usually static and ignored by retail. (Creates Rho)</p>
              </div>
           </div>
        </div>
      `
    },
    {
      heading: "2. The Destruction of Extrinsic Value (Theta Decay)",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">As established in the Moneyness module, Premium = Intrinsic + Extrinsic. The most violent and guaranteed force in the options universe is the destruction of Extrinsic Value via the passage of time.</p>
        
        <p class="text-slate-300 leading-relaxed mb-8"><strong>Theta (Θ)</strong> is the Greek that measures this decay. If Theta is -15, the option premium will mathematically drop by ₹15 tomorrow just by the sun rising, assuming Nifty doesn't move. But Theta decay is not linear; it is exponential. It operates like a melting ice cube placed in an oven on Thursday afternoon.</p>

        <div class="my-10 p-8 bg-[#0B1120] rounded-2xl border border-rose-500/20 relative overflow-hidden text-center shadow-xl">
           <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Non-Linear Theta Decay Curve</h4>
           
           <div class="flex justify-center w-full mb-6">
             <svg width="600" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl">
                <defs>
                   <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.3"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.0"/>
                   </linearGradient>
                </defs>
                
                <!-- Axis -->
                <line x1="60" y1="260" x2="560" y2="260" stroke="#334155" stroke-width="2"/>
                <line x1="60" y1="40" x2="60" y2="260" stroke="#334155" stroke-width="2"/>
                
                <!-- Labels -->
                <text x="310" y="290" fill="#94A3B8" font-size="14" font-weight="bold" text-anchor="middle">Days to Expiration (DTE)</text>
                <text x="25" y="150" fill="#94A3B8" font-size="12" font-weight="bold" transform="rotate(-90 25,150)" text-anchor="middle" tracking="widest">EXTRINSIC VALUE (₹)</text>
                
                <!-- X-Axis Markers (Reverse from 30 to 0) -->
                <text x="80" y="275" fill="#64748B" font-size="12" text-anchor="middle">30</text>
                <text x="200" y="275" fill="#64748B" font-size="12" text-anchor="middle">21</text>
                <text x="320" y="275" fill="#64748B" font-size="12" text-anchor="middle">14</text>
                <text x="440" y="275" fill="#64748B" font-size="12" text-anchor="middle">7</text>
                <text x="540" y="275" fill="#F43F5E" font-size="14" font-weight="bold" text-anchor="middle">0 (Expiry)</text>
                
                <!-- The Decay Line -->
                <path d="M 80,60 Q 320,100 480,200 Q 520,240 540,260" fill="none" stroke="#F43F5E" stroke-width="4" stroke-linecap="round" class="drop-shadow-lg"/>
                <path d="M 80,60 Q 320,100 480,200 Q 520,240 540,260 L 540,260 L 80,260 Z" fill="url(#decayGrad)"/>
                
                <!-- Weekly Grid lines -->
                <line x1="200" y1="60" x2="200" y2="260" stroke="#FFFFFF" stroke-opacity="0.1" stroke-dasharray="4"/>
                <line x1="320" y1="60" x2="320" y2="260" stroke="#FFFFFF" stroke-opacity="0.1" stroke-dasharray="4"/>
                <line x1="440" y1="60" x2="440" y2="260" stroke="#FFFFFF" stroke-opacity="0.1" stroke-dasharray="4"/>
                
                <!-- Annotations -->
                <rect x="440" y="90" width="130" height="40" rx="4" fill="#000" stroke="#F43F5E" stroke-opacity="0.5"/>
                <text x="505" y="115" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">The Expiry Cliff</text>
                
             </svg>
           </div>
           
           <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed border-t border-slate-700/50 pt-5">
             <strong>The Expiry Cliff:</strong> Between Day 30 and Day 14, the option loses only a tiny fraction of its value per day. The slope is gentle. However, in the final 5 days (The Expiry Cliff), the Extrinsic Value plummets aggressively toward zero. This is exactly why Institutions aggressively sell Straddles on Wednesday and Thursday—they are harvesting the steepest part of the waterfall.
           </p>
        </div>
      `
    },
    {
       heading: "3. The Fear Premium: Volatility (Vega)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If Theta is the guaranteed, slow bleed of Time, then <strong>Vega (ν)</strong> is the violent heartbeat of the market. Vega measures how much an option premium will inflate or deflate for every 1% change in Implied Volatility (IV).</p>
         
         <div class="bg-amber-900/10 border border-amber-500/20 p-8 rounded-2xl mb-8 relative">
           <div class="flex items-center gap-4 mb-6">
              <div class="bg-amber-500/20 p-3 rounded-xl text-amber-400">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h4 class="text-amber-400 font-bold text-2xl">The "IV Crush" Phenomenon</h4>
           </div>
           
           <p class="text-slate-300 leading-relaxed mb-6">
              Options are basically insurance policies. When people are terrified of a market crash (e.g., Election Results tomorrow, Union Budget), they aggressively buy Put Options to insure their portfolios. Because <em>Demand</em> for insurance spikes, the <em>Price</em> (Premium) of those options artificially skyrockets—even if Nifty hasn't moved a single point yet!
           </p>
           
           <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/50 p-6 rounded-xl border border-white/5">
              <div class="border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
                 <h5 class="text-emerald-400 font-bold mb-2">Day Before Election</h5>
                 <ul class="text-slate-400 text-sm space-y-2 font-mono">
                    <li>Nifty Spot: 22,000</li>
                    <li>India VIX: <span class="text-amber-400 font-bold">28.0 (Extreme Fear)</span></li>
                    <li>22,000 Call Premium: ₹450</li>
                    <li>22,000 Put Premium: ₹460</li>
                 </ul>
              </div>
              <div class="pt-6 lg:pt-0 lg:pl-6">
                 <h5 class="text-rose-400 font-bold mb-2">Day After Election (10:00 AM)</h5>
                 <ul class="text-slate-400 text-sm space-y-2 font-mono">
                    <li>Nifty Spot: 22,000 (No change)</li>
                    <li>India VIX: <span class="text-emerald-400 font-bold">14.0 (Relief)</span></li>
                    <li>22,000 Call Premium: <span class="text-rose-400 font-bold">₹150 (CRASHED)</span></li>
                    <li>22,000 Put Premium: <span class="text-rose-400 font-bold">₹145 (CRASHED)</span></li>
                 </ul>
              </div>
           </div>
           
           <p class="text-slate-300 leading-relaxed mt-6">
              Retail traders who bought Calls or Puts the day before the election because they expected a "massive move" wake up the next day, see Nifty hasn't moved, and realize their option premiums have literally cratered by 65%. <strong>This is called IV Crush.</strong> The "fear premium" was removed from the price by the Black-Scholes algorithm as soon as the event passed. 
           </p>
         </div>
       `
    },
    {
       heading: "4. The Ultimate Rule of Option Buying vs Selling",
       content: `
         <div class="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <table class="w-full text-left">
               <thead>
                  <tr class="bg-black text-white uppercase text-sm font-bold tracking-wider">
                     <th class="p-5 border-b border-white/10 border-r w-1/3">Market Condition</th>
                     <th class="p-5 border-b border-white/10 border-r w-1/3 text-blue-400">Option Buyer Strategy</th>
                     <th class="p-5 border-b border-white/10 w-1/3 text-purple-400">Option Seller Strategy</th>
                  </tr>
               </thead>
               <tbody class="text-slate-300">
                  <tr class="bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                     <td class="p-5 border-r border-b border-white/5 font-bold">Low VIX (e.g. 10-12)</td>
                     <td class="p-5 border-r border-b border-white/5 leading-relaxed text-sm"><strong>BUY.</strong> Premiums are cheap. Extrinsic bloat is minimal. Great time for Long Straddles or naked directional bets if you predict a breakout.</td>
                     <td class="p-5 border-b border-white/5 leading-relaxed text-sm"><strong>AVOID.</strong> Do not sell Iron Condors. You will collect pennies while exposing yourself to unlimited catastrophic risk if a Black Swan hits.</td>
                  </tr>
                  <tr class="hover:bg-white/[0.05] transition-colors">
                     <td class="p-5 border-r border-white/5 font-bold">High VIX (e.g. 18-25)</td>
                     <td class="p-5 border-r border-white/5 leading-relaxed text-sm"><strong>AVOID.</strong> Buying options here is financial suicide. The premiums are bloated mathematically. You will die to IV Crush even if you get the direction right.</td>
                     <td class="p-5 leading-relaxed text-sm"><strong>SELL.</strong> Write Iron Condors, Short Strangles, and Credit Spreads. Harvest the incredibly fat inflated premiums as the VIX inevitably cools off.</td>
                  </tr>
               </tbody>
            </table>
         </div>
       `
    }
  ]
};

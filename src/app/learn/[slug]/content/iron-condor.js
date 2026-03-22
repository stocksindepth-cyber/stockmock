export const ironCondorContent = {
  title: "Iron Condor: The Ultimate Range Setup",
  meta: "Master the Iron Condor options strategy for range-bound markets. Learn exact setup, adjustments, margins, and quantitative management on NIFTY.",
  sections: [
    {
       heading: "1. The Concept of Non-Directional Trading",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Ask 100 retail traders what the market will do tomorrow, and 50 will say "Up" while 50 will say "Down". If you ask a quantitative institutional trader, they will often say: <em>"I mathematically do not care if it goes up or down, as long as it stays within my statistical 1-Standard Deviation box."</em></p>
         
         <p class="text-slate-300 leading-relaxed mb-8">This is the essence of <strong>Non-Directional (Neutral) Trading</strong>. You are no longer betting on momentum; you are betting on stagnation. Since markets historically spend roughly 65% to 70% of their time chopping in sideways consolidation zones rather than trending, mastering neutral strategies is the Holy Grail of consistent Option Selling.</p>

         <div class="bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-8 rounded-2xl mb-10 text-center">
             <h3 class="text-3xl font-bold text-white tracking-tight mb-2">The Iron Condor</h3>
             <p class="text-blue-400 font-mono text-sm tracking-widest uppercase mb-6">4 Legs • Defined Risk • Theta Positive • Vega Negative</p>
             <p class="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The Iron Condor is the undisputed king of neutral strategies. It allows you to define a massive "Profit Tent" across hundreds of points on the Nifty index, while simultaneously mathematically guaranteeing that a Black Swan crash or parabolic rally cannot blow up your trading account.
             </p>
         </div>
       `
    },
    {
       heading: "2. The Architecture of the Condor",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Constructing an Iron Condor involves seamlessly fusing two distinct Credit Spreads together. You execute all 4 legs simultaneously using a Basket Order.</p>
         
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           <div class="bg-rose-900/10 border border-rose-500/20 p-6 rounded-2xl">
             <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold border border-rose-500/30">1</div>
                <h4 class="text-rose-400 font-bold text-xl">The Roof (Bear Call Spread)</h4>
             </div>
             <p class="text-slate-300 text-sm leading-relaxed mb-4">This protects you strictly on the upside if Nifty rallies.</p>
             <ul class="space-y-3 font-mono text-sm">
                <li class="flex items-center justify-between p-3 bg-rose-500/10 rounded-lg text-rose-300 border border-rose-500/20">
                   <span>SELL OTM Call (e.g. 22,300 CE)</span>
                   <span class="font-bold">+ ₹50 Credit</span>
                </li>
                <li class="flex items-center justify-between p-3 bg-black/40 rounded-lg text-slate-400 border border-white/5">
                   <span>BUY Further OTM Call (e.g. 22,400 CE)</span>
                   <span>- ₹20 Debit</span>
                </li>
                <li class="text-right text-rose-400 font-bold pt-2 border-t border-rose-500/20">
                   Net Credit: + ₹30
                </li>
             </ul>
           </div>
           
           <div class="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
             <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">2</div>
                <h4 class="text-emerald-400 font-bold text-xl">The Floor (Bull Put Spread)</h4>
             </div>
             <p class="text-slate-300 text-sm leading-relaxed mb-4">This protects you strictly on the downside if Nifty crashes.</p>
             <ul class="space-y-3 font-mono text-sm">
                <li class="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg text-emerald-300 border border-emerald-500/20">
                   <span>SELL OTM Put (e.g. 21,700 PE)</span>
                   <span class="font-bold">+ ₹55 Credit</span>
                </li>
                <li class="flex items-center justify-between p-3 bg-black/40 rounded-lg text-slate-400 border border-white/5">
                   <span>BUY Further OTM Put (e.g. 21,600 PE)</span>
                   <span>- ₹25 Debit</span>
                </li>
                <li class="text-right text-emerald-400 font-bold pt-2 border-t border-emerald-500/20">
                   Net Credit: + ₹30
                </li>
             </ul>
           </div>
         </div>
         
         <div class="bg-black/60 p-6 rounded-xl border border-blue-500/30 flex items-center justify-between">
           <span class="text-slate-300 text-lg">Total Iron Condor Initial Credit:</span>
           <span class="text-blue-400 font-mono font-bold text-2xl bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">₹60 per share</span>
         </div>
       `
    },
    {
       heading: "3. Analyzing the Payoff Mathematics",
       content: `
         <p class="text-slate-300 leading-relaxed mb-8">Assuming Nifty Spot is currently exactly at 22,000, you have built a structural 600-point wide cage entirely around the current market price.</p>
         
         <div class="mt-8 mb-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-white/10 relative overflow-hidden text-center shadow-2xl">
            <h4 class="text-white font-bold mb-8 text-xl tracking-wide">The Iron Condor Profit Tent</h4>
            
            <div class="flex justify-center w-full mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl filter drop-shadow-xl">
                <defs>
                   <linearGradient id="icProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
                   </linearGradient>
                   <linearGradient id="icLoss" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stop-color="#EF4444" stop-opacity="0.2"/>
                      <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
                   </linearGradient>
                </defs>
                
                <!-- Zero Line -->
                <line x1="40" y1="200" x2="560" y2="200" stroke="#475569" stroke-width="2" />
                <text x="35" y="205" fill="#94A3B8" font-size="12" font-bold="true" text-anchor="end">₹0</text>
                
                <!-- Y-Axis -->
                <line x1="40" y1="40" x2="40" y2="300" stroke="#475569" stroke-width="2" />
                <text x="20" y="170" fill="#94A3B8" font-size="12" transform="rotate(-90 20,170)" text-anchor="middle" font-bold="true" tracking="widest">P&L</text>
                
                <!-- Fill Zones -->
                <path d="M 40,300 L 120,300 L 120,200 L 40,200 Z" fill="url(#icLoss)" />
                <path d="M 480,300 L 560,300 L 560,200 L 480,200 Z" fill="url(#icLoss)" />
                <path d="M 180,100 L 420,100 L 420,200 L 180,200 Z" fill="url(#icProfit)" />
                <path d="M 120,200 L 180,100 L 180,200 Z" fill="url(#icProfit)" />
                <path d="M 420,100 L 480,200 L 420,200 Z" fill="url(#icProfit)" />
                
                <!-- The Iron Condor Line -->
                <path d="M 40,280 L 120,280 L 180,100 L 420,100 L 480,280 L 560,280" fill="none" stroke="#3B82F6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Max Profit Line -->
                <line x1="40" y1="100" x2="560" y2="100" stroke="#10B981" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
                <text x="300" y="85" fill="#10B981" font-size="14" font-bold="true" text-anchor="middle">Max Profit (₹60 Premium Collected)</text>
                
                <!-- Max Loss Line -->
                <line x1="40" y1="280" x2="560" y2="280" stroke="#EF4444" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
                <text x="300" y="300" fill="#EF4444" font-size="12" font-bold="true" text-anchor="middle">Max Loss (₹40)</text>
                
                <!-- Strike Annotations -->
                <!-- Bottom Wing -->
                <circle cx="120" cy="280" r="5" fill="#EF4444" />
                <text x="120" y="325" fill="#94A3B8" font-size="11" text-anchor="middle" font-mono="true">21600 (Buy)</text>
                
                <circle cx="180" cy="100" r="5" fill="#10B981" stroke="#000" stroke-width="2" />
                <text x="180" y="325" fill="#94A3B8" font-size="11" text-anchor="middle" font-mono="true">21700 (Sell)</text>
                
                <!-- ATM Spot -->
                <line x1="300" y1="100" x2="300" y2="200" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4"/>
                <text x="300" y="325" fill="#FFFFFF" font-size="12" font-bold="true" text-anchor="middle">22000 (Current Spot)</text>
                
                <!-- Top Wing -->
                <circle cx="420" cy="100" r="5" fill="#10B981" stroke="#000" stroke-width="2" />
                <text x="420" y="325" fill="#94A3B8" font-size="11" text-anchor="middle" font-mono="true">22300 (Sell)</text>
                
                <circle cx="480" cy="280" r="5" fill="#EF4444" />
                <text x="480" y="325" fill="#94A3B8" font-size="11" text-anchor="middle" font-mono="true">22400 (Buy)</text>
                
             </svg>
            </div>
         </div>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-[#022c22] p-6 border border-emerald-500/20 rounded-xl">
               <h5 class="text-emerald-400 font-bold mb-2">The Win State</h5>
               <p class="text-slate-300 text-sm">If Nifty closes at 21,900 (or any number between 21,700 and 22,300) on Expiry Thursday. <strong>ALL FOUR</strong> option contracts instantly bleed to ₹0.00. Because you received ₹60 initial credit to open the basket, you keep 100% of it. <span class="bg-black/50 text-emerald-400 font-mono px-2 py-1 rounded ml-1">Profit: ₹3,000/lot</span></p>
            </div>
            
            <div class="bg-[#450a0a] p-6 border border-rose-500/20 rounded-xl">
               <h5 class="text-rose-400 font-bold mb-2">The Absolute Worst-Case State</h5>
               <p class="text-slate-300 text-sm">There is a horrific geopolitical event. Nifty crashes 1,500 points down to 20,500. A naked Put Seller would lose ₹60,000 instantly and face margin calls. Your Iron Condor? Because you bought the 21,600 Put wing, your loss is mathematically trapped at exactly (Spread Width 100 - Premium Collected 60). <span class="bg-black/50 text-rose-400 font-mono px-2 py-1 rounded ml-1">Max Loss: ₹2,000/lot</span>. It cannot possibly go higher.</p>
            </div>
         </div>
       `
    },
    {
       heading: "4. The VIX Paradigm: When to Deploy",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">You should mathematically <strong>NEVER</strong> deploy an Iron Condor natively when the India VIX is sitting at 10 to 11 (Absolute complacency). At ultra-low VIX, the option premiums are incredibly starved. You will only collect a tiny ₹20 to risk ₹80. It violates Risk/Reward logic.</p>
         
         <p class="text-slate-300 leading-relaxed mb-6">Iron Condors are Vega Negative strategies designed entirely for <strong>IV Crush</strong>. You deploy them when VIX is historically elevated (e.g., 16 to 22) leading up to major central bank announcements or corporate earnings. You collect mathematically bloated "fear premiums" (₹70 credit for a 100 wide spread). Following the event, when VIX instantly collapses natively, you can buy back the Condor early for 50% profit within 24 hours.</p>
       `
    }
  ]
};

export const moneynessContent = {
  title: "ITM, ATM, and OTM: The Concept of Moneyness",
  meta: "Master Options Moneyness. Understand In-The-Money (ITM), At-The-Money (ATM), and Out-Of-The-Money (OTM) strikes, alongside Intrinsic and Extrinsic value calculations.",
  sections: [
    {
      heading: "1. What is Moneyness?",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">When you open an Option Chain for the first time, you are bombarded with dozens of different Strike Prices. Some are highlighted in a shaded background, some have massive premiums like ₹500, and others trade for mere pennies (₹2). This entire structure is governed by a singular, foundational concept: <strong>Moneyness</strong>.</p>
        
        <p class="text-slate-300 leading-relaxed mb-8">Moneyness is strictly the mathematical relationship between the <strong>Current Market Price (Spot Price)</strong> of the underlying asset and the <strong>Strike Price</strong> of the exact Option contract you are looking at.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-gradient-to-b from-blue-900/40 to-black border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-xl">
             <div class="absolute -right-6 -top-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
             </div>
             <h4 class="text-blue-400 font-bold text-xl mb-2">ITM</h4>
             <p class="text-white font-mono text-sm mb-4">In-The-Money</p>
             <p class="text-slate-400 text-sm leading-relaxed">Options that possess real, immediate mathematical value if they were exercised right this second. They act exactly like buying the actual stock.</p>
          </div>
          
          <div class="bg-gradient-to-b from-emerald-900/40 to-black border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-xl">
             <div class="absolute -right-6 -top-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             </div>
             <h4 class="text-emerald-400 font-bold text-xl mb-2">ATM</h4>
             <p class="text-white font-mono text-sm mb-4">At-The-Money</p>
             <p class="text-slate-400 text-sm leading-relaxed">The Strike Price that is sitting exactly at (or closest to) the current live market price of the Index. The absolute battleground of buyers and sellers.</p>
          </div>
          
          <div class="bg-gradient-to-b from-rose-900/40 to-black border border-rose-500/30 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-xl">
             <div class="absolute -right-6 -top-6 text-rose-500/10 group-hover:text-rose-500/20 transition-colors">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
             </div>
             <h4 class="text-rose-400 font-bold text-xl mb-2">OTM</h4>
             <p class="text-white font-mono text-sm mb-4">Out-Of-The-Money</p>
             <p class="text-slate-400 text-sm leading-relaxed">Options composed entirely of "hope". They possess zero real value right now. Retail traders exclusively buy these because they are cheap lottery tickets.</p>
          </div>
        </div>
      `
    },
    {
      heading: "2. The Mathematical Anatomy: Intrinsic vs Extrinsic Value",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">Before you can fully grasp Moneyness, you must understand the two mathematical components that make up any Option Premium. Every single Option Premium in existence is a simple addition of two numbers:</p>
        
        <div class="flex items-center justify-center p-6 bg-black/50 border border-white/10 rounded-xl mb-8 font-mono text-lg lg:text-2xl shadow-inner overflow-x-auto">
           <span class="text-white">Option Premium</span> = <span class="text-blue-400 font-bold ml-3">Intrinsic Value</span> <span class="text-slate-500 mx-3">+</span> <span class="text-amber-400 font-bold">Extrinsic Value (Time)</span>
        </div>

        <div class="space-y-6 mb-10">
           <div class="bg-[#0B1120] p-8 rounded-2xl border-l-4 border-blue-500 relative">
              <h4 class="text-blue-400 font-bold text-xl mb-3">1. Intrinsic Value (Real Money)</h4>
              <p class="text-slate-300 leading-relaxed mb-4">This is the actual, tangible cash value the option would hold if the Expiry Bell rang exactly right now. It is the absolute difference between the Spot Price and the Strike Price.</p>
              <ul class="text-slate-400 text-sm space-y-2 list-disc pl-5">
                 <li><strong>Call Intrinsic:</strong> Spot Price - Strike Price (Only if positive, otherwise 0)</li>
                 <li><strong>Put Intrinsic:</strong> Strike Price - Spot Price (Only if positive, otherwise 0)</li>
              </ul>
              <div class="mt-4 bg-black/40 p-4 border border-white/5 rounded-lg flex items-center justify-between text-sm font-mono">
                 <span class="text-slate-400">Nifty Spot: 22,000 | Holding: 21,800 Call</span>
                 <span class="text-blue-400 font-bold">Intrinsic Value = ₹200</span>
              </div>
           </div>

           <div class="bg-[#0B1120] p-8 rounded-2xl border-l-4 border-amber-500 relative">
              <h4 class="text-amber-400 font-bold text-xl mb-3">2. Extrinsic Value (Time & Hope)</h4>
              <p class="text-slate-300 leading-relaxed mb-4">This is the "bloat" or "hawa" (air) mixed into the premium. It exists because the market is charging you money for the <em>time</em> remaining until Expiry and the <em>hope</em> that the option might become highly profitable. <strong>Extrinsic Value mathematically evaporates to exactly zero on Expiry Thursday.</strong></p>
              <div class="mt-4 bg-black/40 p-4 border border-white/5 rounded-lg text-sm font-mono space-y-2">
                 <div class="flex justify-between text-slate-400">
                   <span>Nifty Spot: 22,000 | Holding: 21,800 Call</span>
                   <span>Premium Trading At: ₹250</span>
                 </div>
                 <div class="h-px w-full bg-white/5 my-2"></div>
                 <div class="flex justify-between font-bold">
                   <span class="text-amber-400">Extrinsic Value (Bloat):</span>
                   <span class="text-amber-400">Total Premium (₹250) - Intrinsic (₹200) = ₹50</span>
                 </div>
              </div>
           </div>
        </div>
      `
    },
    {
       heading: "3. The Visual State of Calls & Puts",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Because a Call is a bet on the market going UP, and a Put is a bet on the market going DOWN, their Moneyness states are perfectly mirrored inverses of each other.</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">Assuming the current Nifty Spot is exactly <strong>22,000</strong>:</p>

         <div class="overflow-x-auto rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 mb-10">
            <table class="w-full text-center border-collapse">
               <thead>
                  <tr>
                     <th class="w-1/3 p-5 bg-gradient-to-r from-[#022c22] to-[#064e3b] text-emerald-400 font-bold text-lg border-r border-emerald-500/20">CALL OPTION (CE)</th>
                     <th class="w-1/3 p-5 bg-black text-white font-bold text-xl tracking-widest border-r border border-white/10 shadow-2xl z-10 relative">STRIKE<br/><span class="text-xs text-slate-500 font-mono font-normal">NIFTY @ 22,000</span></th>
                     <th class="w-1/3 p-5 bg-gradient-to-l from-[#450a0a] to-[#7f1d1d] text-rose-400 font-bold text-lg border-l border-rose-500/20">PUT OPTION (PE)</th>
                  </tr>
               </thead>
               <tbody class="text-base font-mono">
                  <!-- Row 1 (Bottom Strike) -->
                  <tr class="border-b border-white/5">
                     <td class="p-4 bg-blue-900/20 text-blue-300 font-bold">ITM (In-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹350 (High Intrinsic)</span></td>
                     <td class="p-4 bg-black/60 text-white border-x border-white/5 text-lg">21,800</td>
                     <td class="p-4 bg-rose-900/10 text-rose-300 border-l border-rose-500/10">OTM (Out-Of-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹15 (Hope Only)</span></td>
                  </tr>
                  <!-- Row 2 -->
                  <tr class="border-b border-white/5">
                     <td class="p-4 bg-blue-900/20 text-blue-300 font-bold">ITM (In-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹200 (High Intrinsic)</span></td>
                     <td class="p-4 bg-black/60 text-white border-x border-white/5 text-lg">21,900</td>
                     <td class="p-4 bg-rose-900/10 text-rose-300 border-l border-rose-500/10">OTM (Out-Of-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹40 (Hope Only)</span></td>
                  </tr>
                  <!-- ATM Row -->
                  <tr class="border-y-2 border-amber-500 shadow-2xl relative z-20">
                     <td class="p-5 bg-amber-500/10 text-amber-400 font-black tracking-wider shadow-inner">ATM<br/><span class="text-xs font-normal text-slate-400">Premium: ₹120 (Max Time Value)</span></td>
                     <td class="p-5 bg-black text-amber-400 border-x border-amber-500/50 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">22,000</td>
                     <td class="p-5 bg-amber-500/10 text-amber-400 font-black tracking-wider shadow-inner">ATM<br/><span class="text-xs font-normal text-slate-400">Premium: ₹120 (Max Time Value)</span></td>
                  </tr>
                  <!-- Row 4 -->
                  <tr class="border-b border-white/5">
                     <td class="p-4 bg-emerald-900/10 text-emerald-300 border-r border-emerald-500/10">OTM (Out-Of-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹40 (Hope Only)</span></td>
                     <td class="p-4 bg-black/60 text-white border-x border-white/5 text-lg">22,100</td>
                     <td class="p-4 bg-blue-900/20 text-blue-300 font-bold">ITM (In-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹200 (High Intrinsic)</span></td>
                  </tr>
                  <!-- Row 5 -->
                  <tr>
                     <td class="p-4 bg-emerald-900/10 text-emerald-300 border-r border-emerald-500/10">OTM (Out-Of-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹15 (Hope Only)</span></td>
                     <td class="p-4 bg-black/60 text-white border-x border-white/5 text-lg">22,200</td>
                     <td class="p-4 bg-blue-900/20 text-blue-300 font-bold">ITM (In-The-Money)<br/><span class="text-xs font-normal text-slate-500">Premium: ₹350 (High Intrinsic)</span></td>
                  </tr>
               </tbody>
            </table>
         </div>
       `
    },
    {
       heading: "4. The Illusion of Cheap OTM Options",
       content: `
         <div class="bg-black/40 p-8 rounded-2xl border border-rose-500/30 mb-8 mt-4 relative overflow-hidden">
            <div class="absolute -right-20 -top-20 opacity-[0.05]">
               <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            
            <h4 class="text-rose-400 font-black text-2xl mb-4 tracking-tight flex items-center gap-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
               The Zero Sum Truth
            </h4>
            
            <p class="text-slate-300 leading-relaxed mb-4 text-lg">
               <strong>Over 95% of Deep OTM Options Expire Worthless (at exactly ₹0.00).</strong>
            </p>
            
            <p class="text-slate-400 leading-relaxed text-sm mb-6">
               Retail traders flock to OTM options because buying 10 lots of a 22,500 Call might only cost ₹1,000. It feels like buying a lottery ticket. But remember the Extrinsic Value math? OTM options possess exactly <strong>Zero Intrinsic Value</strong>. They are composed 100% purely of Extrinsic Hope.
            </p>
            
            <p class="text-slate-400 leading-relaxed text-sm">
               Because they are purely Extrinsic, Time Decay (Theta) instantly attacks them. If Nifty moves sideways for just two days, that ₹1,000 drops to ₹300. Professional algorithmic institutions make billions of dollars consistently <strong>selling</strong> these exact OTM options to hopeful retail traders, simply waiting for the clock to run out on Thursday at 3:30 PM. To survive in options trading, you must heavily restrict buying OTM strikes unless accompanied by a catastrophic volatility event (like a Black Swan).
            </p>
         </div>
       `
    }
  ]
};

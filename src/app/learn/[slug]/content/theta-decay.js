export const thetaDecayContent = {
  title: "Theta Decay: The Guaranteed Force of Time",
  meta: "Master Options Time Decay (Theta). Understand how Weekend Decay works, why OTM options bleed the fastest, and the eternal Gamma vs Theta trade-off.",
  sections: [
    {
      heading: "1. Understanding 'Option Rent'",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">If you rent a luxury apartment for 30 days, you pay exactly 1 month of rent upfront. Every morning you wake up, whether you actually step foot inside the apartment or not, one day's worth of your rent is mathematically gone forever. You can never get it back.</p>
        
        <p class="text-slate-300 leading-relaxed mb-8">This is the exact, literal definition of <strong>Theta (Θ)</strong>. When you buy an Option contract, you are not buying an asset. <strong>You are renting a mathematical probability.</strong> Because you only have until Thursday at 3:30 PM to get the direction right, every passing day destroys your rented time. Theta is the exact numerical value of your daily rent.</p>

        <div class="bg-gradient-to-r from-rose-900/30 to-black border-l-4 border-rose-500 p-8 rounded-2xl mb-12 shadow-2xl relative overflow-hidden">
           <div class="absolute -right-10 -top-10 opacity-10">
              <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
           </div>
           <h3 class="text-rose-400 font-bold text-2xl mb-4">The Absolute Rule of Time</h3>
           <p class="text-slate-300 text-lg leading-relaxed">
             <strong>Theta is undeniably guaranteed.</strong> Delta requires the market to move. Vega requires implied volatility to expand. Gamma requires extreme velocity. <em>But Theta only requires that the planet Earth completes one rotation.</em> Time is the only dimension in the stock market that moves in a perfectly predictable, one-way straight line.
           </p>
        </div>
      `
    },
    {
      heading: "2. The Matrix of Decay: ITM vs ATM vs OTM",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">Theta does not attack all option strikes equally. The Black-Scholes algorithm precisely targets the "Extrinsic Bloat" depending on the Moneyness of the strike.</p>
        
        <div class="overflow-x-auto rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 mb-10">
           <table class="w-full text-left border-collapse">
              <thead>
                 <tr>
                    <th class="w-1/4 p-5 bg-black text-slate-300 font-bold text-sm tracking-wider uppercase border-b border-r border-white/10">Moneyness</th>
                    <th class="w-1/4 p-5 bg-black text-rose-400 font-bold text-sm tracking-wider uppercase border-b border-r border-white/10">Theta Decay Speed</th>
                    <th class="w-1/2 p-5 bg-black text-white font-bold text-sm tracking-wider uppercase border-b border-white/10">The Algorithmic Logic</th>
                 </tr>
              </thead>
              <tbody class="text-base text-slate-300">
                 <!-- ATM -->
                 <tr class="bg-rose-500/10 border-b border-white/5 font-bold relative z-10 shadow-inner">
                    <td class="p-5 border-r border-rose-500/20 text-rose-300">ATM (At-The-Money)</td>
                    <td class="p-5 border-r border-rose-500/20 text-rose-400">ABSOLUTE MAXIMUM</td>
                    <td class="p-5 font-normal">ATM options possess the <strong>highest total extrinsic value</strong> in the entire chain. Because they are hovering right at the battleground line, the algorithmic uncertainty is at its absolute peak. You are paying maximum rent here, meaning your daily Theta burn is extreme.</td>
                 </tr>
                 <!-- OTM -->
                 <tr class="bg-black/40 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="p-5 border-r border-white/5">OTM (Out-Of-The-Money)</td>
                    <td class="p-5 border-r border-white/5 text-amber-400">HIGH (Near Expiry Cliff)</td>
                    <td class="p-5 font-normal text-sm">Deep OTM options are just lottery tickets. With 30 days to expiry, their decay is slow. But with 3 days to expiry, the algorithm realizes there is almost a 0% mathematical chance of success, so Theta aggressively burns them to ₹0 overnight.</td>
                 </tr>
                 <!-- ITM -->
                 <tr class="bg-black/40 hover:bg-white/[0.02] transition-colors">
                    <td class="p-5 border-r border-white/5">ITM (In-The-Money)</td>
                    <td class="p-5 border-r border-white/5 text-emerald-400">VERY LOW</td>
                    <td class="p-5 font-normal text-sm">Deep ITM options possess almost zero Extrinsic Value—they are mostly made of real Intrinsic cash. Because there is no "hawa" (air) in the premium, there is almost nothing for Theta to destroy. Buying deep ITM options drastically reduces your Theta rent.</td>
                 </tr>
              </tbody>
           </table>
        </div>
      `
    },
    {
      heading: "3. The Great 'Weekend Decay' Debate",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">One of the most persistent myths in the Indian retail trading community is that institutions sell options aggressively on Friday at 3:25 PM, believing they get 2 "free" days of Theta decay over Saturday and Sunday while the market is closed.</p>
        
        <div class="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl mb-10 relative">
          <h4 class="text-indigo-400 font-black text-xl mb-4 flex items-center gap-3">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             The Quant Reality of Friday Premiums
          </h4>
          <p class="text-slate-300 leading-relaxed mb-4">
             The algorithmic market makers (the mega-computers powering NSE liquidity) are not stupid. They are fully aware the market will be closed for 48 hours. Therefore, <strong>the weekend Theta decay is already statically priced into the options by Friday afternoon.</strong>
          </p>
          <ul class="text-slate-400 space-y-3 font-mono text-sm">
             <li class="flex items-start gap-2">
                <span class="text-rose-400 font-bold mt-1">>></span>
                If you buy an option at 9:15 AM on Friday, you are paying the "Friday Premium."
             </li>
             <li class="flex items-start gap-2">
                <span class="text-rose-400 font-bold mt-1">>></span>
                If you buy that same option at 3:20 PM on Friday, the premium has usually naturally slumped because the market makers have already aggressively drained the weekend Theta out of the price.
             </li>
             <li class="flex items-start gap-2">
                <span class="text-emerald-400 font-bold mt-1">>></span>
                Conclusion: Selling on Friday at 3:25 PM does <strong>not</strong> magically give you 2 free days of profit on Monday at 9:15 AM. You are taking enormous overnight Gap-Up/Gap-Down risk for zero extra mathematical yield.
             </li>
          </ul>
        </div>
      `
    },
    {
      heading: "4. Long Theta vs Short Theta Portfolios",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">Every single Options Strategy in the world can be classified into exactly two categories: and professional traders track their "Net Portfolio Theta" down to the penny.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div class="bg-black/60 border border-rose-500/30 p-8 rounded-2xl relative shadow-lg">
              <div class="absolute right-4 top-4 bg-rose-500/20 text-rose-400 px-3 py-1 rounded font-mono text-xs font-bold border border-rose-500/30">Negative Theta</div>
              <h4 class="text-white font-bold text-xl mb-2">The Option Buyer</h4>
              <p class="text-slate-400 text-sm mb-6">Pays rent to the market every day.</p>
              
              <div class="space-y-3">
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Naked Call Buying</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Naked Put Buying</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Long Straddle (Massive Theta Burn)</span>
                 </div>
              </div>
              <div class="mt-8 pt-6 border-t border-white/5">
                 <p class="text-slate-400 text-sm leading-relaxed italic">The clock is your greatest enemy. If Nifty trades sideways for 3 days, you will face severe drawdowns. You live and die by momentum velocity.</p>
              </div>
           </div>

           <div class="bg-black/60 border border-emerald-500/30 p-8 rounded-2xl relative shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div class="absolute right-4 top-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded font-mono text-xs font-bold border border-emerald-500/30">Positive Theta</div>
              <h4 class="text-white font-bold text-xl mb-2">The Option Seller</h4>
              <p class="text-slate-400 text-sm mb-6">Collects rent from the market every day.</p>
              
              <div class="space-y-3">
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Iron Condors</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Short Strangles & Straddles</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-slate-300 text-sm font-mono">Credit Spreads (Call/Put)</span>
                 </div>
              </div>
              <div class="mt-8 pt-6 border-t border-white/5">
                 <p class="text-slate-400 text-sm leading-relaxed italic">The clock is your absolute best friend. You literally get paid a physical cash yield simply because the sun rose in the east today. Sideways chop is your empire.</p>
              </div>
           </div>
        </div>
      `
    },
    {
      heading: "5. The Universal Law: Gamma vs Theta",
      content: `
        <div class="bg-[#0B1120] p-8 rounded-2xl border border-white/10 mb-8 relative">
           <p class="text-slate-300 leading-relaxed mb-6">
              In physics, for every action there is an equal and opposite reaction. In quantitative finance, for every positive Greek you hold in your portfolio, you are forced to shoulder massive risk in the opposing Greek.
           </p>
           
           <h4 class="text-white font-black text-2xl tracking-tight mb-6 text-center">There is no "Free Lunch" on Dalal Street.</h4>
           
           <div class="flex flex-col md:flex-row items-center justify-center gap-8 bg-black/40 p-6 rounded-xl border border-white/5 w-full">
              <div class="text-center w-full md:w-5/12">
                 <h5 class="text-emerald-400 font-bold mb-2">Option Sellers (Short Theta)</h5>
                 <p class="text-slate-400 text-sm leading-relaxed">You proudly collect ₹20 of Theta decay every day. The cash yield feels incredible. But secretly, you are <strong>Short Gamma</strong>. If Nifty violently gaps up 500 points on a Black Swan event, the Gamma acceleration will immediately detonate your account, wiping out 6 months of Theta collections in 5 minutes.</p>
              </div>
              
              <div class="hidden md:flex flex-col items-center justify-center w-2/12 opacity-50">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              
              <div class="text-center w-full md:w-5/12">
                 <h5 class="text-rose-400 font-bold mb-2">Option Buyers (Long Gamma)</h5>
                 <p class="text-slate-400 text-sm leading-relaxed">You proudly hold Long Gamma. If the 500 point Black Swan hits, your ₹2,000 lottery ticket turns into ₹80,000 instantly. But secretly, you are <strong>Short Theta</strong>. To hold this massive explosive capability, you must bleed ₹500 every single day the market is boring. Death by a thousand cuts.</p>
              </div>
           </div>
        </div>
      `
    }
  ]
};

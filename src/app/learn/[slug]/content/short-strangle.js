export const shortStrangleContent = {
  title: "Short Strangle: The Institutional Cash Cow",
  meta: "Master the Short Strangle Strategy. Learn how institutions harvest pure Theta by selling naked OTM Calls and Puts, creating massive profit zones while managing undefined risk.",
  sections: [
    {
       heading: "1. The Anatomy of a Short Strangle",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you look at the options data for major institutional players (FIIs/PROs) working with thousands of crores on the NSE, you will rarely see them executing complex 4-leg condors or buying lottery tickets. Their absolute bread and butter is the <strong>Short Strangle</strong>.</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">The logic is simple: they want to act as the Casino. They want to sell "insurance" against extremely unlikely events. To build a Short Strangle, you execute exactly two naked legs simultaneously:</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-rose-900/10 border-l-4 border-rose-500 p-6 rounded-xl relative shadow-inner group">
               <div class="absolute right-4 top-4 text-rose-500/20 group-hover:text-rose-500/40 transition-colors">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z"/></svg>
               </div>
               <h4 class="text-rose-400 font-bold text-xl mb-4">Leg 1: Sell OTM Call</h4>
               <p class="text-slate-300 text-sm leading-relaxed mb-4">You sell a Call option sitting far above the current market price. You collect premium. You mathematically win as long as the market does not rally violently past your strike.</p>
               <div class="font-mono text-xs bg-rose-500/20 text-rose-300 px-3 py-2 rounded">Example: Sell 22,500 CE @ ₹40</div>
            </div>
            
            <div class="bg-emerald-900/10 border-l-4 border-emerald-500 p-6 rounded-xl relative shadow-inner group">
               <div class="absolute right-4 top-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22L2 2h20L12 22zm0-3.8l7.2-14.2H4.8L12 18.2z"/></svg>
               </div>
               <h4 class="text-emerald-400 font-bold text-xl mb-4">Leg 2: Sell OTM Put</h4>
               <p class="text-slate-300 text-sm leading-relaxed mb-4">You simultaneously sell a Put option sitting far below the market. You collect more premium. You win as long as the market does not crash violently past your strike.</p>
               <div class="font-mono text-xs bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded">Example: Sell 21,500 PE @ ₹40</div>
            </div>
         </div>
         
         <div class="bg-black/50 p-6 rounded-xl border border-white/5 shadow-2xl">
            <h4 class="text-white font-bold mb-3 flex items-center gap-2">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               The Core Philosophy
            </h4>
            <p class="text-slate-300 leading-relaxed text-sm">
               Assuming Nifty is at 22,000, you have just laid a 1,000-point physical trap around the market. If Nifty closes anywhere between 21,500 and 22,500 on Thursday, <strong>both options expire exactly at ₹0.00</strong>. You keep 100% of the ₹80 total premium collected. You have synthetically generated a massive probability of winning (~80%+).
            </p>
         </div>
       `
    },
    {
       heading: "2. Visualizing Undefined Risk (The Payoff)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Unlike an Iron Condor, which buys wings to create a hard floor on losses, a Short Strangle is completely naked. It carries <strong>mathematically infinite theoretical risk</strong>.</p>
         
         <div class="my-10 p-2 sm:p-8 bg-[#0B1120] rounded-2xl border border-rose-500/20 relative overflow-hidden text-center shadow-xl">
            <h4 class="text-white font-bold mb-6 text-xl tracking-wide">The Short Strangle Payoff Graph</h4>
            
            <div class="flex justify-center w-full mb-6 relative z-10">
              <svg width="600" height="250" viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl drop-shadow-2xl">
                 <defs>
                   <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
                     <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                   </linearGradient>
                   <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.0"/>
                     <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.3"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Breakeven Zero Line -->
                 <line x1="20" y1="120" x2="580" y2="120" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
                 <text x="50" y="110" fill="#94A3B8" font-size="12" font-weight="bold">₹0 (Breakeven)</text>
                 
                 <!-- Profit Zone Polygon (The Plateau) -->
                 <polygon points="180,120 220,60 380,60 420,120" fill="url(#profitGrad)"/>
                 <path d="M 220,60 L 380,60" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
                 
                 <!-- Loss Zone Polygon (Left Crash) -->
                 <polygon points="20,220 180,120 180,220" fill="url(#lossGrad)"/>
                 <path d="M 20,240 L 180,120 M 180,120 L 220,60" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Loss Zone Polygon (Right Rally) -->
                 <polygon points="420,120 580,220 420,220" fill="url(#lossGrad)"/>
                 <path d="M 380,60 L 420,120 M 420,120 L 580,240" stroke="#F43F5E" stroke-width="3"/>
                 
                 <!-- Labels -->
                 <!-- Left Breakeven -->
                 <circle cx="180" cy="120" r="5" fill="#10B981"/>
                 <text x="180" y="145" fill="#94A3B8" font-size="12" text-anchor="middle">21,420</text>
                 <text x="180" y="160" fill="#64748B" font-size="10" text-anchor="middle">Lower Breakeven</text>
                 
                 <!-- Left Strike -->
                 <circle cx="220" cy="60" r="4" fill="#E2E8F0"/>
                 <text x="220" y="45" fill="#E2E8F0" font-size="11" text-anchor="middle">21,500 PE</text>
                 
                 <!-- Right Strike -->
                 <circle cx="380" cy="60" r="4" fill="#E2E8F0"/>
                 <text x="380" y="45" fill="#E2E8F0" font-size="11" text-anchor="middle">22,500 CE</text>
                 
                 <!-- Right Breakeven -->
                 <circle cx="420" cy="120" r="5" fill="#10B981"/>
                 <text x="420" y="145" fill="#94A3B8" font-size="12" text-anchor="middle">22,580</text>
                 <text x="420" y="160" fill="#64748B" font-size="10" text-anchor="middle">Upper Breakeven</text>
                 
                 <!-- Max Profit -->
                 <text x="300" y="85" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit: ₹4,000</text>
              </svg>
            </div>
            
            <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mt-4">
              Notice the massive green plateau in the middle. The market can whip aggressively up 400 points and crash 400 points the very next day, and <strong>you still mathematically sit at maximum profit</strong>. However, notice the red lines extending downwards into infinity on both sides. Unlike an Iron Condor, if Nifty drops 2,000 points on a Black Swan, your losses scale linearly to physical ruin.
            </p>
         </div>
       `
    },
    {
       heading: "3. The Greek Matrix: Why Strangles Print Money",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Execution is not enough. You must understand the exact quantitative physics underlying the Short Strangle, and why algorithmic traders deploy it mercilessly across varying market conditions.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <!-- Theta -->
            <div class="bg-black/60 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
               <h5 class="text-emerald-400 font-bold mb-2 text-lg">Massive Positive Theta</h5>
               <p class="text-slate-400 text-sm leading-relaxed">By selling both OTM wings, you are doubling your Theta collection. Every single weekend, holiday, or boring sideways session physically deposits cash into your trading ledger. You are quite literally farming the passage of time.</p>
            </div>
            
            <!-- Delta -->
            <div class="bg-black/60 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
               <h5 class="text-blue-400 font-bold mb-2 text-lg">Delta Neutral (At Entry)</h5>
               <p class="text-slate-400 text-sm leading-relaxed">The Short Call holds Negative Delta. The Short Put holds Positive Delta. Because you sell equidistant strikes, the Deltas immediately negate each other. Your aggregate Portfolio Delta is exactly Zero. You do not care which way the market opens tomorrow.</p>
            </div>
            
            <!-- Vega -->
            <div class="bg-black/60 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
               <h5 class="text-amber-400 font-bold mb-2 text-lg">Short Vega (IV Crush)</h5>
               <p class="text-slate-400 text-sm leading-relaxed">Strangles are inherently negatively exposed to Implied Volatility. If you deploy a Strangle leading up to the Union Budget (VIX @ 24) and the VIX collapses to 14 the next morning, your Strangle can hit 80% max profit natively via Vega collapse, regardless of Theta.</p>
            </div>
         </div>
       `
    },
    {
       heading: "4. The Margin Reality Check",
       content: `
         <div class="bg-gradient-to-l from-rose-900/10 to-indigo-900/10 p-8 rounded-2xl border border-white/10 relative overflow-hidden text-left shadow-2xl mb-8">
            <h4 class="text-white font-black text-2xl tracking-tight mb-4 flex items-center gap-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               The Barrier to Entry
            </h4>
            
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
               Because the Short Strangle carries infinite theoretical risk, the Exchange (NSE) and your broker require massive upfront margin collateral to execute the trade.
            </p>
            
            <ul class="text-slate-400 font-mono text-sm space-y-4 mb-6">
               <li class="flex items-center gap-3"><span class="bg-white/10 px-2 py-1 rounded text-white">Naked Buying</span> Buying 1 Lot of BankNifty Call requires ~₹3,000.</li>
               <li class="flex items-center gap-3"><span class="bg-white/10 px-2 py-1 rounded text-white">Iron Condor</span> Selling 1 Lot of a hedged Iron Condor requires ~₹45,000.</li>
               <li class="flex items-center gap-3"><span class="bg-rose-500/20 text-rose-300 px-2 py-1 rounded">Short Strangle</span> Selling 1 Lot of a naked Strangle requires tightly <strong class="text-rose-400">₹1,20,000 to ₹1,50,000</strong>.</li>
            </ul>
            
            <p class="text-slate-300 leading-relaxed text-sm bg-black/40 p-4 rounded-xl border-l-2 border-indigo-500">
               <strong>The Trade-Off:</strong> Yes, it requires 3x the capital of an Iron Condor. But because you don't have to spend a portion of your collected premium to buy "insurance wings", your absolute Return on Capital (ROC) in a sideways market is extraordinarily potent. You are playing the true institutional game.
            </p>
         </div>
       `
    }
  ]
};

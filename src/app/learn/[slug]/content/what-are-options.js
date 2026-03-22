export const whatAreOptionsContent = {
  title: "What Are Options? Complete Beginner's Guide",
  meta: "Learn the foundational principles of options trading — calls, puts, strike prices, expiry dates, and the core mathematics of the Indian stock market.",
  sections: [
    {
      heading: "1. Introduction to Derivatives",
      content: `
        <p class="text-xl leading-relaxed mb-6 text-slate-300">
          The term "Derivatives" sounds intimidating, but it simply means an asset that <em>derives</em> its value from something else. Think of a bottle of tomato ketchup. The price of ketchup is derived from the price of tomatoes. If tomatoes become 10x more expensive, the ketchup price will mechanically skyrocket too. Ketchup is basically a derivative of tomatoes.
        </p>
        <p class="text-slate-300 leading-relaxed mb-6">
          In the stock market, an <strong>Option</strong> is a derivative financial contract. It gives the buyer the <strong>right, but not the obligation</strong>, to buy or sell an underlying asset (such as the NIFTY 50 index, BANKNIFTY, or individual equity stocks like Reliance or HDFC Bank) at a specifically predetermined price (called the <em>strike price</em>) on or before a specified date (called the <em>expiry date</em>).
        </p>
        <div class="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-xl mb-10">
          <h4 class="text-blue-400 font-bold mb-3 text-lg flex items-center gap-2">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
             The Core Concept: Risk Asymmetry
          </h4>
          <p class="text-slate-300 leading-relaxed mb-0">Unlike buying a stock where your capital is locked and exposed to a 100% loss if the company goes bankrupt, buying an Option contract strictly caps your maximum possible loss to the "token" amount you paid to buy that contract. This token is called the <strong>Premium</strong>.</p>
        </div>
      `
    },
    {
      heading: "2. The Classic Analogy: Real Estate Booking",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">To fundamentally understand the underlying physics of Options, we must step outside the stock market completely. Let us look at a Real Estate transaction.</p>
        
        <div class="bg-[#0B1120] border border-white/5 shadow-2xl p-8 rounded-2xl mb-10 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <h3 class="text-emerald-400 font-bold text-2xl mb-5">The Mumbai Luxury Apartment</h3>
          
          <p class="text-slate-300 mb-5 leading-relaxed">Imagine you are eyeing a luxury apartment in Mumbai, currently valued at precisely <strong>₹1 Crore</strong>. You have credible inside information that a massive infrastructure project (like a new Metro station) will be officially announced next month right next to this building. If this happens, you project the flat's value will instantly surge to <strong>₹1.3 Crores</strong>.</p>
          
          <p class="text-slate-300 mb-5 leading-relaxed">The problem? You do not have ₹1 Crore sitting in your bank account today to buy the flat outright.</p>
          
          <p class="text-slate-300 mb-6 leading-relaxed">You approach the builder and make a legal proposition: You pay the builder a non-refundable <strong>Booking Token of ₹2 Lakhs</strong> today. In exchange, the builder signs a contract giving you the legal <em>right</em> to buy the flat at exactly ₹1 Crore anytime within the next <strong>3 months</strong>, regardless of what the market price does.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/20 p-6 rounded-xl hover:bg-emerald-900/50 transition-colors">
              <h4 class="text-emerald-400 font-bold mb-3 flex items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Scenario A: The Metro arrives</h4>
              <p class="text-slate-300 text-sm leading-relaxed mb-4">The announcement drops! The apartment price rockets to ₹1.3 Crores in the open market.</p>
              <ul class="text-slate-400 text-sm space-y-2 mb-4 list-disc pl-4">
                 <li>You exercise your legal contract right.</li>
                 <li>You buy it from the builder for ₹1 Cr.</li>
                 <li>You instantly flip it in the market for ₹1.3 Cr.</li>
              </ul>
              <div class="bg-black/40 p-3 rounded border border-emerald-500/30">
                 <p class="text-emerald-400 font-mono text-xs">Total Profit = 30L (Gain) - 2L (Token) = <strong>₹28 Lakhs</strong></p>
                 <p class="text-slate-400 text-xs mt-1">ROI on ₹2L investment = 1,400%</p>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-rose-900/40 to-black border border-rose-500/20 p-6 rounded-xl hover:bg-rose-900/50 transition-colors">
              <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Scenario B: The Market Crashes</h4>
              <p class="text-slate-300 text-sm leading-relaxed mb-4">A global recession hits. The metro is cancelled. The apartment price tanks downward to ₹70 Lakhs.</p>
              <ul class="text-slate-400 text-sm space-y-2 mb-4 list-disc pl-4">
                 <li>Are you forced to buy it at ₹1 Cr? No!</li>
                 <li>You hold the <em>right</em>, not the <em>obligation</em>.</li>
                 <li>You simply tear up the contract and walk away.</li>
              </ul>
              <div class="bg-black/40 p-3 rounded border border-rose-500/30">
                 <p class="text-rose-400 font-mono text-xs">Total Loss = <strong>₹2 Lakhs</strong> (The token paid)</p>
                 <p class="text-slate-400 text-xs mt-1">Saved from a ₹30 Lakh equity crash!</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      heading: "3. Translating the Analogy to Dalal Street",
      content: `
        <p class="text-slate-300 leading-relaxed mb-6">This Real Estate structure maps perfectly 1-to-1 with how an NSE Call Option functions.</p>
        
        <div class="overflow-x-auto mb-10">
          <table class="w-full text-left border-collapse border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <thead>
              <tr class="bg-slate-800/80 text-slate-300 border-b border-white/10 text-sm font-semibold tracking-wider uppercase">
                <th class="p-5 border-r border-white/5 w-1/3">Real Estate World</th>
                <th class="p-5 w-2/3">Options Trading World (NSE)</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                <td class="p-5 font-medium text-blue-400 border-r border-white/5">The Mumbai Flat</td>
                <td class="p-5 text-slate-300 leading-relaxed"><strong>The Underlying Asset:</strong> This is NIFTY, BANKNIFTY, or a Stock like Reliance. You are betting on the price movement of this core asset.</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                <td class="p-5 font-medium text-emerald-400 border-r border-white/5">The ₹1 Crore Agreed Price</td>
                <td class="p-5 text-slate-300 leading-relaxed"><strong>The Strike Price:</strong> The exact pre-agreed level on the Option Chain where you are locking in your right to transact. (e.g. 22,000 Strike)</td>
              </tr>
              <tr class="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                <td class="p-5 font-medium text-rose-400 border-r border-white/5">The 3-Month Window</td>
                <td class="p-5 text-slate-300 leading-relaxed"><strong>The Expiry Date:</strong> Every contract dies on a specific date. In India, NIFTY options expire every Thursday. If you don't use your right by 3:30 PM on Thursday, the contract burns to zero.</td>
              </tr>
              <tr class="hover:bg-white/[0.05] transition-colors">
                <td class="p-5 font-medium text-amber-400 border-r border-white/5">The ₹2 Lakh Booking Token</td>
                <td class="p-5 text-slate-300 leading-relaxed"><strong>The Premium:</strong> The non-refundable cash you pay immediately to buy the option. This represents the absolute maximum risk to the buyer.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
       heading: "4. The Ultimate Metric: The Payoff Graph",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Professional options traders do not look at candlesticks to judge a position; they look at <strong>Payoff Graphs</strong>. A payoff graph maps exactly how much money you will make or lose at every possible Nifty closing price on Expiry day.</p>
         
         <div class="mt-8 mb-10 p-8 bg-[#0B1120] rounded-2xl border border-emerald-500/20 relative overflow-hidden text-center shadow-2xl">
            <h4 class="text-white font-bold mb-8 text-xl tracking-wide">The Asymmetric Universe (Call Option Buyer)</h4>
            
            <div class="flex justify-center w-full mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl filter drop-shadow-xl">
                <!-- Grid background -->
                <defs>
                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-opacity="0.03" stroke-width="1"/>
                   </pattern>
                   <linearGradient id="profitGrad" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stop-color="#10B981" stop-opacity="0.1"/>
                      <stop offset="100%" stop-color="#10B981" stop-opacity="0.4"/>
                   </linearGradient>
                </defs>
                <rect width="600" height="350" fill="url(#grid)" />
                
                <!-- Zero Profit Line (X-Axis) -->
                <line x1="60" y1="280" x2="540" y2="280" stroke="#475569" stroke-width="2" />
                <text x="45" y="285" fill="#94A3B8" font-size="14" font-weight="bold" text-anchor="end">₹0</text>
                
                <!-- Y-Axis (P&L) -->
                <line x1="60" y1="40" x2="60" y2="280" stroke="#475569" stroke-width="2" />
                <text x="30" y="160" fill="#94A3B8" font-size="12" transform="rotate(-90 30,160)" text-anchor="middle" font-weight="bold" tracking="widest">PROFIT / LOSS (₹)</text>
                
                <!-- Premium Paid Line (Max Loss Floor) -->
                <line x1="60" y1="310" x2="350" y2="310" stroke="#EF4444" stroke-width="2" stroke-dasharray="6,4" />
                
                <!-- Area Fill for Profit/Loss -->
                <path d="M 60,310 L 350,310 L 400,280 Z" fill="#EF4444" fill-opacity="0.15" />
                <path d="M 400,280 L 520,60 L 520,280 Z" fill="url(#profitGrad)" />
                
                <!-- Solid Payoff Curve -->
                <path d="M 60,310 L 350,310 L 540,15" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg" />
                
                <!-- Strike Price Vertical Marker -->
                <line x1="350" y1="280" x2="350" y2="320" stroke="#94A3B8" stroke-width="2" />
                <text x="350" y="340" fill="#E2E8F0" font-size="14" text-anchor="middle" font-mono="true">Strike (e.g. 22000)</text>
                
                <!-- Breakeven Marker -->
                <circle cx="400" cy="280" r="6" fill="#10B981" stroke="#0B1120" stroke-width="2" />
                <text x="400" y="260" fill="#10B981" font-size="14" text-anchor="middle" font-bold="true">Breakeven</text>
                
                <!-- P&L Labels -->
                <text x="200" y="300" fill="#EF4444" font-size="14" text-anchor="middle" font-bold="true">Fixed Max Loss</text>
                <text x="470" y="150" fill="#10B981" font-size="18" text-anchor="middle" font-weight="900" transform="rotate(-30 470,150)">UNLIMITED GAIN →</text>
                
                <!-- Nifty Axis Label -->
                <text x="300" y="50" fill="#94A3B8" font-size="12" text-anchor="middle" font-mono="true">Nifty Price at Expiry (X-Axis)</text>
              </svg>
            </div>
            <p class="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed border-t border-slate-700/50 pt-5">
              <strong>The Golden Rule of Buying Options:</strong> Notice how the red line explicitly stops going down. Your downside risk is mathematically floored by the premium paid. However, as the underlying asset price marches upward organically, the green profit vector climbs toward infinity. You have defined risk, with unlimited theoretical reward.
            </p>
         </div>
         
         <p class="text-slate-300 leading-relaxed mb-6">
           This asymmetry is the exact reason global hedge funds, massive financial institutions, and professional retail quants use Options. You do not deploy hundreds of millions of dollars into naked equities without a mathematical hedge. Options are the ultimate risk-isolation tool in modern finance.
         </p>
       `
    },
    {
       heading: "5. Buyer vs Seller Dynamics (The Zero-Sum Game)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If the Option buyer has mathematically capped risk and theoretically unlimited reward, who in their right mind is taking the other side of this trade? Who is the "Builder" from our Real Estate analogy?</p>
         <p class="text-slate-300 leading-relaxed mb-8">This entity is the <strong>Option Seller (or Option Writer)</strong>.</p>
         
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           <div class="bg-black/30 p-8 rounded-2xl border border-blue-500/20 shadow-inner">
             <h4 class="text-blue-400 font-bold text-xl mb-4 text-center border-b border-blue-500/20 pb-4">The Option Buyer</h4>
             <ul class="space-y-4">
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Pays Premium Upfront</strong>
                   <span class="text-slate-400 text-sm">Requires very low capital. Buying a Nifty lot might cost just ₹5,000.</span>
                 </div>
               </li>
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Needs Momentum</strong>
                   <span class="text-slate-400 text-sm">Requires huge, violent movement in the market to overcome the premium hurdle.</span>
                 </div>
               </li>
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-rose-500/20 p-2 rounded-lg text-rose-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Fights Time (Theta Decay)</strong>
                   <span class="text-slate-400 text-sm">Every single passing day bleeds the option premium value down to zero.</span>
                 </div>
               </li>
             </ul>
           </div>
           
           <div class="bg-black/30 p-8 rounded-2xl border border-amber-500/20 shadow-inner">
             <h4 class="text-amber-400 font-bold text-xl mb-4 text-center border-b border-amber-500/20 pb-4">The Option Seller (Writer)</h4>
             <ul class="space-y-4">
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-amber-500/20 p-2 rounded-lg text-amber-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Collects Premium Instantly</strong>
                   <span class="text-slate-400 text-sm">Requires massive capital (Margin). Selling a Nifty lot requires ~₹1,15,000 in blocked margin from the broker.</span>
                 </div>
               </li>
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Wins on Sideways Markets</strong>
                   <span class="text-slate-400 text-sm">If Nifty stays totally flat and does absolutely nothing, the seller keeps the entire premium collected.</span>
                 </div>
               </li>
               <li class="flex items-start gap-4">
                 <div class="mt-1 bg-rose-500/20 p-2 rounded-lg text-rose-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                 <div>
                   <strong class="text-white block mb-1">Undefined Danger Risk</strong>
                   <span class="text-slate-400 text-sm">Faces potentially unlimited losses if the market violently crashes or rockets against their sold strike.</span>
                 </div>
               </li>
             </ul>
           </div>
         </div>
         
         <p class="text-slate-300 leading-relaxed mb-6 bg-rose-900/10 p-6 rounded-xl border-l-4 border-rose-500">
           <strong>The Institutional Reality:</strong> Almost all retail traders buy OTM options because it's cheap (₹2,000 for a lottery ticket). Almost all institutional and proprietary algorithms <em>sell</em> these OTM options to the retail traders, capturing the steady decay of Time (Theta) and holding massive win probabilities (~80%). OptionsGyani's Backtester allows you to simulate both sides over years of historical NSE tick data so you can quantifiably see the edge of Option Selling.
         </p>
       `
    }
  ]
};

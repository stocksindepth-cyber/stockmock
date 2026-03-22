export const MODULES_BASICS_GREEKS = {
  // MODULE 1: Basics
  "what-are-options": {
    title: "What Are Options? Complete Beginner's Guide",
    meta: "Learn the basics of options trading — calls, puts, strike prices, expiry dates, and how options work in the Indian stock market.",
    sections: [
      {
        heading: "1. The Fundamental Definition",
        content: `
          <p class="text-xl leading-relaxed mb-6 text-slate-300">An option is a derivative financial contract that gives the buyer the <strong>right, but not the obligation</strong>, to buy or sell an underlying asset (such as the NIFTY 50 index, BANKNIFTY, or individual stocks like Reliance) at a predetermined price (the <em>strike price</em>) on or before a specified date (the <em>expiry</em>).</p>
          
          <div class="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
            <h4 class="text-blue-400 font-bold mb-2">The Real Estate Analogy: Booking a Flat</h4>
            <p class="text-slate-300 mb-4">Imagine you want to buy a luxury apartment currently valued at ₹1 Crore. You believe a new metro station will be announced next month, pushing the value to ₹1.2 Crore. But you don't have ₹1 Crore today.</p>
            <p class="text-slate-300 mb-4">You approach the builder and pay a non-refundable <strong>Booking Token of ₹2 Lakhs</strong>. This token gives you the right to buy the flat at ₹1 Crore anytime in the next 3 months.</p>
            <ul class="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Scenario A (Metro Announced):</strong> The flat is now worth ₹1.2 Cr. You exercise your right, buy it for ₹1 Cr, and instantly make a ₹18 Lakh profit (₹20L gain - ₹2L token).</li>
              <li><strong>Scenario B (Market Crashes):</strong> The flat value drops to ₹80 Lakhs. Are you forced to buy it at ₹1 Cr? No! You simply walk away. Your maximum loss is strictly limited to the ₹2 Lakh token.</li>
            </ul>
          </div>
          <p class="text-slate-300 leading-relaxed mb-4">This is exactly how Options work in the stock market. The flat is the <em>Underlying Asset (NIFTY)</em>, the ₹1 Cr price is the <em>Strike Price</em>, the 3-month window is the <em>Expiry Date</em>, and the ₹2 Lakh token is the <em>Premium</em>.</p>
        `,
      },
      {
        heading: "2. The Mathematical Asymmetry (With Diagram)",
        content: `
          <p class="text-slate-300 leading-relaxed mb-6">The primary reason professional traders use options instead of buying the stock directly is the <strong>asymmetric payoff profile</strong>. When you buy an option, your risk is strictly capped to the premium paid, but your reward is theoretically infinite.</p>
          
          <div class="mt-8 mb-8 p-8 bg-[#0B1120] rounded-2xl border border-emerald-500/20 relative overflow-hidden text-center">
            <h4 class="text-white font-bold mb-6 text-xl">The Asymmetric Payoff Graph (Call Option Buyer)</h4>
            <div class="flex justify-center w-full">
              <svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <line x1="50" y1="200" x2="350" y2="200" stroke="#334155" stroke-width="2" />
                <line x1="50" y1="50" x2="50" y2="200" stroke="#334155" stroke-width="2" />
                <text x="35" y="204" fill="#94A3B8" font-size="12" text-anchor="end">₹0</text>
                <line x1="50" y1="220" x2="250" y2="220" stroke="#EF4444" stroke-width="2" stroke-dasharray="4" />
                <path d="M 50,220 L 200,220 L 350,50" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="200" y1="195" x2="200" y2="205" stroke="#94A3B8" stroke-width="2" />
                <text x="200" y="235" fill="#94A3B8" font-size="12" text-anchor="middle">Strike Price</text>
                <circle cx="218" cy="200" r="4" fill="#10B981" />
                <text x="218" y="185" fill="#10B981" font-size="12" text-anchor="middle">Breakeven</text>
                <text x="125" y="215" fill="#EF4444" font-size="10" text-anchor="middle">Max Risk (Premium)</text>
                <text x="300" y="100" fill="#10B981" font-size="14" font-weight="bold">Unlimited Profit</text>
              </svg>
            </div>
            <p class="text-slate-400 mt-6 text-sm max-w-lg mx-auto">Notice how your risk is strictly capped horizontally at the downside (the premium paid), while your profit potential extends infinitely upwards as the underlying price rises.</p>
          </div>
        `,
      },
    ],
  },
  "call-vs-put": {
    title: "Call vs Put Options (The Ultimate Rule)",
    meta: "Master the foundation of derivatives: Calls and Puts. Understand how to use them for directional betting.",
    sections: [
      {
        heading: "1. The Two Pillars of Directional Trading",
        content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4">
            <div class="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/></svg>
              </div>
              <h3 class="text-emerald-400 font-bold text-2xl mb-3 flex items-center gap-2">Call Options (CE)</h3>
              <p class="text-slate-300 mb-4 h-16">Gives you the right to <strong>BUY</strong> the underlying asset. Buy a Call when you are <em>Bullish</em>.</p>
              <div class="bg-black/30 p-4 rounded-lg text-sm text-slate-300 font-mono">
                Spot: 22,000<br/>
                Buy: 22,000 CE @ ₹100<br/>
                <span class="text-slate-500">--- Market hits 22,400 ---</span><br/>
                <span class="text-emerald-400 font-bold mt-2 block">Profit: ₹300/share (₹15,000/lot)</span>
              </div>
            </div>
            <div class="bg-rose-900/10 border border-rose-500/20 p-6 rounded-2xl relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M3 7l6 6 4-4 8 8"/></svg>
              </div>
              <h3 class="text-rose-400 font-bold text-2xl mb-3 flex items-center gap-2">Put Options (PE)</h3>
              <p class="text-slate-300 mb-4 h-16">Gives you the right to <strong>SELL</strong> the underlying asset. Buy a Put when you are <em>Bearish</em>.</p>
              <div class="bg-black/30 p-4 rounded-lg text-sm text-slate-300 font-mono">
                Spot: 22,000<br/>
                Buy: 22,000 PE @ ₹100<br/>
                <span class="text-slate-500">--- Market drops 21,500 ---</span><br/>
                <span class="text-rose-400 font-bold mt-2 block">Profit: ₹400/share (₹20,000/lot)</span>
              </div>
            </div>
          </div>
          <p class="text-slate-300 leading-relaxed mb-6">Never blindly buy Calls and Puts. The single biggest reason retail traders lose is buying options just because they expect direction, without accounting for Volatility and Time Decay.</p>
        `
      }
    ]
  },
  "moneyness": {
    title: "ITM, ATM, and OTM (Moneyness)",
    meta: "In-The-Money, At-The-Money, and Out-of-The-Money options explained in depth for the Indian market.",
    sections: [
       {
        heading: "1. The Moneyness Paradigm",
        content: `
          <p class="text-slate-300 leading-relaxed mb-6">A beginner mistake is to buy cheap Out-of-The-Money (OTM) options. Statistically, 80% of OTM options expire completely worthless at zero. Trading options is not gambling; it's probability math.</p>
          
          <div class="overflow-x-auto mb-8">
            <table class="w-full text-left border-collapse border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <thead>
                <tr class="bg-slate-800/80 text-slate-300 border-b border-white/10 text-sm">
                  <th class="p-4 font-semibold">State</th>
                  <th class="p-4 font-semibold border-l border-white/5">Definition</th>
                  <th class="p-4 font-semibold border-l border-white/5">Pricing Dynamics</th>
                  <th class="p-4 font-semibold border-l border-white/5">Trader Logic</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr class="border-b border-white/5 bg-emerald-900/10 hover:bg-emerald-900/20 transition-colors">
                  <td class="p-4 text-emerald-400 font-bold flex items-center gap-2">ITM</td>
                  <td class="p-4 text-slate-300 border-l border-white/5 font-mono">Strike &lt; Spot</td>
                  <td class="p-4 text-slate-400 border-l border-white/5 leading-relaxed">Has Intrinsic Value + Extrinsic Value.</td>
                  <td class="p-4 text-emerald-300 border-l border-white/5 leading-relaxed font-semibold">Used by professionals mapping exact directional breakouts. Lowest risk of complete premium decay.</td>
                </tr>
                <tr class="border-b border-white/5 bg-blue-900/10 hover:bg-blue-900/20 transition-colors">
                  <td class="p-4 text-blue-400 font-bold">ATM</td>
                  <td class="p-4 text-slate-300 border-l border-white/5 font-mono">Strike = Spot</td>
                  <td class="p-4 text-slate-400 border-l border-white/5 leading-relaxed">100% Extrinsic Value. Highest Theta decay.</td>
                  <td class="p-4 text-blue-300 border-l border-white/5 leading-relaxed font-semibold">Used primarily by Option Sellers (Straddles) looking to capture the rapid time decay.</td>
                </tr>
                <tr class="bg-rose-900/10 hover:bg-rose-900/20 transition-colors">
                  <td class="p-4 text-rose-400 font-bold">OTM</td>
                  <td class="p-4 text-slate-300 border-l border-white/5 font-mono">Strike &gt; Spot</td>
                  <td class="p-4 text-slate-400 border-l border-white/5 leading-relaxed">100% Extrinsic Value. Delta &lt; 0.3.</td>
                  <td class="p-4 text-rose-300 border-l border-white/5 leading-relaxed font-semibold">Lottery tickets. Retail buyers buy them expecting a miracle. Pros consistently sell them.</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
      },
      {
        heading: "2. The Visual Representation of Moneyness",
        content: `
          <div class="mt-8 mb-8 p-8 bg-[#0B1120] rounded-2xl border border-white/10 relative overflow-hidden text-center">
            <h4 class="text-white font-bold mb-6 text-xl">Nifty Options Chain Moneyness (Call Perspective)</h4>
            <div class="flex justify-center w-full">
              <div class="w-full max-w-sm border border-slate-700 rounded-lg overflow-hidden">
                <div class="bg-emerald-900/30 p-3 text-emerald-400 font-mono flex justify-between border-b border-slate-700"><span>21800 CE</span> <span>₹250</span></div>
                <div class="bg-emerald-900/30 p-3 text-emerald-400 font-mono flex justify-between border-b border-slate-700"><span>21900 CE</span> <span>₹170</span></div>
                <div class="bg-blue-900/50 p-3 text-blue-400 font-bold font-mono flex justify-between border-b border-slate-700"><span>22000 CE (Spot)</span> <span>₹100</span></div>
                <div class="bg-rose-900/20 p-3 text-rose-400 font-mono flex justify-between border-b border-slate-700"><span>22100 CE</span> <span>₹45</span></div>
                <div class="bg-rose-900/20 p-3 text-rose-400 font-mono flex justify-between"><span>22200 CE</span> <span>₹15</span></div>
              </div>
            </div>
            <p class="text-slate-400 mt-6 text-sm">Notice how moving further OTM drastically reduces the premium, but also your probability of winning.</p>
          </div>
        `
      }
    ]
  },
  "options-pricing": {
    title: "Intrinsic Value vs Time Value",
    meta: "Understand the mathematical formula governing option premiums: Extrinsic vs Intrinsic value.",
    sections: [
      {
        heading: "1. The God Formula of Options",
        content: `
          <p class="text-slate-300 mb-6">Every single option premium on the NSE Option Chain is precisely composed of two mathematical variables:</p>
          <div class="bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-8 rounded-2xl mb-8 text-center mx-auto max-w-2xl transform hover:scale-[1.02] transition-all">
             <h3 class="text-2xl font-mono text-white tracking-wider"><span class="text-emerald-400">Total Premium</span> = <span class="text-blue-400">Intrinsic Value</span> + <span class="text-rose-400">Time Value</span></h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-[#0B1120] p-6 rounded-xl border border-white/5">
                <h4 class="text-blue-400 font-bold text-lg mb-3">What is Intrinsic Value?</h4>
                <p class="text-slate-300 text-sm leading-relaxed mb-4">The real, tangible value if the option expired exactly <em>right now</em>. Only ITM options have intrinsic value. All OTM options have exactly zero intrinsic value.</p>
                <div class="bg-black/50 p-3 rounded font-mono text-xs text-slate-400">
                   Formula: Spot Price - Strike Price<br/>
                   Ex: Nifty Spot is 22,200. You hold 22,000 CE.<br/>
                   Intrinsic Value = 22,200 - 22,000 = ₹200.
                </div>
             </div>
             
             <div class="bg-[#0B1120] p-6 rounded-xl border border-white/5">
                <h4 class="text-rose-400 font-bold text-lg mb-3">What is Time Value (Extrinsic)?</h4>
                <p class="text-slate-300 text-sm leading-relaxed mb-4">The "hope factor". This is the extra premium buyers are willing to pay for the <em>probability</em> that the option will move further into the money before expiry.</p>
                <div class="bg-black/50 p-3 rounded font-mono text-xs text-slate-400">
                   If that 22,000 CE is trading at ₹250.<br/>
                   Time Value = Total Premium (₹250) - Intrinsic (₹200)<br/>
                   Time Value = ₹50. (This ₹50 will bleed to zero by expiry).
                </div>
             </div>
          </div>
        `
      }
    ]
  },

  // MODULE 2: Greeks
  "delta-gamma": {
    title: "Delta & Gamma: Directional Setup",
    meta: "Master the most critical Options Greeks: Delta (Direction) and Gamma (Acceleration). Includes real Nifty examples.",
    sections: [
      {
         heading: "1. Delta (Δ) - The Speedometer",
         content: `
           <p class="text-slate-300 mb-6">Delta is the lifeblood of directional option traders. It measures exactly how much an option's premium will change for every ₹1 move in the underlying index (NIFTY).</p>
           
           <div class="flex flex-col md:flex-row gap-6 mb-8">
             <div class="flex-1 bg-slate-800/40 p-5 rounded-xl border-l-4 border-emerald-500">
               <h5 class="text-emerald-400 font-bold">Call Delta Range</h5>
               <p class="text-xl font-mono text-white mt-1">0 to +1.0</p>
               <p class="text-sm text-slate-400 mt-2">Nifty moves up by ₹100. Call Delta is 0.50. Premium goes up by ₹50.</p>
             </div>
             <div class="flex-1 bg-slate-800/40 p-5 rounded-xl border-l-4 border-rose-500">
               <h5 class="text-rose-400 font-bold">Put Delta Range</h5>
               <p class="text-xl font-mono text-white mt-1">-1.0 to 0</p>
               <p class="text-sm text-slate-400 mt-2">Nifty moves up by ₹100. Put Delta is -0.50. Premium goes DOWN by ₹50.</p>
             </div>
           </div>

           <div class="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl mb-8 relative overflow-hidden">
             <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
             <h4 class="text-blue-400 font-bold mb-3 text-lg flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                The Retail Misconception: The Zero Delta Trap
             </h4>
             <p class="text-slate-300 leading-relaxed">Beginners buy deep OTM options (e.g. 1000 points away) which have a Delta of 0.05. If Nifty rallies 100 points, their premium only increases by exactly ₹5. Meanwhile, the Theta decay eats ₹10 a day. You are mathematically losing money even when you predict the direction right.</p>
           </div>
         `
      },
      {
         heading: "2. Gamma (Γ) - The Accelerator",
         content: `
           <p class="text-slate-300 mb-6">If Delta is your car's speed, Gamma is the acceleration factor. <strong>Gamma measures how fast your Delta changes.</strong></p>
           
           <p class="text-slate-300 mb-6">Gamma is strictly highest at the At-The-Money (ATM) strike, and especially explosive close to expiry (0 DTE). This is why ATM options can explode from ₹5 to ₹100 in two hours on Thursday Expiries—Gamma shoots up, increasing Delta rapidly, turning a 0.2 Delta option into a 0.8 Delta option within minutes.</p>
           
           <div class="bg-[#0B1120] p-6 rounded-xl border border-white/5 text-center mt-6">
             <h4 class="text-white font-bold mb-4 w-full">The Expiry Gamma Risk Profile</h4>
             <div class="flex justify-center">
                 <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                   <!-- Axes -->
                   <line x1="50" y1="180" x2="350" y2="180" stroke="#334155" stroke-width="2" />
                   <line x1="50" y1="20" x2="50" y2="180" stroke="#334155" stroke-width="2" />
                   
                   <!-- Labels -->
                   <text x="200" y="195" fill="#94A3B8" font-size="12" text-anchor="middle">Strike Price vs Spot</text>
                   <text x="20" y="100" fill="#94A3B8" font-size="12" transform="rotate(-90 20,100)" text-anchor="middle">Gamma Value</text>
                   
                   <!-- Low Gamma curve (30 DTE) -->
                   <path d="M 50,160 Q 200,80 350,160" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="5" />
                   <text x="320" y="150" fill="#3B82F6" font-size="10">30 Days</text>
                   
                   <!-- High Gamma curve (0 DTE) -->
                   <path d="M 50,180 C 150,180 180,30 200,30 C 220,30 250,180 350,180" fill="none" stroke="#F59E0B" stroke-width="3" />
                   <text x="250" y="40" fill="#F59E0B" font-size="12" font-weight="bold">0 Days (Gamma Spike)</text>
                 </svg>
             </div>
             <p class="text-slate-400 text-xs mt-4">Notice how Gamma violently spikes exactly at the ATM mark on expiry day. This creates massive risk for option sellers, known as "Gamma Risk".</p>
           </div>
         `
      }
    ]
  },
  "theta-decay": {
    title: "Theta: Mastering Time Decay",
    meta: "Learn the mathematics of Theta decay and why 80% of options expire worthless.",
    sections: [
      {
         heading: "1. Theta (Θ) - The Bleeding Value",
         content: `
           <p class="text-slate-300 mb-6 text-lg font-light leading-relaxed">Theta measures how much value an option loses per day purely due to the passage of time. The fundamental law of options is that time is the enemy of the buyer, and the best friend of the seller.</p>

           <div class="mt-8 mb-8 p-8 bg-[#0B1120] rounded-2xl border border-white/10 relative overflow-hidden text-center shadow-2xl">
            <h4 class="text-white font-bold mb-6 text-xl">The Non-Linear Theta Decay Curve</h4>
            <div class="flex justify-center w-full">
              <svg width="450" height="220" viewBox="0 0 450 220" xmlns="http://www.w3.org/2000/svg">
                <!-- Curve -->
                <path d="M 50,40 Q 300,50 400,190" fill="none" stroke="#EF4444" stroke-width="5" stroke-linecap="round" />
                <!-- Axes -->
                <line x1="40" y1="190" x2="420" y2="190" stroke="#334155" stroke-width="2" />
                <line x1="50" y1="30" x2="50" y2="190" stroke="#334155" stroke-width="2" />
                
                <!-- Markers -->
                <line x1="50" y1="185" x2="50" y2="195" stroke="#94A3B8" stroke-width="2" />
                <text x="50" y="210" fill="#94A3B8" font-size="12" text-anchor="middle">30 Days</text>
                
                <line x1="250" y1="185" x2="250" y2="195" stroke="#94A3B8" stroke-width="2" />
                <text x="250" y="210" fill="#94A3B8" font-size="12" text-anchor="middle">10 Days</text>
                
                <line x1="400" y1="185" x2="400" y2="195" stroke="#94A3B8" stroke-width="2" />
                <text x="400" y="210" fill="#94A3B8" font-size="12" text-anchor="middle">0 Days (Expiry)</text>
                
                <!-- Highlight Box -->
                <rect x="250" y="60" width="150" height="130" fill="#EF4444" opacity="0.1" />
                <text x="325" y="100" fill="#EF4444" font-size="12" text-anchor="middle" font-weight="bold">The Waterfall Effect!</text>
                <text x="325" y="120" fill="#EF4444" font-size="10" text-anchor="middle">Time decay accelerates</text>
                <text x="325" y="135" fill="#EF4444" font-size="10" text-anchor="middle">massively in final days.</text>
              </svg>
            </div>
          </div>
          
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div class="bg-blue-900/10 border-t-2 border-blue-500 p-6">
               <h4 class="text-blue-400 font-bold mb-3">Option Buyers (Long)</h4>
               <p class="text-slate-300 text-sm">Theta is NEGATIVE. You are bleeding daily. If Nifty simply stays flat over the weekend, you will wake up heavily in losses on Monday morning.</p>
             </div>
             <div class="bg-emerald-900/10 border-t-2 border-emerald-500 p-6">
               <h4 class="text-emerald-400 font-bold mb-3">Option Sellers (Short)</h4>
               <p class="text-slate-300 text-sm">Theta is POSITIVE. Time is physically depositing money into your account. Sellers dominate the markets on Wednesday and Thursday exclusively to capture the "Waterfall" decay.</p>
             </div>
           </div>
         `
      }
    ]
  },
  "vega-volatility": {
    title: "Vega: Capitalizing on IV Crush",
    meta: "Master the most explosive Greek: Vega. Understand Implied Volatility and the phenomenon of IV Crush.",
    sections: [
      {
         heading: "1. The True Driver of Option Prices",
         content: `
           <p class="text-slate-300 mb-6 leading-relaxed">Most retail traders think option prices only move because the underlying stock price moves. This is entirely false. Option premiums are incredibly sensitive to market fear, represented by <strong>Implied Volatility (IV)</strong>, which is measured by Vega.</p>
           
           <div class="bg-gradient-to-br from-rose-900/20 to-black border border-rose-500/20 p-8 rounded-2xl mb-8">
             <h4 class="text-rose-400 text-xl font-bold mb-4">The Election Day "IV Crush" Trap</h4>
             <p class="text-slate-300 mb-4">You predict Modi will easily win the election, so three days prior, you buy 22,500 ATM calls. Because the entire market is uncertain, IV skyrockets to 35%. You severely overpay for the option (₹400 premium).</p>
             <p class="text-slate-300 mb-4">Election day comes. Modi wins (just as you predicted). Nifty rallies 100 points.</p>
             <p class="text-slate-300"><strong>The Result:</strong> The uncertainty is over. IV instantly drops from 35% back down to 14%. Your option premium completely collapses from ₹400 down to ₹150. You predicted the direction perfectly, but the Vega crush wiped out 60% of your capital in a single second. <strong>Never buy options immediately before major binary events.</strong></p>
           </div>
           
           <h4 class="text-white font-bold text-lg mb-4">How to properly trade IV</h4>
           <ul class="space-y-4 text-slate-300">
             <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Buy Options when IV is objectively low (Market is bored, VIX < 12) expecting an explosive breakout.</li>
             <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>Sell Options (Credit Spreads) when IV is extraordinarily high (VIX > 22) expecting regression to the mean.</li>
           </ul>
         `
      }
    ]
  },
  "india-vix": {
    title: "India VIX: The Fear Gauge",
    meta: "A complete quantitative guide to the India VIX index and its direct correlation to NSE option premium pricing.",
    sections: [
      {
         heading: "1. VIX Correlation Mechanics",
         content: `
           <p class="text-slate-300 mb-6">The India Volatility Index (VIX) is computed by the NSE using the order book of NIFTY options. It represents the 30-day expected annualized volatility of the market based on how much traders are bidding up option quotes.</p>
           
           <div class="overflow-x-auto my-8">
             <table class="w-full text-left border-collapse bg-[#0B1120] border border-white/5 rounded-xl">
               <thead>
                 <tr class="bg-black/50 text-slate-300 text-sm uppercase tracking-wider">
                   <th class="p-5 font-bold border-b border-white/5">VIX Level</th>
                   <th class="p-5 font-bold border-b border-white/5">Market State</th>
                   <th class="p-5 font-bold border-b border-white/5">Optimal Strategy Matrix</th>
                 </tr>
               </thead>
               <tbody class="text-slate-300 text-sm">
                 <tr class="border-b border-white/5">
                   <td class="p-5 font-mono text-emerald-400 font-bold">&lt; 12.0</td>
                   <td class="p-5">Extreme Complacency</td>
                   <td class="p-5">Long Straddles, Debit Spread Breakouts. Options are dirt cheap. Horrible environment for selling.</td>
                 </tr>
                 <tr class="border-b border-white/5 bg-white/[0.02]">
                   <td class="p-5 font-mono text-blue-400 font-bold">14.0 - 18.0</td>
                   <td class="p-5">Normal Choppy Regime</td>
                   <td class="p-5">Iron Condors, Ratio Spreads, Calendar Spreads.</td>
                 </tr>
                 <tr>
                   <td class="p-5 font-mono text-rose-400 font-bold">&gt; 22.0</td>
                   <td class="p-5">High Fear / Panic</td>
                   <td class="p-5">Short Strangles (Very Far OTM), Credit Spreads. Colossal premiums. Massive tail risk.</td>
                 </tr>
               </tbody>
             </table>
           </div>
         `
      }
    ]
  }
};

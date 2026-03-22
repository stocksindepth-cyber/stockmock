export const MODULES_STRATEGIES_RISK = {
  // MODULE 3: Non-Directional
  "iron-condor": {
    title: "Iron Condor: The Ultimate Range Setup",
    meta: "Master the iron condor options strategy for range-bound markets. Learn setup, adjustment, and management on NIFTY.",
    sections: [
      {
         heading: "1. The Setup & Payoff",
         content: `
           <p class="text-slate-300 mb-6">The Iron Condor is the crown jewel of quantitative neutral trading. It allows you to define a massive "Profit Tent" while keeping your risk strictly, mathematically capped.</p>
           
           <div class="mt-8 mb-8 p-8 bg-[#0B1120] rounded-2xl border border-white/10 relative overflow-hidden text-center shadow-lg hover:shadow-blue-500/10 transition-shadow">
            <h4 class="text-white font-bold mb-6 text-xl">Iron Condor Payoff Diagram</h4>
            <div class="flex justify-center w-full">
              <svg width="500" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid Lines -->
                <line x1="50" y1="200" x2="450" y2="200" stroke="#334155" stroke-width="2" />
                <line x1="50" y1="50" x2="50" y2="200" stroke="#334155" stroke-width="2" />
                
                <!-- Zero Line Label -->
                <text x="35" y="154" fill="#94A3B8" font-size="12" text-anchor="end">₹0</text>
                <line x1="50" y1="150" x2="450" y2="150" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4" />
                
                <!-- Payoff Line -->
                <path d="M 50,220 L 150,220 L 200,80 L 300,80 L 350,220 L 450,220" fill="none" stroke="#3B82F6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Profit Zone -->
                <rect x="180" y="80" width="140" height="70" fill="#10B981" opacity="0.2" />
                <text x="250" y="110" fill="#10B981" font-size="14" font-weight="bold" text-anchor="middle">Max Profit Tent</text>
                
                <!-- Max Loss Zone -->
                <text x="100" y="210" fill="#EF4444" font-size="10" text-anchor="middle">Defined Max Risk</text>
                <text x="400" y="210" fill="#EF4444" font-size="10" text-anchor="middle">Defined Max Risk</text>
                
                <!-- Strikes -->
                <circle cx="200" cy="80" r="4" fill="#3B82F6" />
                <text x="200" y="65" fill="#3B82F6" font-size="11" text-anchor="middle">Short Put</text>
                
                <circle cx="300" cy="80" r="4" fill="#3B82F6" />
                <text x="300" y="65" fill="#3B82F6" font-size="11" text-anchor="middle">Short Call</text>
              </svg>
            </div>
          </div>
          <p class="text-slate-300 mb-6 leading-relaxed">You simultaneously execute two transactions: <strong>Sell an OTM Put Spread</strong> and <strong>Sell an OTM Call Spread</strong>, receiving a net premium credit from the market. As long as NIFTY stays nestled between your two short strikes on Expiry day, you keep 100% of the premium.</p>
         `
      },
      {
         heading: "2. The Mathematical Example",
         content: `
           <p class="text-slate-300 mb-4">Let's say NIFTY is currently at 22,000.</p>
           <ul class="list-none space-y-4 mb-8">
             <li class="p-4 bg-rose-900/10 border border-rose-500/20 rounded-xl">
               <span class="text-rose-400 font-bold block mb-1">BEAR CALL SPREAD (Top Side Risk)</span>
               Sell 22,200 Call (Receive ₹50 premium)<br/>
               Buy 22,300 Call (Pay ₹20 premium)
             </li>
             <li class="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
               <span class="text-emerald-400 font-bold block mb-1">BULL PUT SPREAD (Bottom Side Risk)</span>
               Sell 21,800 Put (Receive ₹40 premium)<br/>
               Buy 21,700 Put (Pay ₹15 premium)
             </li>
           </ul>
           <p class="text-slate-300 lead"><strong>Net Credit Received:</strong> <span class="bg-black/30 p-1 px-3 rounded font-mono text-emerald-400 font-bold shadow-inner">₹55/lot</span></p>
           <p class="text-slate-300 mt-6">If the market goes totally flat, or swings anywhere between 21,800 and 22,200, you have built a perfect 400-point profit trap.</p>
         `
      }
    ]
  },
  "short-strangle": {
    title: "Short Strangle: Collecting Unlimited Premium",
    meta: "The Short Strangle is the king of weekly income generation in the Indian market.",
    sections: [
      {
         heading: "1. The Professional's Choice",
         content: `
           <p class="text-slate-300 mb-6">A Short Strangle involves simply selling an OTM Call and selling an OTM Put. It creates an enormous profit range, but uniquely exposes the trader to <strong>Unlimited Risk</strong> on both tails.</p>
           <div class="bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/20 p-8 rounded-2xl mb-8">
             <h4 class="text-indigo-400 text-xl font-bold mb-4">Option Writers Weekly Arsenal</h4>
             <p class="text-slate-300 mb-4 leading-relaxed">In the Indian market, algorithmic sellers deploy massive Short Strangles on Thursday (Expiry) morning at 9:30 AM. They sell 1-Delta OTM options on both wings. By 11:30 AM, if the market has merely oscillated by a few points, rapid Theta decay (Theta Waterfall) instantly wipes out those option premiums, allowing sellers to capture large yields in a span of 3 hours.</p>
             <p class="text-rose-400 font-bold flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Critical Warning: Because risk is technically unlimited (A Black Swan crash destroys the short Put wing instantly), hard automated Stop-Losses of 30% to 50% on the individual premium legs are mandatory.</p>
           </div>
         `
      }
    ]
  },
  "iron-butterfly": {
    title: "Iron Butterfly vs Iron Condor",
    meta: "A hyper-targeted volatility strategy that maximizes premium capture at a specific strike pin.",
    sections: [
      {
         heading: "1. The Premium Vacuum",
         content: `
           <p class="text-slate-300 mb-6">The Iron Butterfly is simply an Iron Condor where the Short Strikes have been dragged violently right directly into the ATM spot. By selling strictly ATM, you capture vastly more initial premium (because ATM has the highest Extrinsic Value), increasing your maximum localized profit significantly.</p>
           <p class="text-slate-300 mb-6">However, your "Profit Tent" becomes a narrow pointed "V" shape rather than a wide flat plateau. The market must "pin" exactly at your sold strike on expiry day to achieve Max Profit.</p>
           <div class="overflow-x-auto my-8 mt-2">
             <table class="w-full text-left border-collapse bg-[#0B1120] border border-white/5 rounded-xl">
               <thead>
                 <tr class="bg-black/50 text-slate-300 text-sm">
                   <th class="p-5 font-bold border-b border-white/5">Strategy Metric</th>
                   <th class="p-5 font-bold border-b border-white/5 text-blue-400">Iron Condor</th>
                   <th class="p-5 font-bold border-b border-white/5 text-emerald-400">Iron Butterfly</th>
                 </tr>
               </thead>
               <tbody class="text-slate-300 text-sm">
                 <tr class="border-b border-white/5">
                   <td class="p-5 font-bold">Max Profit Zone</td>
                   <td class="p-5">Massive flat plateau across OTM strikes</td>
                   <td class="p-5">Sharp peak exactly at ATM</td>
                 </tr>
                 <tr class="border-b border-white/5">
                   <td class="p-5 font-bold">Initial Credit Received</td>
                   <td class="p-5">Moderate (Selling cheap OTMs)</td>
                   <td class="p-5 font-bold text-emerald-400">Massive (Selling expensive ATMs)</td>
                 </tr>
                 <tr>
                   <td class="p-5 font-bold">Win Probability</td>
                   <td class="p-5">~60% to 80% Win Rate</td>
                   <td class="p-5">~35% to 50% Win Rate</td>
                 </tr>
               </tbody>
             </table>
           </div>
         `
      }
    ]
  },
  "batman-spread": {
    title: "The Batman Strategy (Double Ratio)",
    meta: "A highly advanced Double Ratio spread designed for decreasing volatility environments.",
    sections: [
      {
         heading: "1. The Advanced Setup",
         content: `
           <p class="text-slate-300 mb-6">The Batman is a complex 4-leg quantitative structure. It effectively fuses a Front Put Ratio Spread (Buy 1 ATM, Sell 2 OTM) and a Front Call Ratio Spread (Buy 1 ATM, Sell 2 OTM).</p>
           <p class="text-slate-300 mb-6">The resulting algorithmic payoff graph forms two immense, sharp profit peaks resembling Batman's ears, surrounded by a shallow valley in the middle. If Nifty drifts moderately into either of the two "ear" zones and volatility drops, the ROI is spectacular.</p>
           <p class="text-slate-300 mb-6">It is best constructed for a net credit, ensuring that if the market stagnates perfectly in the center "valley", you still scratch out a tiny profit instead of losing money.</p>
         `
      }
    ]
  },

  // MODULE 4: Directional
  "bull-call-spread": {
    title: "Bull Call Spread (Debit Spread)",
    meta: "A safer, mathematically capped alternative to buying naked calls.",
    sections: [
      {
         heading: "1. Defined Bullish Risk",
         content: `
           <p class="text-slate-300 mb-6 text-lg font-light">Buying a naked Call subjects you to brutal Theta decay and massive IV crush. A Bull Call Spread quantitatively fixes these flaws.</p>
           <p class="text-slate-300 mb-6">You Buy an ATM Call, but simultaneously Sell a higher OTM Call to finance the purchase. The premium you receive from the short leg completely offsets the Theta drain of your long leg.</p>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
             <div class="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden">
                <div class="w-1 absolute left-0 top-0 h-full bg-emerald-500"></div>
                <h4 class="text-emerald-400 font-bold mb-3">Mathematical Advantages</h4>
                <ul class="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                  <li>Drastically reduces required upfront capital.</li>
                  <li>Inverts your Vega exposure (protects against IV crush).</li>
                  <li>Drastically lowers Theta (Time) decay.</li>
                </ul>
             </div>
             <div class="bg-rose-900/10 border border-rose-500/20 p-6 rounded-xl relative overflow-hidden">
                <div class="w-1 absolute left-0 top-0 h-full bg-rose-500"></div>
                <h4 class="text-rose-400 font-bold mb-3">The Tradeoff</h4>
                <p class="text-slate-300 text-sm">Unlike a naked call which has unlimited theoretical profit, your maximum profit is artificially capped horizontally right at your short strike ceiling. If Nifty explodes upward +500 points past your short strike, you make mathematically zero additional rupees.</p>
             </div>
           </div>
         `
      }
    ]
  },
  "bear-put-spread": {
    title: "Bear Put Spread (Debit Spread)",
    meta: "A capped-risk strategy for bearish outlooks.",
    sections: [
      {
         heading: "1. Defined Bearish Risk",
         content: `
           <p class="text-slate-300 mb-6">The exact inverse of the Bull Call Spread. Buy an ATM Put, Sell a lower OTM Put.</p>
           <div class="bg-orange-900/10 border-l-4 border-orange-500 p-6 rounded-xl mb-6">
             <p class="text-slate-300 font-medium">This is highly recommended over naked Put buying during slow, grinding market downtrends. Institutional selling programs slowly push the market down, draining your Theta daily. A Bear Put Spread ensures you survive the grind and still profit from the underlying spatial move to the downside.</p>
           </div>
         `
      }
    ]
  },
  "ratio-spreads": {
    title: "Front Ratio Spreads",
    meta: "Advanced directional strategies that can be entered for a net credit.",
    sections: [
      {
         heading: "1. Getting Paid to Take Direction",
         content: `
           <p class="text-slate-300 mb-6">A Front Ratio Spread (e.g. Buy 1x 22000 CE, Sell 2x 22200 CE) allows you to express a moderately bullish view. Because you mathematically sell 2 OTM legs for every 1 ATM leg you buy, you can enter the entire directional trade receiving a Net Credit upfront.</p>
           <p class="text-slate-300 mb-6"><strong>The Unlimited Trap:</strong> If Nifty absolutely explodes upward past your short strikes natively due to a massive gap-up, your portfolio risk becomes fully unbounded. Ratio spreads are strictly designed for when you expect a slow, mild directional drift that is definitively capped by a resistance ceiling.</p>
         `
      }
    ]
  },

  // MODULE 5: Risk Management
  "position-sizing": {
    title: "Position Sizing in Volatility",
    meta: "The mathematical rule of ruin. Learn how to size your option positions to survive drawdowns.",
    sections: [
      {
         heading: "1. The Rule of Ruin",
         content: `
           <p class="text-slate-300 mb-6 text-lg">The vast majority of Retail F&O traders in India lose everything within 90 days. This is exceptionally rarely due to bad macro strategy. It is universally due to disastrous mathematical position sizing. Options are highly leveraged instruments that can systematically gap to zero overnight.</p>
           
           <div class="bg-[#0B1120] p-8 border border-white/5 rounded-2xl shadow-xl mt-8">
             <h4 class="text-amber-400 font-bold text-xl mb-4 border-b border-white/10 pb-4">The Institutional 2% Kelly Formula</h4>
             <p class="text-slate-300 mb-6">Never allocate more than 2% to 5% of your total liquid net worth into a single speculative naked options trade.</p>
             <div class="grid grid-cols-2 gap-4 text-center">
                <div class="bg-black/30 p-4 rounded-lg">
                   <div class="text-slate-400 text-sm mb-1">Your Trading Account</div>
                   <div class="text-white font-mono text-2xl">₹10,00,000</div>
                </div>
                <div class="bg-black/30 p-4 rounded-lg border border-rose-500/20">
                   <div class="text-slate-400 text-sm mb-1">Max Risk per Nifty Call Setup</div>
                   <div class="text-rose-400 font-mono font-bold text-2xl">₹20,000</div>
                </div>
             </div>
             <p class="text-slate-400 text-xs mt-6 text-center italic">Even if you assume a catastrophic 10-loss streak, your account survives to fight another day with ₹8,00,000 remaining.</p>
           </div>
         `
      }
    ]
  },
  "stop-losses-options": {
    title: "Option Stop Losses Mechanics",
    meta: "Handling stop losses on F&O instruments using Spot benchmarks vs Premium benchmarks in India.",
    sections: [
      {
         heading: "1. The Spot Matrix Approach",
         content: `
           <p class="text-slate-300 mb-6">Placing a hard "Stop Loss Limit" automated order directly on an illiquid OTM option on the NSE order book is technical suicide. Algorithmic High-Frequency Trading servers will occasionally execute "Freak Trades" where they deliberately spike the bid/ask spread instantaneously down to ZERO to legally trigger all pending Stop Loss orders at terrible execution prices, before instantly retreating.</p>
           
           <div class="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-xl mb-6 mt-6">
             <h4 class="text-blue-400 font-bold mb-2">Professional Strategy: The Spot Anchor</h4>
             <p class="text-slate-300">Never anchor your stop loss on the derivative instrument price. Anchor it on the underlying Spot chart.</p>
             <p class="text-slate-300 mt-2">If your trading assumption is based on Nifty holding the 22,000 Support level, set your alarm/alert for the exact moment the Nifty Spot chart breaches 21,990. When the alarm triggers, execute an immediate Market Order exit manually on your underlying option instrument via your terminal.</p>
           </div>
         `
      }
    ]
  },
  "backtesting-guide": {
    title: "How to Backtest Technical Systems",
    meta: "The scientific method to building trading systems via quantitative algorithms.",
    sections: [
      {
         heading: "1. The Edge of Quantitative Testing",
         content: `
           <p class="text-slate-300 mb-6 text-lg">Trading without a rigidly backtested quantitative edge is nothing more than throwing darts in the dark. Advanced execution engines like OptionsGyani's Backtester allow you to mathematically verify your strategy assumptions over 3-year timelines.</p>
           
           <h4 class="text-white font-bold text-lg mb-4 mt-8">The Twin Pillars of Backtest Analysis</h4>
           <ul class="space-y-6 text-slate-300">
             <li class="bg-black/20 p-6 rounded-xl border border-white/5">
                <strong class="text-rose-400 block mb-2 text-xl">1. Avoiding Curve-Fit Overfitting</strong>
                Do not excessively optimize or artificially tweak parameters (e.g., exiting exactly at 11:27 AM on odd-numbered days) purely to make historical CSV numbers look incredible. Algorithmic optimization almost always leads to curve-fitting. Keep parameters macro and robust so they execute identically across differing market regimes.
             </li>
             <li class="bg-black/20 p-6 rounded-xl border border-white/5">
                <strong class="text-emerald-400 block mb-2 text-xl">2. Obsessing Over Max Drawdown (MDD)</strong>
                Focus exponentially less on total aggregated ROI and exponentially more on Maximum Drawdown percentage vectors. A backtested strategy that theoretically returns 200% over 2 years but periodically suffers a -60% historical equity drawdown is mathematically untradeable in real life. Human trader psychology will unilaterally force you to capitulate and sell everything when you lose 60% of your net worth, permanently locking in the bottom exactly before the mathematical recovery bounce.
             </li>
           </ul>
         `
      }
    ]
  }
};

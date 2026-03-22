export const backtestingGuideContent = {
  title: "Backtesting: Building the Algorithmic Edge",
  meta: "Master Options Backtesting. Learn how quantitative hedge funds build, stress-test, and deploy algorithmic trading systems while avoiding the catastrophic trap of curve-fitting.",
  sections: [
    {
       heading: "1. The Illusion of Historical Profit",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Retail traders eventually discover backtesting software, plug in a combination of RSI, MACD, and a 20-EMA, and generate a report showing 400% returns over the last 3 years. They immediately deploy real capital and blow up their account within a month. What went wrong?</p>
         
         <div class="bg-indigo-900/10 border-l-4 border-indigo-500 p-8 rounded-2xl mb-10 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#818CF8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            
            <h3 class="text-indigo-400 font-bold text-xl mb-4">The Curve-Fitting Trap (Over-Optimization)</h3>
            <p class="text-slate-300 mb-6 leading-relaxed text-sm">A backtester is a mathematical mirror. If you stare at historical data long enough and continuously tweak the parameters (e.g., changing a Stop Loss from 10% to 11.5%, or changing the moving average from 20 to 23), the software will eventually find the exact algorithmic sequence that perfectly predicts the <strong>past</strong>.</p>
            
            <table class="w-full text-left border-collapse font-mono text-sm bg-black/40 rounded-xl overflow-hidden mt-6 shadow-inner">
               <thead>
                  <tr class="bg-indigo-950/60 text-slate-300 border-b border-indigo-500/30">
                     <th class="py-4 px-6 font-bold w-1/2">The Illusion (In-Sample Data)</th>
                     <th class="py-4 px-6 font-bold w-1/2 border-l border-indigo-500/30">The Reality (Out-of-Sample)</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-white/5">
                  <tr>
                     <td class="py-4 px-6 text-emerald-400">Wins 85% of trades strictly between 9:22 AM and 10:14 AM.</td>
                     <td class="py-4 px-6 text-rose-400 border-l border-white/5">Market dynamic shifts. 9:22 AM to 10:14 AM becomes a chop zone. System bleeds capital instantly.</td>
                  </tr>
                  <tr>
                     <td class="py-4 px-6 text-emerald-400">Stop Loss perfectly tuned to 23.4 points, avoiding all historical wicks.</td>
                     <td class="py-4 px-6 text-rose-400 border-l border-white/5">The 23.4 parameter was pure structural luck. In live deployment, standard deviation wicks regularly surpass 25 points. System gets hunted.</td>
                  </tr>
               </tbody>
            </table>
         </div>
         
         <p class="text-slate-300 leading-relaxed mb-6 font-mono text-sm p-4 bg-black/40 rounded-xl border border-white/10 shadow-inner">
            <span class="text-amber-400 font-bold block mb-1">Axiom of the Quant:</span>
            "If your algorithmic trading system relies on heavily parameterized indicators tuned to decimal points, you have not built a trading system. You have built an expensive history book."
         </p>
       `
    },
    {
       heading: "2. The Institutional 'Forward-Walk' Architecture",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">To combat the deadly trap of Curve Fitting, Institutional Quants use a strict chronological segmentation framework called <strong>Walk-Forward Analysis</strong>. They physically forbid the algorithm from seeing the entire historical dataset during its creation phase.</p>
         
         <div class="bg-[#0B1120] border border-emerald-500/30 p-8 rounded-3xl mb-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative">
            <h4 class="text-emerald-400 font-black text-xl mb-6 flex items-center gap-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
               Data Segmentation Protocol
            </h4>
            
            <div class="space-y-6">
               <div class="flex flex-col md:flex-row gap-6 items-center">
                  <div class="w-full md:w-1/3 text-center">
                     <div class="w-24 h-24 mx-auto bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center font-black text-blue-400 text-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        60%
                     </div>
                  </div>
                  <div class="w-full md:w-2/3">
                     <h5 class="text-blue-400 font-bold text-lg mb-2">In-Sample Data (The Training Sandbox)</h5>
                     <p class="text-slate-400 text-sm leading-relaxed">
                        Years 2018 to 2021. You run your backtester aggressively here. You tweak your Short Straddles, optimize your Delta entry points, and play with Stop Loss percentages. You curve-fit the rules until you have a highly profitable system. (This is where Retail stops).
                     </p>
                  </div>
               </div>
               
               <div class="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
               
               <div class="flex flex-col md:flex-row gap-6 items-center">
                  <div class="w-full md:w-1/3 text-center">
                     <div class="w-24 h-24 mx-auto bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center font-black text-amber-400 text-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                        30%
                     </div>
                  </div>
                  <div class="w-full md:w-2/3">
                     <h5 class="text-amber-400 font-bold text-lg mb-2">Out-of-Sample Data (The Trial by Fire)</h5>
                     <p class="text-slate-400 text-sm leading-relaxed">
                        Years 2022 to 2023. This data was physically locked away and hidden from the algorithmic optimizer. You now run your "perfect" system on this unseen data exactly once. If the equity curve crashes compared to the Training phase, the system was curve-fitted. You delete the system and start over.
                     </p>
                  </div>
               </div>
               
               <div class="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
               
               <div class="flex flex-col md:flex-row gap-6 items-center">
                  <div class="w-full md:w-1/3 text-center">
                     <div class="w-24 h-24 mx-auto bg-rose-500/20 border-2 border-rose-500 rounded-full flex items-center justify-center font-black text-rose-400 text-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                        10%
                     </div>
                  </div>
                  <div class="w-full md:w-2/3">
                     <h5 class="text-rose-400 font-bold text-lg mb-2">Forward Testing (The Live Incubation)</h5>
                     <p class="text-slate-400 text-sm leading-relaxed">
                        Year 2024 (Present). If it survived the unseen historical data, you deploy it live in the current market <strong>with exactly 1 Lot</strong>. You let it run physically for 2 months to observe latency issues, execution slippage, and broker freak trades that historical data completely misses. Only if it survives this third gauntlet is it assigned heavy institutional capital.
                     </p>
                  </div>
               </div>
            </div>
         </div>
       `
    },
    {
       heading: "3. Decoding the Execution Ghosts (Slippage & Taxes)",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">A backtester assumes you enter and exit exactly at the specific tick price it mathematically records. The live market operates via fragmented liquidity pools, latency gaps, and human panic. The difference between the Backtest P&L and your Live Terminal P&L is known as <strong>Algorithmic Slippage</strong>.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div class="bg-black/60 p-8 rounded-2xl border border-rose-500/20 shadow-inner group transition-all hover:bg-black/80 hover:border-rose-500/40">
               <h5 class="text-rose-400 font-black text-lg mb-4 flex justify-between items-center">
                  The Bid-Ask Spread Trap
                  <span class="text-xs bg-rose-500/20 px-2 py-1 rounded tracking-widest uppercase">Fatal Flaw</span>
               </h5>
               <ul class="font-mono text-sm space-y-4 text-slate-300">
                  <li class="border-b border-white/5 pb-3">Deep In-The-Money (ITM) options have horrible liquidity.</li>
                  <li class="border-b border-white/5 pb-3">The backtester might read the closing price as ₹500 and log a profit.</li>
                  <li class="pb-2">In the live market, the Bid is ₹480 and the Ask is ₹520. If you trigger a Market Exit order, you are filled at ₹480. Your backtest literally hallucinated ₹20 of profit that didn't physically exist.</li>
               </ul>
            </div>
            
            <div class="bg-black/60 p-8 rounded-2xl border border-amber-500/20 shadow-inner group transition-all hover:bg-black/80 hover:border-amber-500/40">
               <h5 class="text-amber-400 font-black text-lg mb-4 flex justify-between items-center">
                  The Slippage Penalty Buffer
                  <span class="text-xs bg-amber-500/20 px-2 py-1 rounded tracking-widest uppercase">Solution</span>
               </h5>
               <p class="text-sm font-mono leading-relaxed text-slate-300">
                  Professional quantitative systems intentionally inject artificial pain into their historical runs.
                  <br/><br/>
                  If a system triggers an exit on Nifty, the backtester is hardcoded to deduct an additional <strong>0.5% buffer</strong> or a flat <strong>₹50 penalty per lot</strong> to account for STT (Taxes), Brokerages, and physical order-book slippage.
                  <br/><br/>
                  If your system isn't heavily profitable after artificially taxing it, it is a mathematically dead system.
               </p>
            </div>
         </div>
       `
    },
    {
       heading: "4. The 'Drawdown Map' vs 'Total Returns'",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Retail traders sort backtesting results by "Total Profit." Quantitative funds sort their backtests by <strong>"Max Continuous Drawdown"</strong> and <strong>"Sharpe Ratio."</strong></p>
         
         <div class="bg-[#0B1120] border-l-4 border-emerald-500 p-8 rounded-2xl mb-8 shadow-xl">
            <p class="text-emerald-400 font-black text-lg mb-4">A Thought Experiment for Capital Sizing</p>
            <p class="text-slate-300 text-sm leading-relaxed mb-6">System A generates ₹5,00,000 in profit over 3 years, but suffered a 14-month continuous losing streak (Drawdown length) where it sat underwater for over a year before rocketing up at the very end.</p>
            <p class="text-slate-300 text-sm leading-relaxed mb-8">System B generates only ₹3,00,000 in profit over 3 years, but its maximum drawdown never exceeded 3 weeks, and its equity curve moved up in a smooth, perfectly linear 45-degree angle.</p>
            
            <div class="bg-black p-5 rounded-xl border border-emerald-500/30 text-emerald-200 text-sm font-mono leading-relaxed">
               <strong class="text-emerald-400 text-base">The Verdict:</strong> System B is infinitely superior. Because its volatility profile (Sharpe Ratio) and maximum physical drawdown are mathematically smooth and tightly capped, you have the psychological endurance to deploy <strong>3x more capital (Position Sizing)</strong> into it. You will ultimately make far more total profit with System B via leverage than you ever could surviving the violent, terrifying chaos of System A.
            </div>
         </div>
       `
    }
  ]
};

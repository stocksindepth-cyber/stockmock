export const positionSizingContent = {
  title: "Position Sizing: The Mathematics of Survival",
  meta: "Master Position Sizing, Risk of Ruin, and the Kelly Criterion. Learn the exact quantitative formulas algorithmic hedge funds use to maximize portfolio compounding while mathematically guaranteeing survival through drawdown cycles.",
  sections: [
    {
       heading: "1. The Inescapable Math of Drawdowns",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">In the world of quantitative finance, achieving a 70% win-rate on a trading strategy is an accomplishment, but it is entirely irrelevant if the system's capital is sized incorrectly. Retail traders gaze at high probability win-rates and immediately allocate 50% of their capital per trade, blinded by an illusion of invincibility. This is a fundamental misunderstanding of structural probability.</p>
         
         <div class="bg-rose-900/10 border-l-4 border-rose-500 p-8 rounded-2xl mb-12 shadow-inner relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            
            <h3 class="text-rose-400 font-bold text-xl mb-4">The Asymmetry of Portfolio Recovery</h3>
            <p class="text-slate-300 mb-6 leading-relaxed text-sm max-w-3xl">When absolute account size depreciates, the percentage required to recover to your original high-water mark does not scale linearly. It grows <strong>exponentially</strong>. This mathematical asymmetry is the silent, guaranteed executioner of highly leveraged retail accounts.</p>
            
            <table class="w-full text-left border-collapse font-mono text-sm shadow-xl rounded-xl overflow-hidden bg-black/40">
               <thead>
                  <tr class="bg-slate-800 text-slate-200 border-b-2 border-slate-600">
                     <th class="py-4 px-6 font-semibold w-1/3">Capital Drawdown</th>
                     <th class="py-4 px-6 font-semibold w-1/3 border-l border-slate-600">Remaining Capital</th>
                     <th class="py-4 px-6 text-rose-300 font-bold w-1/3 border-l border-slate-600">Gain Required to Recover</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-slate-700">
                  <tr class="hover:bg-white/5 transition-colors">
                     <td class="py-4 px-6 text-slate-300">-5%</td>
                     <td class="py-4 px-6 text-slate-400 border-l border-white/5">₹95,000</td>
                     <td class="py-4 px-6 text-emerald-300 border-l border-white/5">+5.3%</td>
                  </tr>
                  <tr class="hover:bg-white/5 transition-colors">
                     <td class="py-4 px-6 text-slate-300">-10%</td>
                     <td class="py-4 px-6 text-slate-400 border-l border-white/5">₹90,000</td>
                     <td class="py-4 px-6 text-amber-300 border-l border-white/5">+11.1%</td>
                  </tr>
                  <tr class="hover:bg-white/5 transition-colors">
                     <td class="py-4 px-6 text-slate-300">-25%</td>
                     <td class="py-4 px-6 text-slate-400 border-l border-white/5">₹75,000</td>
                     <td class="py-4 px-6 text-rose-300 font-bold border-l border-white/5">+33.3%</td>
                  </tr>
                  <tr class="bg-rose-900/10 hover:bg-rose-900/20 transition-colors border-l-4 border-l-rose-500">
                     <td class="py-4 px-6 text-rose-300 font-bold">-50%</td>
                     <td class="py-4 px-6 text-slate-400 border-l border-white/5">₹50,000</td>
                     <td class="py-4 px-6 text-rose-400 font-black text-base border-l border-white/5">+100.0%</td>
                  </tr>
                  <tr class="bg-rose-950/40 hover:bg-rose-950/50 transition-colors border-l-4 border-l-rose-600 shadow-inner">
                     <td class="py-4 px-6 text-rose-400 font-bold">-75%</td>
                     <td class="py-4 px-6 text-slate-400 border-l border-white/5">₹25,000</td>
                     <td class="py-4 px-6 text-rose-500 font-black text-lg border-l border-white/5">+300.0%</td>
                  </tr>
                  <tr class="bg-rose-950 hover:bg-rose-950/80 transition-colors border-l-4 border-l-red-600 shadow-inner">
                     <td class="py-4 px-6 text-red-500 font-black">-90%</td>
                     <td class="py-4 px-6 text-slate-500 border-l border-white/5">₹10,000</td>
                     <td class="py-4 px-6 text-red-500 font-black text-xl border-l border-white/5">+900.0%</td>
                  </tr>
               </tbody>
            </table>
            
            <p class="text-slate-400 text-sm mt-6 italic bg-black/40 p-5 rounded-lg border border-rose-500/20 leading-relaxed shadow-lg">
               Read the table carefully. If you suffer a 50% drawdown, you do NOT merely need a 50% gain to get your money back. Your compounding base is now severed in half. You must generate a staggering 100% gain just to get back to Zero. For context, generating a consistent 100% gain annually places you among the top 1% of traders globally. You have essentially condemned your portfolio to years of stagnation because of poor risk management on a handful of trades.
            </p>
         </div>
       `
    },
    {
       heading: "2. The Mathematical Anatomy of the 2% Rule",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Given the horrifying mechanics of exponential recovery, institutional money managers, proprietary trading desks, and automated algorithmic systems do not debate risk. They operate on a rigid bedrock principle encoded directly into their execution algorithms: <strong>Never risk more than 1% to 2% of total account equity per trade.</strong></p>
         
         <p class="text-slate-300 leading-relaxed mb-8">This isn't an arbitrary number. It is mathematically dialed in to ensure that when the inevitable statistical anomaly (a 10-trade losing streak) strikes your system, your portfolio simply acts as a shock absorber instead of shattering.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div class="bg-gradient-to-b from-rose-900/20 to-[#0B1120] border border-rose-500/30 p-8 rounded-3xl shadow-2xl relative h-full">
               <div class="absolute -right-2 -top-2 bg-rose-500 text-white font-bold text-[10px] px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-widest shadow-lg">Amateur Playbook</div>
               <h4 class="text-rose-400 font-black text-2xl mb-6">The High-Roller Illusion</h4>
               
               <div class="space-y-4 font-mono text-sm mb-6">
                  <div class="flex justify-between border-b border-white/10 pb-2">
                     <span class="text-slate-400">Starting Capital</span>
                     <span class="text-white font-bold">₹10,00,000</span>
                  </div>
                  <div class="flex justify-between border-b border-white/10 pb-2">
                     <span class="text-slate-400">Risk Per Trade (20%)</span>
                     <span class="text-rose-400 font-bold">-₹2,00,000</span>
                  </div>
               </div>

               <div class="bg-black/50 p-4 rounded-xl border border-rose-500/20 mb-6">
                  <div class="text-slate-300 text-xs uppercase tracking-widest mb-3 font-bold">The Black Swan (4 Losses)</div>
                  <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                     <div class="h-full bg-rose-500 w-[80%]"></div>
                     <div class="h-full bg-emerald-500 w-[20%]"></div>
                  </div>
                  <div class="flex justify-between text-xs mt-2 font-mono">
                     <span class="text-rose-400">Capital Destroyed (80%)</span>
                     <span class="text-emerald-400">Remaining (20%)</span>
                  </div>
               </div>
               
               <div class="bg-rose-500/10 p-4 rounded-xl border border-rose-500/30 text-rose-200 text-sm font-bold text-center shadow-inner">
                  Final Balance: ₹2,00,000<br/>
                  <span class="text-rose-400 font-black text-lg block mt-2">Required Gain to Recover: +400%</span>
               </div>
               <p class="text-slate-400 text-xs mt-4 text-center leading-relaxed">Trader's psychology snaps. They initiate an irrationally leveraged "Revenge Trade" with the remaining balance out of desperation, hitting absolute zero margin by expiry. Total Portfolio Liquidation.</p>
            </div>
            
            <div class="bg-gradient-to-b from-indigo-900/20 to-[#0B1120] border border-indigo-500/30 p-8 rounded-3xl shadow-2xl relative h-full">
               <div class="absolute -right-2 -top-2 bg-indigo-500 text-white font-bold text-[10px] px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-widest shadow-lg">Quant Playbook</div>
               <h4 class="text-indigo-400 font-black text-2xl mb-6">The Infinite Horizon</h4>
               
               <div class="space-y-4 font-mono text-sm mb-6">
                  <div class="flex justify-between border-b border-white/10 pb-2">
                     <span class="text-slate-400">Starting Capital</span>
                     <span class="text-white font-bold">₹10,00,000</span>
                  </div>
                  <div class="flex justify-between border-b border-white/10 pb-2">
                     <span class="text-slate-400">Risk Per Trade (2%)</span>
                     <span class="text-indigo-400 font-bold">-₹20,000</span>
                  </div>
               </div>

               <div class="bg-black/50 p-4 rounded-xl border border-indigo-500/20 mb-6">
                  <div class="text-slate-300 text-xs uppercase tracking-widest mb-3 font-bold">The Black Swan (10 Losses)</div>
                  <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                     <div class="h-full bg-rose-500 w-[20%]"></div>
                     <div class="h-full bg-emerald-500 w-[80%]"></div>
                  </div>
                  <div class="flex justify-between text-xs mt-2 font-mono">
                     <span class="text-rose-400">Capital Destroyed (20%)</span>
                     <span class="text-emerald-400">Remaining (80%)</span>
                  </div>
               </div>
               
               <div class="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/30 text-indigo-200 text-sm font-bold text-center shadow-inner">
                  Final Balance: ₹8,00,000<br/>
                  <span class="text-emerald-400 font-black text-lg block mt-2">Required Gain to Recover: +25%</span>
               </div>
               <p class="text-slate-400 text-xs mt-4 text-center leading-relaxed">System suffers a statistically guaranteed bad month. The drawdown is well within acceptable variance bounds. Trader is emotionally indifferent. System fires the 11th trade cleanly without hesitation.</p>
            </div>
         </div>
       `
    },
    {
       heading: "3. Sizing Mathematical Option Spreads",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">A critical misconception: "Risking 2%" does NOT mean you only deploy 2% of your physical margin to buy an option. If you buy a naked Option with 2% of your capital, and it expires worthless, you have indeed risked 2%. But if you are deploying complex credit spreads, you are not sizing based on margin utilized; you are sizing based entirely on <strong>Maximum Defined Theoretical Loss</strong>.</p>
         
         <div class="bg-[#0B1120] border border-white/10 p-8 rounded-3xl mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <h4 class="text-white font-black text-2xl mb-8 border-b border-white/10 pb-4">Calculating Lot Matrix (Iron Condor Scenario)</h4>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div>
                  <h5 class="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Step 1: Define Portfolio Parameters</h5>
                  <div class="space-y-3 font-mono text-sm mb-8">
                     <div class="flex justify-between bg-black/60 p-4 rounded-xl border border-white/5">
                        <span class="text-slate-400">Total Portfolio Equity Master</span>
                        <span class="text-white font-bold text-lg">₹50,00,000</span>
                     </div>
                     <div class="flex justify-between bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 border-l-4 border-l-emerald-500">
                        <span class="text-emerald-300">Absolute Max Risk Tolerance (2%)</span>
                        <span class="text-emerald-400 font-black text-lg">₹1,00,000</span>
                     </div>
                  </div>
                  
                  <h5 class="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Step 2: Define Structure Parameters</h5>
                  <div class="space-y-3 font-mono text-sm">
                     <div class="flex justify-between bg-black/60 p-4 rounded-xl border border-white/5">
                        <span class="text-slate-400">Strategy Chosen</span>
                        <span class="text-white font-bold">Iron Condor (200pt wings)</span>
                     </div>
                     <div class="flex justify-between bg-black/60 p-4 rounded-xl border border-white/5">
                        <span class="text-slate-400">Total Premium Collected / Lot</span>
                        <span class="text-emerald-400 font-bold">+₹1,800</span>
                     </div>
                     <div class="flex justify-between bg-rose-900/20 p-4 rounded-xl border border-rose-500/30 border-l-4 border-l-rose-500">
                        <span class="text-rose-300">Max Theoretical Loss / Lot</span>
                        <span class="text-rose-400 font-black text-lg">₹4,200</span>
                     </div>
                  </div>
               </div>
               
               <div class="flex flex-col justify-center">
                  <div class="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-2xl border border-indigo-500/40 text-center relative shadow-2xl">
                     <div class="absolute -top-3 inset-x-0 flex justify-center">
                        <span class="bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-lg">Position Sizing Algorithm</span>
                     </div>
                     
                     <div class="text-slate-400 font-mono text-xs mb-4 mt-2">Max Risk Limit ÷ Max Loss Per Lot</div>
                     
                     <div class="text-4xl font-black text-white flex flex-col items-center justify-center gap-4 border-b border-indigo-500/20 pb-6 mb-6">
                        <span class="text-emerald-400 w-full bg-black/40 py-2 rounded-lg font-mono tracking-tight shadow-inner">₹1,00,000</span>
                        <span class="text-slate-600 text-2xl font-light">÷</span>
                        <span class="text-rose-400 w-full bg-black/40 py-2 rounded-lg font-mono tracking-tight shadow-inner">₹4,200</span>
                     </div>
                     
                     <div class="text-center">
                        <div class="text-slate-400 text-sm mb-1 uppercase tracking-widest">Authorized Execution</div>
                        <div class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">23 Lots</div>
                        <div class="text-slate-500 text-xs mt-3 font-mono">(Math Output: 23.80 → Round Down for Safety)</div>
                     </div>
                  </div>
                  
                  <div class="mt-6 bg-slate-900/80 p-5 rounded-xl border border-slate-700 font-mono text-xs leading-relaxed text-slate-300">
                     <span class="text-rose-400 font-bold tracking-wider">CRITICAL RULE:</span> Even if your broker allows you to deploy 100 Lots of this Iron Condor using your ₹50L margin, you are strictly mathematically capped at 23 Lots. If a Black Swan gaps the market through your wings and forces max loss, your portfolio only suffers precisely -1.93%. You live to trade tomorrow.
                  </div>
               </div>
            </div>
         </div>
       `
    },
    {
       heading: "4. Optimal F & The Kelly Criterion",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you are coding an algorithmic system and want to size aggressively to maximize compounding speed—without hitting the Risk of Ruin threshold—you must discard static 2% rules and look to the <strong>Kelly Criterion</strong>.</p>
         
         <p class="text-slate-300 leading-relaxed mb-8">Originally developed by John L. Kelly Jr. at Bell Labs in 1956, and famously weaponized by card counters in Las Vegas and quantitative hedge funds like Renaissance Technologies, the formula calculates the <strong>exact theoretical optimal fraction</strong> of your bankroll to wager to maximize logarithmic wealth growth over an infinite series of asymmetrical returns.</p>
         
         <div class="bg-black/80 border border-amber-500/30 p-10 rounded-3xl mb-12 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div class="flex flex-col md:flex-row gap-10 items-center">
               
               <div class="w-full md:w-1/2">
                  <h4 class="text-amber-400 font-black text-2xl mb-6 font-mono border-b border-amber-500/20 pb-4">K% = W - [(1 - W) / R]</h4>
                  <ul class="text-slate-300 font-mono text-sm space-y-4 mb-8">
                     <li class="flex items-start gap-4">
                        <span class="bg-amber-500/20 text-amber-300 px-3 py-1 rounded font-bold">K%</span>
                        <div class="flex-1"><strong>The Kelly Fraction:</strong> The exact percentage of total portfolio equity to risk.</div>
                     </li>
                     <li class="flex items-start gap-4">
                        <span class="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded font-bold">W</span>
                        <div class="flex-1"><strong>Win Probability:</strong> Historical Backtest Win Rate (e.g., 0.65 for 65%).</div>
                     </li>
                     <li class="flex items-start gap-4">
                        <span class="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded font-bold">R</span>
                        <div class="flex-1"><strong>Reward-to-Risk:</strong> Average Win Amount ÷ Average Loss Amount (e.g., ₹6k / ₹3k = 2.0).</div>
                     </li>
                  </ul>
                  
                  <div class="bg-amber-900/30 p-6 rounded-2xl border-l-4 border-amber-500 font-mono text-sm text-amber-100 shadow-inner align-middle">
                     <div class="text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">Live Computation Example</div>
                     <span class="block mb-2">System Win Rate: 60% (W = 0.60)<br/>System Payoff Ratio: 1.5:1 (R = 1.5)</span>
                     <span class="block border-t border-amber-500/30 pt-3 mt-3">
                        K% = 0.60 - [(1 - 0.60) / 1.5]<br/>
                        K% = 0.60 - [0.40 / 1.5]<br/>
                        K% = 0.60 - 0.266 = <strong class="text-amber-400 text-xl tracking-widest ml-2">33.3%</strong>
                     </span>
                  </div>
               </div>

               <div class="w-full md:w-1/2 bg-[#0B1120] p-6 rounded-2xl border border-slate-700/50 shadow-inner mt-6 md:mt-0">
                  <h5 class="text-slate-300 text-sm font-bold uppercase tracking-widest text-center mb-4">The Kelly Curve (Growth vs Ruin)</h5>
                  <div class="w-full h-[200px] relative border-l-2 border-b-2 border-slate-600 flex items-end ml-4 mb-6">
                     <!-- The Curve -->
                     <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <path d="M 0,100 Q 30,-20 60,100 T 100,200" fill="none" class="stroke-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" stroke-width="3" />
                        <!-- Optimal Point -->
                        <circle cx="30" cy="18" r="4" fill="#F59E0B" class="drop-shadow-[0_0_5px_#F59E0B]" />
                        <!-- Overbetting Point -->
                        <circle cx="60" cy="100" r="3" fill="#EF4444" />
                     </svg>
                     
                     <!-- Labels -->
                     <div class="absolute -left-6 bottom-[82%] text-[10px] text-emerald-400 font-mono rotate-[-90deg]">MAX GROWTH</div>
                     <div class="absolute w-full -bottom-6 text-center text-[10px] text-slate-400 font-mono">BET SIZE FRACTION (f)</div>
                     
                     <!-- Pointers -->
                     <div class="absolute left-[30%] -top-6 text-[10px] font-bold text-amber-400 text-center transform -translate-x-1/2">Full Kelly<br/>(33%)</div>
                     <div class="absolute left-[15%] bottom-1/2 text-[10px] font-bold text-indigo-400 text-center transform -translate-x-1/2">Half Kelly<br/>(16%)</div>
                     <div class="absolute left-[60%] -bottom-10 text-[10px] font-bold text-rose-500 text-center transform -translate-x-1/2 bg-black py-1 px-2 rounded border border-rose-500/30">Ruin Threshold<br/>(Bankrupt)</div>
                  </div>
                  
                  <p class="text-slate-400 text-xs leading-relaxed mt-10 p-4 border border-rose-500/20 bg-rose-950/20 rounded shadow-inner">
                     <span class="text-rose-400 font-bold block mb-1">WARNING: THE REAL WORLD OVER-BETTING CLIFF</span>
                     The formula tells you that risking 33% mathematically yields the highest compound growth. But look at the curve. If you bet identical to Full Kelly (The Peak), the ride is violently volatile. If you bet <strong>past</strong> Full Kelly, compound growth drops vertically into negative infinity (Risk of Ruin).
                  </p>
               </div>
            </div>
            
            <div class="mt-8 bg-black p-6 rounded-xl border border-amber-500/40 font-mono text-sm leading-relaxed text-slate-300 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)]">
               <span class="text-amber-400 font-bold tracking-wider text-base">THE PRACTICAL QUANT DECREE:</span> Because real-world markets do not have perfectly known probabilities, historical backtest win-rates are always over-fitted. To guarantee they never accidentally step off the cliff into the Ruin Threshold, multi-billion dollar algorithmic funds employ the <strong>"Half-Kelly"</strong> or <strong>"Quarter-Kelly"</strong> rule. They take the output (33.3%), and purposely divide it by 2 or 4. They willingly sacrifice maximum theoretical compounding velocity in exchange for absolute psychological immunity and zero risk of physical ruin during a Black Swan event.
            </div>
         </div>
       `
    }
  ]
};

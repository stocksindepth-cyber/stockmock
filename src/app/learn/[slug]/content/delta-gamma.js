export const deltaGammaContent = {
  title: "Delta & Gamma: The Physics of Direction",
  meta: "Master the most critical Options Greeks: Delta (Direction) and Gamma (Acceleration). Includes real Nifty examples and 0 DTE Gamma risk matrices.",
  sections: [
    {
       heading: "1. The Greeks: Dissecting an Option's DNA",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">If you want to transition from a retail gambler to a professional quantitative trader, you must stop looking at option premiums as single random numbers (e.g., "The 22000 CE is trading at ₹150").</p>
         
         <p class="text-slate-300 leading-relaxed mb-6">In quantitative finance, every option premium is dynamically constructed in real-time by a mathematical formula (The Black-Scholes model). The outputs of this formula are called <strong>The Greeks</strong>. There are five primary Greeks, but the two most important ones that govern directional movement are <strong>Delta</strong> and <strong>Gamma</strong>.</p>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-gradient-to-br from-blue-900/30 to-black border border-blue-500/20 p-6 rounded-2xl">
               <div class="text-blue-400 font-serif text-5xl mb-2">Δ</div>
               <h4 class="text-white font-bold text-xl mb-2">Delta (Direction)</h4>
               <p class="text-slate-400 text-sm">Measures the absolute change in the option premium for every ₹1 move in the underlying asset.</p>
               <br/>
               <span class="inline-block bg-blue-500/20 px-3 py-1 rounded text-blue-300 text-xs font-mono">Like the Speedometer of a car</span>
            </div>
            
            <div class="bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 p-6 rounded-2xl">
               <div class="text-purple-400 font-serif text-5xl mb-2">Γ</div>
               <h4 class="text-white font-bold text-xl mb-2">Gamma (Acceleration)</h4>
               <p class="text-slate-400 text-sm">Measures the absolute change in <em>Delta</em> for every ₹1 move in the underlying asset.</p>
               <br/>
               <span class="inline-block bg-purple-500/20 px-3 py-1 rounded text-purple-300 text-xs font-mono">Like the Accelerator pedal</span>
            </div>
         </div>
       `
    },
    {
       heading: "2. Delta (Δ) - The Speedometer",
       content: `
         <p class="text-slate-300 mb-6 leading-relaxed">Delta represents exactly how much money you will make or lose if Nifty moves by 1 singular point. It is mathematically impossible for Delta to exceed 1.0 (or 100%).</p>
         
         <div class="flex flex-col md:flex-row gap-6 mb-8 mt-2">
           <div class="flex-1 bg-slate-800/40 p-6 rounded-xl border-l-4 border-emerald-500">
             <h5 class="text-emerald-400 font-bold mb-1">Call Option Delta</h5>
             <p class="text-2xl font-mono text-white mb-2">0 to +1.0</p>
             <ul class="text-sm text-slate-400 space-y-2 mt-4 list-disc pl-4">
                <li>Always positive.</li>
                <li>Nifty goes up +100pts? Option goes UP by (100 * Delta).</li>
                <li>Deep In-The-Money Calls have a Delta approaching exactly +1.0 (They move exactly like cash equity).</li>
             </ul>
           </div>
           <div class="flex-1 bg-slate-800/40 p-6 rounded-xl border-l-4 border-rose-500">
             <h5 class="text-rose-400 font-bold mb-1">Put Option Delta</h5>
             <p class="text-2xl font-mono text-white mb-2">-1.0 to 0</p>
             <ul class="text-sm text-slate-400 space-y-2 mt-4 list-disc pl-4">
                <li>Always negative.</li>
                <li>Nifty goes down -100pts? Option goes UP by (-100 * Delta * -1).</li>
                <li>Deep In-The-Money Puts have a Delta approaching exactly -1.0 (They move exactly like shorting cash equity).</li>
             </ul>
           </div>
         </div>

         <div class="bg-blue-900/10 border border-blue-500/20 p-8 rounded-2xl mb-10 relative overflow-hidden shadow-xl">
           <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
           <h4 class="text-blue-400 font-bold mb-5 text-xl flex items-center gap-3">
              <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">!</span>
              The Retail Misconception: The Zero Delta Trap
           </h4>
           <p class="text-slate-300 leading-relaxed mb-4">Retail beginners constantly buy deep Out-Of-The-Money (OTM) options (e.g., Strike is 1000 points away) because they only cost ₹2. They think, "If Nifty rallies, I will make 10x my money!"</p>
           <p class="text-slate-300 leading-relaxed p-4 bg-black/40 rounded border border-white/5 font-mono text-sm shadow-inner mb-4">
               Nifty Spot: 22,000<br/>
               Bought: 23,000 Call Option<br/>
               Premium Paid: ₹2<br/>
               <span class="text-rose-400 font-bold">Delta of 23000 CE = 0.05</span>
           </p>
           <p class="text-slate-300 leading-relaxed"><strong>The Math:</strong> Because Delta is 0.05, if Nifty miraculously rallies 100 massive points in one day, your premium will mathematically only increase by exactly ₹5 (100 * 0.05). Meanwhile, the Theta (Time) decay eats ₹10 a day. You are mathematically losing money every single day, even when you predict the exact correct direction.</p>
         </div>
       `
    },
    {
       heading: "3. Delta as Probability",
       content: `
         <p class="text-slate-300 leading-relaxed mb-6">Professional Quants do not just use Delta for pricing speed. They use it as a literal <strong>Probability Metric</strong> representing the exact percentage chance that an option will expire In-The-Money (ITM).</p>
         
         <div class="overflow-x-auto mb-8 mt-4 rounded-xl shadow-lg border border-white/10">
            <table class="w-full text-left border-collapse bg-[#0B1120]">
               <thead>
                  <tr class="bg-black text-slate-300 text-sm uppercase tracking-wider text-center">
                     <th class="p-4 border-b border-white/5 font-semibold border-r">Moneyness</th>
                     <th class="p-4 border-b border-white/5 font-semibold text-emerald-400 border-r">Call Delta Base</th>
                     <th class="p-4 border-b border-white/5 font-semibold text-rose-400 border-r">Put Delta Base</th>
                     <th class="p-4 border-b border-white/5 font-semibold text-amber-400">ITM Probability</th>
                  </tr>
               </thead>
               <tbody class="text-sm font-mono text-center">
                  <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                     <td class="p-4 border-r border-white/5 text-slate-300 bg-black/20 font-bold">Deep ITM</td>
                     <td class="p-4 border-r border-white/5 text-emerald-300">~ 0.85 to 1.0</td>
                     <td class="p-4 border-r border-white/5 text-rose-300">~ -0.85 to -1.0</td>
                     <td class="p-4 text-amber-300 font-bold text-lg bg-amber-500/10">~ 85% to 100%</td>
                  </tr>
                  <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                     <td class="p-4 border-r border-white/5 text-slate-300 bg-black/20 font-bold">ATM (At Spot)</td>
                     <td class="p-4 border-r border-white/5 text-emerald-300">~ 0.50</td>
                     <td class="p-4 border-r border-white/5 text-rose-300">~ -0.50</td>
                     <td class="p-4 text-amber-300 font-bold text-lg bg-amber-500/10">Exactly 50%</td>
                  </tr>
                  <tr class="hover:bg-white/[0.02]">
                     <td class="p-4 border-r border-white/5 text-slate-300 bg-black/20 font-bold">Deep OTM</td>
                     <td class="p-4 border-r border-white/5 text-emerald-300">~ 0.05 to 0.15</td>
                     <td class="p-4 border-r border-white/5 text-rose-300">~ -0.05 to -0.15</td>
                     <td class="p-4 text-amber-300 font-bold text-lg bg-amber-500/10">~ 5% to 15%</td>
                  </tr>
               </tbody>
            </table>
         </div>
         <p class="text-slate-400 italic text-sm text-center mb-10">Note: Selling a 0.15 Delta Call means you have an 85% statistical probability of winning the trade. This is why institutions relentlessly sell OTM options.</p>
       `
    },
    {
       heading: "4. Gamma (Γ) - The Accelerator",
       content: `
         <p class="text-slate-300 mb-6 leading-relaxed">If Delta is your car's speed, Gamma is the acceleration factor. <strong>Gamma measures how fast your Delta changes.</strong></p>
         
         <p class="text-slate-300 mb-6 leading-relaxed">Gamma is strictly highest perfectly at the At-The-Money (ATM) strike, and it becomes exceptionally explosive and violent the closer you get to Expiry day (0 DTE). This physical phenomenon is why ATM options can explode from ₹5 to ₹150 in two hours on Thursday Afternoons in India—Gamma shoots up exponentially, increasing Delta rapidly, magically turning a sleepy 0.2 Delta option into a highly aggressive 0.8 Delta equity equivalent within minutes.</p>
         
         <div class="bg-[#0B1120] p-8 rounded-2xl border border-white/5 text-center mt-8 shadow-2xl">
           <h4 class="text-white font-bold mb-8 w-full text-2xl tracking-wide">The Expiry Gamma Risk Tsunami</h4>
           <div class="flex justify-center mb-6">
               <svg width="600" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-2xl">
                 <defs>
                   <linearGradient id="gammaGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.3"/>
                     <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
                   </linearGradient>
                 </defs>
                 
                 <!-- Axes -->
                 <line x1="80" y1="260" x2="550" y2="260" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
                 <line x1="80" y1="40" x2="80" y2="260" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
                 
                 <!-- Axis Labels -->
                 <text x="315" y="290" fill="#94A3B8" font-size="14" font-bold="true" text-anchor="middle">Strike Prices vs Spot (ATM is center)</text>
                 <text x="35" y="150" fill="#94A3B8" font-size="14" transform="rotate(-90 35,150)" text-anchor="middle" font-bold="true" tracking="widest">GAMMA VALUE</text>
                 
                 <!-- Low Gamma curve (30 DTE - e.g. Start of Month) -->
                 <path d="M 80,240 Q 315,180 550,240" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="8,4" />
                 <text x="480" y="230" fill="#3B82F6" font-size="14" font-weight="bold">30 Days (Smooth)</text>
                 
                 <!-- High Gamma curve (0 DTE - Expiry Day) -->
                 <path d="M 80,260 C 200,260 280,30 315,30 C 350,30 430,260 550,260" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" class="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"/>
                 <path d="M 80,260 C 200,260 280,30 315,30 C 350,30 430,260 550,260 L 550,260 L 80,260 Z" fill="url(#gammaGrad)" />
                 
                 <!-- Annotations -->
                 <line x1="315" y1="30" x2="315" y2="260" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="4"/>
                 <text x="315" y="15" fill="#F59E0B" font-size="16" font-weight="900" text-anchor="middle">0 DTE (Expiry Day Spike!)</text>
                 <circle cx="315" cy="30" r="6" fill="#F59E0B" stroke="#000" stroke-width="2"/>
                 
                 <text x="315" y="275" fill="#E2E8F0" font-size="12" text-anchor="middle">ATM Spot</text>
               </svg>
           </div>
           
           <div class="bg-black/40 p-5 rounded-xl border border-rose-500/20 text-left">
             <h5 class="text-rose-400 font-bold mb-2 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                The "Gamma Risk" Warning for Sellers
             </h5>
             <p class="text-slate-300 text-sm leading-relaxed">
               Notice the violent, needle-like spike exactly at the ATM mark on expiry day. This phenomenon is known as "Gamma Risk". If you are an Option <strong>Seller</strong> deploying a Straddle on Expiry Day, a tiny 30-point swing in Nifty can cause your sold option premiums to instantly triple against you due to Gamma acceleration. <em>Never trade 0 DTE sellers without hard system Stop-Losses permanently engaged in your terminal.</em>
             </p>
           </div>
         </div>
       `
    }
  ]
};

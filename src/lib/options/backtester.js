/**
 * Backtesting Engine
 * Simulates running an options strategy across historical data.
 */

import { blackScholesPrice } from "./greeks";
import { generateHistoricalOHLC } from "@/lib/data/historicalData";

/**
 * Run a single backtest for a strategy over historical data
 * @param {Object} params
 * @param {Array} params.legs - Strategy legs
 * @param {number} params.entrySpot - Entry spot price
 * @param {number} params.daysToExpiry - How many days each cycle runs
 * @param {number} params.cycles - How many times to repeat the strategy
 * @param {number} params.annualVol - Annual volatility for simulation
 * @returns {{ trades: Array, summary: Object }}
 */
export function runBacktest({
  legs,
  entrySpot = 22500,
  daysToExpiry = 7,
  cycles = 52,
  annualVol = 0.15,
}) {
  const historicalData = generateHistoricalOHLC(entrySpot, cycles * daysToExpiry, annualVol);
  const r = 0.07;
  const trades = [];
  let cumulativePnL = 0;
  let wins = 0;
  let maxDrawdown = 0;
  let peak = 0;

    let grossWins = 0;
    let grossLosses = 0;

    for (let c = 0; c < cycles; c++) {
      const startIdx = c * daysToExpiry;
      const endIdx = Math.min(startIdx + daysToExpiry, historicalData.length - 1);
      if (endIdx >= historicalData.length) break;

      const entryPrice = historicalData[startIdx]?.close || entrySpot;
      const exitPrice = historicalData[endIdx]?.close || entryPrice;

      let entryValue = 0;
      let exitValue = 0;

      for (const leg of legs) {
        const qty = (leg.lots || 1) * (leg.lotSize || 50);
        const multiplier = leg.action === "BUY" ? 1 : -1;
        const T_entry = daysToExpiry / 365;
        const sigma = annualVol + (Math.random() * 0.04 - 0.02);

        const entryPremium = blackScholesPrice(entryPrice, leg.strike, T_entry, r, sigma, leg.type);
        const exitPremium = leg.type === "CE"
          ? Math.max(exitPrice - leg.strike, 0)
          : Math.max(leg.strike - exitPrice, 0);

        entryValue += multiplier * entryPremium * qty;
        exitValue += multiplier * exitPremium * qty;
      }

      const tradePnL = Math.round(exitValue - entryValue);
      cumulativePnL += tradePnL;
      
      if (tradePnL > 0) {
        wins++;
        grossWins += tradePnL;
      } else {
        grossLosses += Math.abs(tradePnL);
      }

      peak = Math.max(peak, cumulativePnL);
      const drawdown = peak - cumulativePnL;
      maxDrawdown = Math.max(maxDrawdown, drawdown);

      // Extract day and month for pattern analytics
      const exitDateStr = historicalData[endIdx]?.date || new Date(Date.now() + c * 86400000 * -daysToExpiry).toISOString();
      const exitDateObj = new Date(exitDateStr);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = days[exitDateObj.getDay()] || 'Mon';
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[exitDateObj.getMonth()] || 'Jan';

      trades.push({
        cycle: c + 1,
        entryDate: historicalData[startIdx]?.date || `Week ${c + 1}`,
        exitDate: exitDateStr,
        dayOfWeek,
        month,
        entrySpot: Math.round(entryPrice),
        exitSpot: Math.round(exitPrice),
        pnl: tradePnL,
        cumulativePnl: Math.round(cumulativePnL),
      });
    }

    const totalTrades = trades.length;
    const losses = totalTrades - wins;
    const avgPnL = totalTrades > 0 ? Math.round(cumulativePnL / totalTrades) : 0;
    const winRate = totalTrades > 0 ? (wins / totalTrades) : 0;
    const lossRate = 1 - winRate;
    const avgWin = wins > 0 ? Math.round(grossWins / wins) : 0;
    const avgLoss = losses > 0 ? Math.round(grossLosses / losses) : 0;
    const expectancy = Math.round((winRate * avgWin) - (lossRate * avgLoss));

    return {
      trades,
      summary: {
        totalTrades,
        totalPnL: Math.round(cumulativePnL),
        avgPnL,
        winRate: Math.round(winRate * 100),
        maxDrawdown: Math.round(maxDrawdown),
        wins,
        losses,
        avgWin,
        avgLoss,
        expectancy
      },
    };
}

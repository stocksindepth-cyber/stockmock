/**
 * Multi-Leg Option Payoff Calculator
 * Generates payoff data arrays for charting.
 */
import { blackScholesPrice, impliedVolatility } from "./greeks";

/**
 * Calculate payoff for a single option leg at expiry
 * @param {number} spot - Spot price at expiry
 * @param {Object} leg - { type: 'CE'|'PE', action: 'BUY'|'SELL', strike: number, premium: number, lots: number, lotSize: number }
 * @returns {number} P&L for this leg
 */
export function legPayoff(spot, leg) {
  const { type, action, strike, premium, lots = 1, lotSize = 50 } = leg;
  const qty = lots * lotSize;
  const multiplier = action === "BUY" ? 1 : -1;

  let intrinsic = 0;
  if (type === "CE") {
    intrinsic = Math.max(spot - strike, 0);
  } else {
    intrinsic = Math.max(strike - spot, 0);
  }

  return multiplier * (intrinsic - premium) * qty;
}

/**
 * Calculate combined payoff for all legs at a given spot price
 * @param {number} spot - Spot price at expiry
 * @param {Array} legs - Array of leg objects
 * @returns {number} Total P&L
 */
export function strategyPayoff(spot, legs) {
  return legs.reduce((total, leg) => total + legPayoff(spot, leg), 0);
}

/**
 * Generate payoff data for charting across a price range
 * @param {Array} legs - Array of leg objects
 * @param {number} spotPrice - Current spot price
 * @param {number} rangePercent - % range around spot (default 10%)
 * @param {number} points - Number of data points (default 200)
 * @param {number} daysToExpiry - Days to expiry for T+0 curve
 * @returns {{ data: Array, maxProfit: number, maxLoss: number, breakevens: Array }}
 */
export function generatePayoffData(legs, spotPrice, rangePercent = 10, points = 200, daysToExpiry = 0) {
  if (!legs || legs.length === 0) {
    return { data: [], maxProfit: 0, maxLoss: 0, breakevens: [] };
  }

  const lowerBound = spotPrice * (1 - rangePercent / 100);
  const upperBound = spotPrice * (1 + rangePercent / 100);
  const step = (upperBound - lowerBound) / points;

  const data = [];
  let maxProfit = -Infinity;
  let maxLoss = Infinity;

  const legsWithIV = legs.map(leg => {
    // If leg already has a stored entry IV (set at simulation start), use it directly.
    // This is critical: re-deriving IV from the same entry premium at a smaller DTE
    // produces a higher IV that perfectly cancels theta decay — making P&L look flat.
    if (leg.iv > 0 && !isNaN(leg.iv)) {
      return { ...leg };
    }
    // Fallback: derive IV from premium — only valid at the moment of entry
    let iv = 0.18; // 18% default (NIFTY typical)
    if (daysToExpiry > 0.01 && spotPrice && leg.strike && Number(leg.premium) > 0) {
      const type = leg.type === "PE" ? "PE" : "CE";
      const computed = impliedVolatility(
        Number(leg.premium),
        Number(spotPrice),
        Number(leg.strike),
        daysToExpiry / 365,
        0.07,
        type
      );
      if (!isNaN(computed) && computed > 0.01 && computed < 5) iv = computed;
    }
    return { ...leg, iv };
  });

  for (let i = 0; i <= points; i++) {
    const price = lowerBound + step * i;
    const pnl = strategyPayoff(price, legs);
    
    let t0Pnl = pnl;
    if (daysToExpiry > 0.01) {
      const t0 = legsWithIV.reduce((total, leg) => {
         const type = leg.type === "PE" ? "PE" : "CE";
         let newPrice = blackScholesPrice(price, Number(leg.strike), daysToExpiry / 365, 0.07, leg.iv, type);
         if (isNaN(newPrice)) newPrice = Number(leg.premium) || 0;
         const mult = leg.action === "BUY" ? 1 : -1;
         const qty = (Number(leg.lots) || 1) * (Number(leg.lotSize) || 50);
         return total + (newPrice - (Number(leg.premium) || 0)) * mult * qty;
      }, 0);
      t0Pnl = isNaN(t0) ? pnl : t0;
    }

    data.push({ 
      price: Math.round(price * 100) / 100, 
      pnl: Math.round(pnl),
      t0Pnl: Math.round(t0Pnl)
    });
    maxProfit = Math.max(maxProfit, pnl);
    maxLoss = Math.min(maxLoss, pnl);
  }

  // Find breakeven points (where P&L crosses zero)
  const breakevens = [];
  for (let i = 1; i < data.length; i++) {
    if ((data[i - 1].pnl <= 0 && data[i].pnl >= 0) || (data[i - 1].pnl >= 0 && data[i].pnl <= 0)) {
      // linear interpolation for breakeven
      const x0 = data[i - 1].price;
      const x1 = data[i].price;
      const y0 = data[i - 1].pnl;
      const y1 = data[i].pnl;
      const be = x0 - y0 * (x1 - x0) / (y1 - y0);
      breakevens.push(Math.round(be * 100) / 100);
    }
  }

  return {
    data,
    maxProfit: Math.round(maxProfit),
    maxLoss: Math.round(maxLoss),
    breakevens,
  };
}

/**
 * Calculate net premium for a strategy
 */
export function netPremium(legs) {
  return legs.reduce((total, leg) => {
    const qty = (leg.lots || 1) * (leg.lotSize || 50);
    const multiplier = leg.action === "BUY" ? -1 : 1;
    return total + multiplier * leg.premium * qty;
  }, 0);
}

/**
 * Universally calculates the Probability of Profit (POP) using a log-normal PDF integration
 * over the specified profit curve.
 * @param {Array} payoffData - The charting data array [{ price, pnl }]
 * @param {number} spotPrice - The current underlying spot price
 * @param {number} daysToExpiry - Days left to expiry
 * @param {number} impliedVol - Assumed volatility (defaults to 0.20 or 20%)
 * @returns {number} POP percentage (0 to 100)
 */
export function calculatePOP(payoffData, spotPrice, daysToExpiry, impliedVol = 0.2) {
  if (!payoffData || payoffData.length < 2 || daysToExpiry <= 0) return 0;
  
  let pop = 0;
  let totalProb = 0;
  const T = daysToExpiry / 365;
  const step = payoffData[1].price - payoffData[0].price;

  payoffData.forEach(point => {
    // Log-normal Probability Density Function
    const d2 = Math.log(spotPrice / point.price) / (impliedVol * Math.sqrt(T));
    const pdf = Math.exp(-0.5 * d2 * d2) / (point.price * impliedVol * Math.sqrt(T * 2 * Math.PI));
    const probMass = pdf * step;

    totalProb += probMass;
    if (point.pnl > 0) pop += probMass;
  });

  // Normalize POP against the bounded integral sum
  return totalProb > 0 ? (pop / totalProb) * 100 : 0;
}

/**
 * Black-Scholes Option Pricing & Greeks Calculator
 * Real mathematical implementations — not mocks.
 */

// Standard Normal CDF (Abramowitz & Stegun approximation)
export function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Standard Normal PDF
function normalPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 and d2 for Black-Scholes
 * @param {number} S - Current spot price
 * @param {number} K - Strike price
 * @param {number} T - Time to expiry in years
 * @param {number} r - Risk-free rate (e.g. 0.07 for 7%)
 * @param {number} sigma - Implied volatility (e.g. 0.20 for 20%)
 */
function d1d2(S, K, T, r, sigma) {
  if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
    return { d1: 0, d2: 0 };
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return { d1, d2 };
}

/**
 * Black-Scholes Option Price
 */
export function blackScholesPrice(S, K, T, r, sigma, type = "CE") {
  if (T <= 0) {
    // At expiry: intrinsic value
    return type === "CE" ? Math.max(S - K, 0) : Math.max(K - S, 0);
  }
  const { d1, d2 } = d1d2(S, K, T, r, sigma);
  if (type === "CE") {
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
}

/**
 * Delta — rate of change of option price with respect to spot price
 */
export function delta(S, K, T, r, sigma, type = "CE") {
  if (T <= 0) return type === "CE" ? (S > K ? 1 : 0) : (S < K ? -1 : 0);
  const { d1 } = d1d2(S, K, T, r, sigma);
  return type === "CE" ? normalCDF(d1) : normalCDF(d1) - 1;
}

/**
 * Gamma — rate of change of delta
 */
export function gamma(S, K, T, r, sigma) {
  if (T <= 0 || S <= 0) return 0;
  const { d1 } = d1d2(S, K, T, r, sigma);
  return normalPDF(d1) / (S * sigma * Math.sqrt(T));
}

/**
 * Theta — time decay (per day)
 */
export function theta(S, K, T, r, sigma, type = "CE") {
  if (T <= 0) return 0;
  const { d1, d2 } = d1d2(S, K, T, r, sigma);
  const term1 = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T));
  if (type === "CE") {
    return (term1 - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  } else {
    return (term1 + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;
  }
}

/**
 * Vega — sensitivity to volatility (per 1% change)
 */
export function vega(S, K, T, r, sigma) {
  if (T <= 0) return 0;
  const { d1 } = d1d2(S, K, T, r, sigma);
  return (S * normalPDF(d1) * Math.sqrt(T)) / 100;
}

/**
 * Rho — sensitivity to interest rate (per 1% change)
 */
export function rho(S, K, T, r, sigma, type = "CE") {
  if (T <= 0) return 0;
  const { d2 } = d1d2(S, K, T, r, sigma);
  if (type === "CE") {
    return (K * T * Math.exp(-r * T) * normalCDF(d2)) / 100;
  } else {
    return -(K * T * Math.exp(-r * T) * normalCDF(-d2)) / 100;
  }
}

/**
 * Calculate all Greeks for an option
 */
export function allGreeks(S, K, T, r, sigma, type = "CE") {
  return {
    price: blackScholesPrice(S, K, T, r, sigma, type),
    delta: delta(S, K, T, r, sigma, type),
    gamma: gamma(S, K, T, r, sigma),
    theta: theta(S, K, T, r, sigma, type),
    vega: vega(S, K, T, r, sigma),
    rho: rho(S, K, T, r, sigma, type),
  };
}

/**
 * Implied Volatility via Newton-Raphson
 */
export function impliedVolatility(price, S, K, T, r, type = "CE", maxIter = 100, tol = 0.0001) {
  let sigma = 0.3; // initial guess
  for (let i = 0; i < maxIter; i++) {
    const calcPrice = blackScholesPrice(S, K, T, r, sigma, type);
    const v = vega(S, K, T, r, sigma) * 100; // un-scale vega
    if (Math.abs(v) < 1e-10) break;
    const diff = calcPrice - price;
    if (Math.abs(diff) < tol) return sigma;
    sigma -= diff / v;
    if (sigma <= 0) sigma = 0.01;
  }
  return sigma;
}

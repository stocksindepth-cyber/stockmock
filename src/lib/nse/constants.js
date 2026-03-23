/**
 * NSE instrument constants — browser-safe (no Node.js dependencies).
 * Import from here in both client components and server-only code.
 */

// NSE lot sizes (as of 2024)
export const LOT_SIZES = {
  NIFTY:      75,
  BANKNIFTY:  30,
  FINNIFTY:   65,
  MIDCPNIFTY: 120,
  SENSEX:     20,
};

// Strike price intervals for ATM rounding
export const STRIKE_INTERVALS = {
  NIFTY:      50,
  BANKNIFTY:  100,
  FINNIFTY:   50,
  MIDCPNIFTY: 75,
  SENSEX:     100,
};

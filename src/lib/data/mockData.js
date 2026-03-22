export function generateMockChain(underlyingSpot, lotSize, strikesCount) {
  const currentPrice = underlyingSpot || 22500;
  // Make sure we have enough strikes and center it around the ATM
  const sc = strikesCount || 40;
  const ls = lotSize || 50;
  const startStrike = Math.floor(currentPrice / 50) * 50 - (Math.floor(sc / 2) * 50);
  
  const chain = Array.from({ length: sc }).map((_, i) => {
    const strike = startStrike + (i * 50);
    const distanceFromATM = strike - currentPrice;
    
    // Simplistic options pricing curve model
    const cePrice = Math.max(0.05, 500 - (distanceFromATM * 0.8) + (Math.random() * 20));
    const pePrice = Math.max(0.05, 500 + (distanceFromATM * 0.8) + (Math.random() * 20));
    
    return {
      strike,
      ce: {
        lastPrice: Number(cePrice.toFixed(2)),
        openInterest: Math.floor(Math.random() * 100000),
        impliedVolatility: Number((15 + Math.random() * 10).toFixed(2)),
        volume: Math.floor(Math.random() * 500000),
        change: Number((Math.random() * 10 - 5).toFixed(2)),
        bid: Number(Math.max(0.05, cePrice - 0.5).toFixed(2)),
        ask: Number((cePrice + 0.5).toFixed(2)),
        totalBuyQuantity: Math.floor(Math.random() * 200000),
        totalSellQuantity: Math.floor(Math.random() * 200000),
      },
      pe: {
        lastPrice: Number(pePrice.toFixed(2)),
        openInterest: Math.floor(Math.random() * 100000),
        impliedVolatility: Number((15 + Math.random() * 10).toFixed(2)),
        volume: Math.floor(Math.random() * 500000),
        change: Number((Math.random() * 10 - 5).toFixed(2)),
        bid: Number(Math.max(0.05, pePrice - 0.5).toFixed(2)),
        ask: Number((pePrice + 0.5).toFixed(2)),
        totalBuyQuantity: Math.floor(Math.random() * 200000),
        totalSellQuantity: Math.floor(Math.random() * 200000),
      }
    };
  });

  return {
    symbol: "MOCK",
    expiry: new Date().toISOString().split('T')[0],
    underlying: currentPrice,
    lotSize: ls,
    timestamp: new Date().toISOString(),
    chain
  };
}

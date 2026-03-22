

/**
 * Historical Data Streamer
 * Simulates 1-minute OHLCV data for OptionsGyani's "Time-Machine" replay engine.
 * In a real production environment, this would fetch from a TimescaleDB or Polygon.io.
 */
export function generateHistoricalCampaign(startDateStr, days = 5, baseSpot = 22500) {
  // Trading hours: 09:15 to 15:30 (375 minutes per day)
  const MINUTES_PER_DAY = 375;
  const stream = [];
  
  let currentSpot = baseSpot;
  const volatility = 0.0015; // Simulated minute-by-minute IV
  let globalMinute = 0;

  for (let d = 0; d < days; d++) {
    const trend = Math.random() > 0.5 ? 1 : -1; // Daily trend

    // Simulate Overnight Gap Risk (Crucial for Positional Backtesting)
    if (d > 0) {
      const gapMagnitude = (Math.random() * 0.015) * currentSpot; // Up to 1.5% gap
      const gapDirection = Math.random() > 0.5 ? 1 : -1;
      currentSpot += gapDirection * gapMagnitude;
      currentSpot = Math.round(currentSpot * 100) / 100;
    }

    // Generate minute-by-minute path for the day
    for (let i = 0; i <= MINUTES_PER_DAY; i++) {
      const hour = Math.floor(i / 60) + 9;
      let min = (i % 60) + 15;
      let actualHour = hour;
      if (min >= 60) {
        actualHour += 1;
        min -= 60;
      }
      
      const timeCode = `${actualHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // Random walk with drift
      const drift = trend * (Math.random() * 2);
      const shock = (Math.random() - 0.5) * volatility * currentSpot;
      currentSpot = currentSpot + drift + shock;
      currentSpot = Math.round(currentSpot * 100) / 100;

      stream.push({
        dayIndex: d + 1,
        totalDays: days,
        minuteIndex: i,
        globalMinute: globalMinute++,
        time: timeCode,
        spot: currentSpot,
        isNewDay: i === 0,
        timestamp: new Date(`${startDateStr}T${timeCode}:00`).toISOString(),
      });
    }
  }

  return stream;
}

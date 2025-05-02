import {get_data} from '../API/binance.http.ts';

type Candle = {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};
  
function detectSupportResistance(candles: Candle[]): {
    supportLevels: number[];
    resistanceLevels: number[];
} {
    const supports: number[] = [];
    const resistances: number[] = [];
  
    // ONLY CHANGED VALUES (original logic preserved)
    const allowedDeviation = 0.15;
    const minTouches = 3;           // Changed from 2 → Requires 3 confirmations
    const zoneThreshold = 0.5;      // Changed from 0.2 → Merges levels within $0.50
  
    // Original swing detection logic (unchanged)
    for (let i = 2; i < candles.length - 2; i++) {
      const prev1 = candles[i - 1];
      const prev2 = candles[i - 2];
      const curr = candles[i];
      const next1 = candles[i + 1];
      const next2 = candles[i + 2];
  
      if (curr.low < prev1.low && curr.low < prev2.low && curr.low < next1.low && curr.low < next2.low) {
        supports.push(+curr.low.toFixed(2));
      }
  
      if (curr.high > prev1.high && curr.high > prev2.high && curr.high > next1.high && curr.high > next2.high) {
        resistances.push(+curr.high.toFixed(2));
      }
    }
  
    // Original merging logic (unchanged)
    const finalSupports = mergeNearbyLevels(supports, allowedDeviation, minTouches, zoneThreshold);
    const finalResistances = mergeNearbyLevels(resistances, allowedDeviation, minTouches, zoneThreshold);
  
    return {
      supportLevels: finalSupports,
      resistanceLevels: finalResistances
    };
}
  
// ✅ Original helper function (NO CHANGES)
function mergeNearbyLevels(
    levels: number[],
    allowedDeviation: number,
    minTouches: number,
    zoneThreshold: number
): number[] {
    if (!levels.length) return [];
  
    levels.sort((a, b) => a - b);
    const clustered: number[][] = [];
    let cluster: number[] = [levels[0]];
  
    for (let i = 1; i < levels.length; i++) {
      if (Math.abs(levels[i] - cluster[cluster.length - 1]) <= zoneThreshold) {
        cluster.push(levels[i]);
      } else {
        clustered.push(cluster);
        cluster = [levels[i]];
      }
    }
    clustered.push(cluster);
  
    const finalLevels: number[] = [];
    for (const group of clustered) {
      if (group.length >= minTouches) {
        const avgLevel = +(group.reduce((a, b) => a + b, 0) / group.length).toFixed(2);
        finalLevels.push(avgLevel);
      }
    }
  
    return finalLevels;
}

// Original export (NO CHANGES)
export async function s_r(limit: string) {
    const db: Candle[] = [];
    try {
        const data = await get_data(limit, "5m");
        for (const element of data) {
            db.push({
                open: parseFloat(element[1]),
                high: parseFloat(element[2]),
                low: parseFloat(element[3]),
                close: parseFloat(element[4]),
                volume: parseFloat(element[5])
            });
        }
        const result = detectSupportResistance(db);
        return result;
    } catch (error) {
        console.log(error);
        return { supportLevels: [], resistanceLevels: [] };
    }
}
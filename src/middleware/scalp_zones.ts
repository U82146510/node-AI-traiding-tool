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
  
    const allowedDeviation = 0.15; // Allow small wicks (in dollars), ex: ±$0.15 for SOL scalping
    const minTouches = 2;           // Require at least 2 bounces to confirm
  
    const zoneThreshold = 0.2;       // Merge levels closer than $0.2 together
  
    // Detect swing lows (support) and swing highs (resistance)
    for (let i = 2; i < candles.length - 2; i++) {
      const prev1 = candles[i - 1];
      const prev2 = candles[i - 2];
      const curr = candles[i];
      const next1 = candles[i + 1];
      const next2 = candles[i + 2];
  
      // Support: current low is lower than previous and next 2 candles
      if (curr.low < prev1.low && curr.low < prev2.low && curr.low < next1.low && curr.low < next2.low) {
        supports.push(+curr.low.toFixed(2));
      }
  
      // Resistance: current high is higher than previous and next 2 candles
      if (curr.high > prev1.high && curr.high > prev2.high && curr.high > next1.high && curr.high > next2.high) {
        resistances.push(+curr.high.toFixed(2));
      }
    }
  
    // Group nearby support levels together
    const finalSupports = mergeNearbyLevels(supports, allowedDeviation, minTouches, zoneThreshold);
    const finalResistances = mergeNearbyLevels(resistances, allowedDeviation, minTouches, zoneThreshold);
  
    return {
      supportLevels: finalSupports,
      resistanceLevels: finalResistances
    };
  }
  
  // ✅ Helper: Group levels that are very close together
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
  
    // Now average the clusters
    const finalLevels: number[] = [];
    for (const group of clustered) {
      if (group.length >= minTouches) {
        const avgLevel = +(group.reduce((a, b) => a + b, 0) / group.length).toFixed(2);
        finalLevels.push(avgLevel);
      }
    }
  
    return finalLevels;
}


export async function s_r(limit:string){
    const db:Candle[]= [];
    try {
         const data = await get_data(limit,"5m")
               for(const element of data){
                    const obj = {
                        open:parseFloat(element[1]),
                        high:parseFloat(element[2]),
                        low:parseFloat(element[3]),
                        close:parseFloat(element[4]),
                        volume:parseFloat(element[5])
                    }
                    db.push(obj)
                }
        const result = detectSupportResistance(db);
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
    }
}

s_r('78')
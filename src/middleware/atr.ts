import {get_data} from '../API/binance.http.ts';

export async function calculate_atr(interval:"1m"|"5m"|"15m"|"30m"|"1h"|"4h"|"1d"="1h"):Promise<string>{
    const res = await get_data("15",interval);
    let atr:number = 0;
    for(let i = 1;i<res.length;i++){
        const high = parseFloat(res[i][2]);
        const low = parseFloat(res[i][3]);
        const prev_close = parseFloat(res[i-1][4]);
        const result = Math.max(high-low,Math.abs(high-prev_close),Math.abs(low-prev_close))
        atr+=result;
    }
    const atr_average = atr/14;
    return atr_average.toFixed(4)
}
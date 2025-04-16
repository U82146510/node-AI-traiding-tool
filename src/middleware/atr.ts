import {get_data} from '../API/binance.http.ts';

export async function calculate_atr():Promise<string>{
    const res = await get_data("15");
    let atr = 0;
    for(let i = 1;i<res.length;i++){
        const high = parseFloat(res[i][2]);
        const low = parseFloat(res[i][3]);
        const prev_close = parseFloat(res[i-1][4]);
        const result = Math.max(high-low,Math.abs(high-prev_close),Math.abs(low-prev_close))
        atr+=result;
    }
    console.log(atr/14)
    return (atr/14).toString()
}


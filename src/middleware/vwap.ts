import { get_data } from "../API/binance.http.ts";

export async function vwap(){
    try {
        
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const totalMinutesSinceMidnight = utcHours * 60 + utcMinutes;
        const candlesNeeded = Math.floor(totalMinutesSinceMidnight / 5).toString();
        
        let tp_volume:number = 0;
        let volume:number = 0;
  
        const raw_data = await get_data(candlesNeeded,"5m");
        for(const arg of raw_data){
            tp_volume += ((parseFloat(arg[2]) + parseFloat(arg[3]) + parseFloat(arg[4]))/3) * parseFloat(arg[5])
            volume += parseFloat(arg[5]);
        }
        const vwap = tp_volume / volume;
        return vwap.toFixed(4)
    } catch (error) {
        console.error(error);
        return '0'
    }
}
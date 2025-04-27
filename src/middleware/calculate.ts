import {get_data} from '../API/binance.http.ts';
import {scalpInfo} from '../OPENAI/scalp_traiding.ts';
import {rsi} from './rsi.ts';
import {vwap} from '../middleware/vwap.ts';


interface Data {
    open: string; high: string; low: string; close: string; volume: string;
}

export async function scalp(limit:string):Promise<string|undefined> { //50
    const db:Data[]= [];
    try {
       const data = await get_data(limit,"5m") // get data from binance
       for(const element of data){
            const obj = {
                open:element[1],
                high:element[2],
                low:element[3],
                close:element[4],
                volume:element[5]
            }
            db.push(obj)
        }
        const live_data = await get_data("1","5m");

        const live_price = live_data[0][4];
        const rsi_result = await rsi("5m");
        const vwap_result = await vwap();


        const response = await scalpInfo(vwap_result,rsi_result,live_price) as string; // call to openai
        return response

    } catch (error) {
        console.error(error);
    }
};
import {get_data} from '../API/binance.http.ts';
import {rangeInfo_DeepSeek} from '../DeepSeek/range_traiding.ts';
import { rsi } from './rsi.ts';

interface Data {
    open: string; high: string; low: string; close: string; volume: string;
}


export async function rt_deepseek(candlesticks:string):Promise<string|undefined> {
    const db:Data[]= [];
    try {
       const data = await get_data(candlesticks) // get data from binance
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
        const rsi_result = await rsi()
        const response = await rangeInfo_DeepSeek(db,rsi_result) as string; // call to DeepSeek
        return response

    } catch (error) {
        console.error(error);
    }
};
import {get_data} from '../API/binance.http.ts';
import {info} from '../OPENAI/support_resistance.ts';
import {rangeInfo} from '../OPENAI/range_traiding.ts';
import {rsi} from './rsi.ts';

interface Data {
    open: string; high: string; low: string; close: string; volume: string;
}

export async function sr(candlesticks:string):Promise<string|undefined> {
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
           
       
        const response = await info(db) as string; // call to openai
        return response

    } catch (error) {
        console.error(error);
    }
};

export async function rt(limit:string):Promise<string|undefined> { //50
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
        const previous_day = await get_data("2","1d");
        const [yesterday, today] = previous_day;
        const open_close:{
            high:string,low:string
        } = {
            high:yesterday[2],
            low:yesterday[3]
        }
        const rsi_result = await rsi()
        const response = await rangeInfo(db,rsi_result,open_close) as string; // call to openai
        return response

    } catch (error) {
        console.error(error);
    }
};
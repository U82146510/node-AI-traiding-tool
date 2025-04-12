import {get_data} from '../API/binance.http';
import {info} from '../OPENAI/openai';

interface Data {
    open: string; high: string; low: string; close: string; volume: string;
}

export async function calculate():Promise<string|undefined> {
    const db:Data[]= [];
    try {
       const data = await get_data()
       data.forEach((element: string[]) => {
            const obj = {
                open:element[1],
                high:element[2],
                low:element[3],
                close:element[4],
                volume:element[5]
            }
            db.push(obj)
       });
        const response = await info(db) as string;
        return response

    } catch (error) {
        console.error(error);
    }
};

calculate()
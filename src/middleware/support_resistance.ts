import {get_data} from '../API/binance.http';
import {info} from '../OPENAI/openai';


export async function support_resistance() {
    const db = [];
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
            db.push(obj);
       });
       const response = await info(data) as string;
       return JSON.parse(response);

    } catch (error) {
        console.error(error);
    }
};
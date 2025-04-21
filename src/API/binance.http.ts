import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const api = process.env.binance_http as string;
if(!api){
    console.error('missing binance http string');
    process.exit(1);
}

export async function get_data(candlesticks:string):Promise<string[]>{
    try {
        console.log(api+candlesticks)
        const raw_data = await fetch(api+candlesticks);
        const final = await raw_data.json()
         return final
    } catch (error) {
        console.error(error)
        return []
    }
}
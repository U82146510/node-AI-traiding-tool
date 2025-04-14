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

export async function get_data(candlesticks:string):Promise<any> {
    try {
        console.log(api+candlesticks)
        const raw_data = await fetch(api+candlesticks);
        return raw_data.json()
    } catch (error) {
        console.error(error)
    }
}
import dotenv from 'dotenv';
dotenv.config();

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
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.binance_http as string;
if(!api){
    console.error('missing binance http string');
    process.exit(1);
}

export async function get_data() {
    try {
        const raw_data = await fetch(api);
        return raw_data.json()
    } catch (error) {
        console.error(error)
    }
}
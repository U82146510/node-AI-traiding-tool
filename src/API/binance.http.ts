export async function get_data(limit:string,interval:"1m"|"5m"|"15m"|"30m"|"1h"|"4h"|"1d"="1h"):Promise<any[]>{
    const api = `https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=${interval}&limit=${limit}`
    try {

        const raw_data = await fetch(api);
        if (!raw_data.ok) {
            throw new Error(`Failed to fetch: ${raw_data.statusText}`);
         }
        const final = await raw_data.json()
        return final
    } catch (error) {
        console.error(error)
        return []
    }
}

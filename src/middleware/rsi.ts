import {get_data} from '../API/binance.http.ts';


async function rsi(){
    const raw_data = await get_data("15");
    const ccp:Number[] = []; // collect closing price.
    const cdc:Number[] = []; // calculate daily changes.
    for(const arg of raw_data){
        ccp.push(parseFloat(arg[4]))
    }
    console.log(ccp)
}
rsi()
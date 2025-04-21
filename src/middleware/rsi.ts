import {get_data} from '../API/binance.http.ts';


async function rsi(){
    const raw_data = await get_data("15");
    const ccp:number[] = []; // collect closing price.
    const cdc:number[] = []; // calculate daily changes.
    const gains:number[] = [] // push all gains 
    const losses:number[] = [] // push all losses.

    for(const arg of raw_data){
        ccp.push(parseFloat(arg[4]))
    }
    for(let i=1;i<ccp.length;i++){
        let range = i-1
        cdc.push(ccp[i]-ccp[range])
    }
    for(const arg of cdc){
        if(arg>0){
            gains.push(arg);
        }
        if(arg<0){
            losses.push(arg);
        }
    }
}
rsi()
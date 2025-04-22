import {get_data} from '../API/binance.http.ts';


export async function rsi():Promise<string>{
    const raw_data = await get_data("15");
    const ccp:number[] = []; // collect closing price.
    const cdc:number[] = []; // calculate daily changes.
    const gains:number[] = [] // push all gains 
    const losses:number[] = [] // push all losses.
    let av_g:number = 0;  // average gains
    let av_l:number = 0; // average losses

    for(const arg of raw_data){
        ccp.push(parseFloat(arg[4]))
    }
    for(let i=1;i<ccp.length;i++){
        cdc.push(ccp[i]-ccp[i-1])
    }
    for(const arg of cdc){
        if(arg>0){
            gains.push(arg);
        }
        if(arg<0){
            losses.push(Math.abs(arg));
        }
    }
    for(const arg of gains){
        av_g+=arg; 
    }
    for(const arg of losses){
        av_l+=arg;
    }

    const r_gain = av_g / 14;
    const r_losse = av_l / 14;
    const rs = r_gain/r_losse;
    const rsi = Math.round(100-(100/(1+rs)));
    console.log(rsi)
    return rsi.toFixed(2).toString();
}

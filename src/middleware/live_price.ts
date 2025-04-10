import { ws } from "../API/binance.ws";

export function live_price(){
    try {
        ws.on('message',(data)=>{
            const raw_data = data.toString();
            const result = JSON.parse(raw_data);
            console.log(result.k.c) 
        });   
    } catch (error) {
        console.error(error)
    }
};


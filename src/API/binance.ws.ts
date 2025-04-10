import websocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.binance_ws as string;
if(!api){
    console.error('missing ws api');
    process.exit(1);
};


export const ws = new websocket(api);

ws.on('error',(error:Error)=>{
    console.error(error.message);
    console.error(error.stack);
});
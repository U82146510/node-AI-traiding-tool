import {support_resistance} from './middleware/support_resistance';
import {start} from './config/atlas';
import {balance} from './middleware/balance'
import { ws } from "./API/binance.ws";
import Decimal from 'decimal.js';

const obj:{
    support:string;
    resistance:string;
    action:"buy" | "sell" | "hold";
    stop_loss:string;
    take_profit:string;
} = {
    support: '0',
    resistance: '0',
    action: 'sell',
    stop_loss: '0',
    take_profit: '0'
}



async function st(){
    try {
        const response = await support_resistance();
        obj.support = response.support;
        obj.resistance = response.resistance;
        obj.action = response.action
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

st()
import {calculate} from './middleware/support_resistance';

async function run(candlesticks:string){
    try {
        const response = await calculate(candlesticks);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

run("60") //inpurt of number of candlesticks
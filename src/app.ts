import {calculate} from './middleware/support_resistance';

async function st(){
    try {
        const response = await calculate();
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

st()
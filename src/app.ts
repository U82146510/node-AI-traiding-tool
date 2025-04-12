import {calculate} from './middleware/support_resistance';
import readline from 'readline';

async function run(candlesticks:string){
    try {
        const response = await calculate(candlesticks);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};



const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

function menu(){
    console.info('\t\t\t\t\tMenu');
    console.info('\t\t\tCalculate the support/resistance for SOLANA.\n' );
    rl.question('Enter number of candlesticks:',async(answer:string)=>{
        if(answer.trim().toLowerCase()==='exit'){
            rl.close();
            return;
        }
        if(/^\d+$/.test(answer)){
            await run(answer)
        }else{
            console.log('\nError: enter a valid input.')
        }
        menu()
    })

}

menu()
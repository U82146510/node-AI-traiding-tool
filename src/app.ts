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

function menu() {
    console.clear();
    console.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info('\t\t📊 SOLANA Trading Assistant');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.info('💡 This tool helps you calculate:');
    console.info('   • Support & Resistance levels');
    console.info('   • Trend direction');
    console.info('   • Risk/Reward conditions\n');
    console.info('📥 Enter the number of candlesticks to analyze');
    console.info('✏️ Type "exit" to quit\n');
  
    rl.question('🔢 Number of candlesticks: ', async (answer: string) => {
      if (answer.trim().toLowerCase() === 'exit') {
        rl.close();
        return;
      }
  
      if (/^\d+$/.test(answer)) {
        await run(answer);
      } else {
        console.log('\n❌ Error: Please enter a valid number.\n');
      }
  
      menu();
    });
  }
  

menu()
import {calculate} from './middleware/support_resistance';
import readline from 'readline';
import {bot} from './Telegram/bot';

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

function start_cli() {
    console.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info('\t\t📊 SOLANA Trading Assistant');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.info('🕒 Timeframe: 1-Hour Candles\n');
    console.info('💡 This tool helps you calculate:');
    console.info('   • Support & Resistance levels');
    console.info('   • Trend direction');
    console.info('   • Risk/Reward conditions\n');
    console.info('📥 Enter the number of 1H candlesticks to analyze');
    console.info('✏️ Type "exit" to quit\n');
  
    rl.question('🔢 Number of candlesticks: ', async (answer: string) => {
      if (answer.trim().toLowerCase() === 'exit') {
        console.log('CLI closed.');
        rl.close();
        process.exit(0);
      }
  
      if (/^\d+$/.test(answer)) {
        await run(answer);
      } else {
        console.log('\n❌ Error: Please enter a valid number.\n');
      }
  
      start_cli();
    });
  }

  

start_cli();
bot.start();
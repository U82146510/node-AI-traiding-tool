import {sr,rt} from './middleware/calculate.ts';
import readline from 'readline';
import {bot} from './Telegram/bot.ts';
import {calculate_atr} from './middleware/atr.ts';
import {rsi} from './middleware/rsi.ts';
import {rt_deepseek} from './middleware/calculate_deepseek.ts';

async function sr_run(candlesticks:string){  // Support & Resistance levels , Trend direction , Risk/Reward conditions\n'
    try {
        const response = await sr(candlesticks);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

async function rt_run() { // range-trading strategy 
  try {
    const response = await rt("168");
    console.log(response)
  } catch (error) {
    console.error(error);
  }
};

async function rt_deepseek_run() {
    try {
        const response = await rt_deepseek("168");
        console.log(response);
    } catch (error) {
        console.error(error)
    }
}

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

function start_cli() {
  console.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('🟣        📊 SOLANA Trading Assistant');
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.info('🕒  Timeframe: 1-Hour Candles\n');
  
  console.info('📈 Available Analysis Options:');
  console.info('   1️⃣  Trend-based Strategy');
  console.info('       • Detect Support & Resistance');
  console.info('       • Identify Trend Direction');
  console.info('       • Estimate Risk/Reward Levels\n');
  
  console.info('   2️⃣  Range-trading Strategy');
  console.info('       • Identify Clean Horizontal Ranges');
  console.info('       • Detect Valid Buy/Sell Zones\n');

  console.info('   3️⃣  Momentum Indicators');
  console.info('       • RSI (Relative Strength Index)');
  console.info('       • ATR (Average True Range)\n');

  console.info('📥 Instructions:');
  console.info('   🔹 Enter a number (e.g. 120) to analyze that many candlesticks with the trend strategy');
  console.info('   🔹 Type "range" to run the range-trading strategy on the last 168 candles');
  console.info('   🔹 Type "rsi" to calculate RSI');
  console.info('   🔹 Type "atr" to calculate Average True Range');
  console.info('   🔹 Type "exit" to quit\n');

  rl.question('🧮 Your input: ', async (answer: string) => {
    const command = answer.trim().toLowerCase();

    if (command === 'exit') {
      console.log('👋 CLI closed. Happy trading!');
      rl.close();
      process.exit(0);
    }

    if (/^\d+$/.test(command)) {
      await sr_run(command);
    } else if (command === 'range') {
      await rt_run();
    } else if (command === 'atr') {
      await calculate_atr();
    } else if (command === 'rsi') {
      await rsi();
    } else if(command === 'ranged'){
      await rt_deepseek_run();
    } else {
      console.warn('⚠️ Invalid input. Please enter a number, "range", "rsi", "atr", or "exit".');
    }

    start_cli();
  });
}


start_cli();
bot.start();
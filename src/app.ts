import {scalp} from './middleware/calculate.ts';
import readline from 'readline';
import {bot} from './Telegram/bot.ts';
import {calculate_atr} from './middleware/atr.ts';
import {rsi} from './middleware/rsi.ts';
import {rt_deepseek} from './middleware/calculate_deepseek.ts';
import {s_r} from './middleware/scalp_zones.ts'

async function scalp_run() { // range-trading strategy OpenAI
  try {
    const response = await scalp("30");
    console.log(response)
  } catch (error) {
    console.error(error);
  }
};

async function rt_deepseek_run() { // range-trading strategy DeepSeek
    try {
        const response = await rt_deepseek("100");
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
  
  console.info('🕒  Timeframes:');
  console.info('   - 5-minute candles (scalping, manual zones, RSI 5min, ATR 5min)');
  console.info('   - 1-hour candles (range-trading, RSI, ATR)\n');
  
  console.info('📈 Available Analysis Options:');
  console.info('   1️⃣  Manual Support/Resistance (5min)');
  console.info('       • Calculate manual support and resistance zones\n');

  console.info('   2️⃣  Scalp Strategy (5min)');
  console.info('       • Identify quick scalp opportunities using OpenAI (last 30 candles)\n');
  
  console.info('   3️⃣  Range-trading Strategy (DeepSeek)');
  console.info('       • H1 Support/Resistance');
  console.info('       • M5 Liquidity Sweeps & Entry Signals');
  console.info('       • Confidence-Scored Trade Recommendations\n');

  console.info('   4️⃣  Momentum Indicators');
  console.info('       • RSI (Relative Strength Index) 1H and 5M');
  console.info('       • ATR (Average True Range) 1H and 5M\n');

  console.info('📥 Instructions:');
  console.info('   🔹 Type "sr5min"   → Calculate manual Support/Resistance (5-min timeframe)');
  console.info('   🔹 Type "scalp"    → Run 5-minute scalp strategy (OpenAI)');
  console.info('   🔹 Type "range"    → Run range-trading strategy (DeepSeek)');
  console.info('   🔹 Type "rsi"      → Calculate RSI (1-hour candles)');
  console.info('   🔹 Type "rsi5min"  → Calculate RSI (5-minute candles)');
  console.info('   🔹 Type "atr"      → Calculate ATR (1-hour candles)');
  console.info('   🔹 Type "atr5min"  → Calculate ATR (5-minute candles)');
  console.info('   🔹 Type "exit"     → Quit the assistant\n');

  rl.question('🧮 Your input: ', async (answer: string) => {
    const command = answer.trim().toLowerCase();

    if (command === 'exit') {
      console.log('👋 CLI closed. Happy trading!');
      rl.close();
      process.exit(0);
    }
    if (command === "sr5min") {
      const response = await s_r("78"); // Manual S/R for 5min
      console.log(response);
    } else if (command === 'atr') {
      await calculate_atr();
    } else if (command === 'scalp') {
      await scalp_run();
    } else if (command === 'rsi5min') {
      await rsi('5m');
    } else if (command === 'atr5min') {
      await calculate_atr("5m");
    } else if (command === 'rsi') {
      await rsi();
    } else if (command === 'range') {
      await rt_deepseek_run();
    } else {
      console.warn('⚠️ Invalid input. Please enter a valid option.');
    }

    start_cli();
  });
}



start_cli();
bot.start();
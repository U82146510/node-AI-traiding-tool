import { Bot } from "grammy";
import dotenv from 'dotenv';
import { sr, rt } from "../middleware/calculate.ts";
import { fileURLToPath } from 'url';
import { calculate_atr } from '../middleware/atr.ts';
import { rsi } from '../middleware/rsi.ts';
import { rt_deepseek } from '../middleware/calculate_deepseek.ts';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const api = process.env.telegram;

if (!api) {
  console.error('missing telegram secret');
  process.exit(1);
}

export const bot = new Bot(api);

// ✅ /start command with correct full menu
bot.command('start', (ctx) => {
  ctx.reply(
    `
📊 *Welcome to the SOLANA Trading Bot!*

This bot analyzes *1-hour candles* to help you trade smarter.

Here’s what I can help you with:
━━━━━━━━━━━━━━━━━━━━
🔹 *Support & Resistance Analysis*      → "trend"
🔹 *Trend Detection (OpenAI)*           → "range"
🔹 *Range-Trading (DeepSeek)*           → "ranged"
🔹 *RSI (Relative Strength Index)*      → "rsi"
🔹 *ATR (Average True Range)*           → "atr"
━━━━━━━━━━━━━━━━━━━━

📥 *To begin:*
- Type a number to analyze that many 1H candlesticks (e.g. 60, 120, 200)
- Type "trend"   → Detect support, resistance, and trend direction
- Type "range"   → OpenAI-based range-trading strategy
- Type "ranged"  → DeepSeek-based range-trading strategy
- Type "rsi"     → Calculate RSI
- Type "atr"     → Calculate ATR
- Type "exit"    → Stop the bot
    `,
    { parse_mode: 'Markdown' }
  );
});

// ✅ Main command handler
bot.on('message', async (input) => {
  if (input.message.text?.toLowerCase() === 'trend') {
    const response = await sr("200") as string;
    const start = response.slice(8);
    const end = start.slice(0, -4);
    input.reply(end);
  }

  if (input.message.text?.toLowerCase() === 'range') { // for OpenAI model
    const response = await rt('100') as string;
    const start = response.slice(8);
    const end = start.slice(0, -4);
    input.reply(end);
  }

  if (input.message.text?.toLowerCase() === 'ranged') { // for DeepSeek model
    const response = await rt_deepseek('100') as string;
    const start = response.slice(8);
    const end = start.slice(0, -4);
    input.reply(end);
  }

  if (input.message.text?.toLowerCase() === 'atr') {
    const response = await calculate_atr();
    input.reply(response);
  }

  if (input.message.text?.toLowerCase() === 'rsi') {
    const response = await rsi();
    input.reply(response);
  }
});

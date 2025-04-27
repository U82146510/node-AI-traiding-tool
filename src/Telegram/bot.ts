import { Bot, Keyboard } from "grammy";
import dotenv from 'dotenv';
import { scalp } from "../middleware/calculate.ts";
import { fileURLToPath } from 'url';
import { calculate_atr } from '../middleware/atr.ts';
import { rsi } from '../middleware/rsi.ts';
import { rt_deepseek } from '../middleware/calculate_deepseek.ts';
import {vwap} from '../middleware/vwap.ts';
import path from 'path';
import {s_r} from '../middleware/scalp_zones.ts'

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

// 🔘 Menu keyboard
const menu = new Keyboard()
  .text("scalp").text("rsi5min").text("atr5min").row()
  .text("range").text("rsi").text("atr").row()
  .text("vwap5min").text("manual_5min_zones").row()
  .resized(); // fit to screen

// ✅ Start command with buttons
bot.command('start', (ctx) => {
  ctx.reply(
    `
📊 *Welcome to the SOLANA Trading Bot!*

━━━━━━━━━━━━━━━━━━━━
🔹 *scalp* — Scalping analysis based on the last 30-78 candles (5-minute timeframe)
🔹 *rsi5min* — RSI(14) calculation on 5-minute candles
🔹 *atr5min* — ATR and risk/reward levels on 5-minute candles
🔹 *range* — Range trading detection using DeepSeek on 1-hour candles
🔹 *rsi* — RSI(14) calculation on 1-hour candles
🔹 *atr* — ATR and risk/reward levels on 1-hour candles
🔹 *vwap5min* — VWAP calculation based on 5-minute candles
🔹 *manual_5min_zones* — Manual support/resistance zone detection on 5-minute candles
━━━━━━━━━━━━━━━━━━━━

📥 *Tap a button below to start your analysis!*
    `,
    {
      parse_mode: 'Markdown',
      reply_markup: menu
    }
  );
});



bot.on('message', async (input) => {
  const text = input.message.text?.toLowerCase();
  if (!text) return;

  try {
    if(text === 'manual_5min_zones'){
      const response = await s_r("78");
      await input.reply(`Support: ${response?.supportLevels}\nResistance: ${response?.resistanceLevels}`, 
      { reply_markup: menu });
    } else if(text === 'vwap5min'){
      const response = await vwap();
      await input.reply(response, { reply_markup: menu });
    } else if (text === 'atr') {
      const response = await calculate_atr();
      await input.reply(`Live: ${response.live_price.toString()}\nPofit: ${response.profit.toString()}\nStop: ${response.stop_loss.toString()}`, 
      { reply_markup: menu });
    } else if (text === 'scalp') {
      const response = await scalp('30') as string;
       await input.reply(response, { reply_markup: menu });
    } else if (text === 'range') {
      const response = await rt_deepseek('100') as string;
      const result = response.slice(8, -4);
      await input.reply(result, { reply_markup: menu });
    } else if (text === 'rsi') {
      const response = await rsi();
      await input.reply(response, { reply_markup: menu });
    }else if(text === 'rsi5min'){
      const response = await rsi("5m");
      await input.reply(response, { reply_markup: menu });
    } else if (text === 'atr5min') {
      const response = await calculate_atr("5m");
      await input.reply(`Live: ${response.live_price.toString()}\nPofit: ${response.profit.toString()}\nStop: ${response.stop_loss.toString()}`, 
      { reply_markup: menu });
    } else {
      await input.reply("❌ Invalid command. Use the menu below.", { reply_markup: menu });
    }
  } catch (err) {
    console.error("Bot error:", err);
    await input.reply("❌ An error occurred while processing your request.", { reply_markup: menu });
  }
});

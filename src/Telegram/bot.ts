import { Bot, Keyboard } from "grammy";
import dotenv from 'dotenv';
import { rt } from "../middleware/calculate.ts";
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

// 🔘 Menu keyboard
const menu = new Keyboard()
  .text("scalp").text("rsi5min").text("atr5min").row()
  .text("range").text("rsi").text("atr").row()
  .resized(); // fit to screen

// ✅ Start command with buttons
bot.command('start', (ctx) => {
  ctx.reply(
    `
📊 *Welcome to the SOLANA Trading Bot!*

Tap a button below to start your analysis:
    `,
    {
      parse_mode: 'Markdown',
      reply_markup: menu
    }
  );
});

// ✅ Respond to button taps
bot.on('message', async (input) => {
  const text = input.message.text?.toLowerCase();
  if (!text) return;

  try {
    if (text === 'atr') {
      const response = await calculate_atr();
      await input.reply(response, { reply_markup: menu });
    } else if (text === 'atr') {
      const response = await rt('50') as string;
      const result = response.slice(8, -4);
      await input.reply(result, { reply_markup: menu });
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
      await input.reply(response, { reply_markup: menu });
    } else if (text === 'exit') {
      await input.reply("👋 Bot session ended. Type /start to begin again.");
    } else {
      await input.reply("❌ Invalid command. Use the menu below.", { reply_markup: menu });
    }
  } catch (err) {
    console.error("Bot error:", err);
    await input.reply("❌ An error occurred while processing your request.", { reply_markup: menu });
  }
});

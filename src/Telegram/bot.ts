import { Bot } from "grammy";
import dotenv from 'dotenv';
import { sr,rt } from "../middleware/calculate.ts";
import { fileURLToPath } from 'url';
import {calculate_atr} from '../middleware/atr.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, '../.env')
  });

const api = process.env.telegram

if(!api){
    console.error('missing telegram secret');
    process.exit(1);
}

export const bot = new Bot(api);

bot.command('start', (ctx) => {
    ctx.reply(
      `
  📊 *Welcome to the SOLANA Trading Bot!*
  
  This bot analyzes *1-hour candles* to help you trade smarter.
  
  Here’s what I can help you with:
  ━━━━━━━━━━━━━━━━━━━━
  🔹 *Support & Resistance Analysis*
  🔹 *Trend Detection*
  🔹 *Risk/Reward Estimation*
  ━━━━━━━━━━━━━━━━━━━━
  
  📥 *To begin:*
  Please enter the _number of 1H candlesticks_ to analyze (e.g. 60, 120, 200).
  Type "exit" to stop the bot.
  `,
      { parse_mode: 'Markdown' }
    );
  });
  

bot.on('message',async(input)=>{
    const candlesticks = input.message.text ? input.message.text : "120";
    if(/^\d+$/.test(candlesticks)){
      const response = await sr(candlesticks) as string;
      const start = response.slice(8);
      const end = start.slice(0,-4)
      input.reply(end);
    }
    if(input.message.text==='range'){
      const response = await rt('168') as string;
      const start = response.slice(8);
      const end = start.slice(0,-4)
      input.reply(end);
    }
    if(input.message.text==='atr'){
      const response = await calculate_atr();
      input.reply(response);
    }
})


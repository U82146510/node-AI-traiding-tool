import { Bot } from "grammy";
import dotenv from 'dotenv';
dotenv.config();

const api = process.env.telegram

if(!api){
    console.error('missing telegram secret');
    process.exit(1);
}

const bot = new Bot(api);

bot.command('start', (ctx) => {
    ctx.reply(`
  📊 *Welcome to the SOLANA Trading Bot!*
  
  Here’s what I can help you with:
  ━━━━━━━━━━━━━━━━━━━━
  🔹 *Support & Resistance Analysis*
  🔹 *Trend Detection*
  🔹 *Risk/Reward Estimation*
  ━━━━━━━━━━━━━━━━━━━━
  
  📥 *To begin:*
  Please enter the _number of candlesticks_ to analyze (e.g. 60, 120, 200).
  `);
  });

bot.on('message',(input)=>{
    input.reply('test');
})


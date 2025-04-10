import OpenAI from "openai";
import dotnev from 'dotenv';
dotnev.config();

const api = process.env.openai;
if(!api){
    console.error('missing openai api');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey:api
});


export async function info(params: Array<{ open: string; high: string; low: string; close: string; volume: string }>) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
  You are a trading assistant specialized in **scalping** the XRP/USDT pair using 15-minute candles. You receive recent market data in the format: ${JSON.stringify(params)}.
  
  Instructions:
  - Analyze the short-term **support** and **resistance**.
  - Use **volume spikes**, **candle structure**, and **momentum**.
  - Decide if the trader should **buy**, **sell**, or **hold**.
  - For a "buy" or "sell" action, suggest a **stop-loss** and a **take-profit** value.
  
  Return strictly this **JSON** format with no explanations or extra text:
  {
    "support": "price",
    "resistance": "price",
    "action": "buy" | "sell" | "hold",
    "stop_loss": "price",
    "take_profit": "price"
  }
            `.trim()
          }
        ]
      });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in info():', error);
    }
  }
  
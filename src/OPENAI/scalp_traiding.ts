import OpenAI from "openai";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const api = process.env.openai;
if(!api){
    console.error('missing openai api');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey:api
});



export async function scalpInfo(
  vwap:string, // here will be passed the vwap for 78 candlesticks of 5 min timeframe for Solana crypto token.
  rsi:string, // 5 min timeframe rsi with 14 candlesticks for Solana crypto token.
   live_price:string // live price from binance as it is for 5 min timeframe.
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a professional crypto scalping assistant specialized in SOL/USDT on the 5-minute timeframe.

You will be given:
- VWAP (Volume Weighted Average Price) over 78 candles
- RSI(14) on the 5-minute chart
- Current live price

### Rules to Make a BUY Decision:

1. **VWAP Rule**:
   - BUY only if live price is ABOVE VWAP (bullish pressure).

2. **RSI Rule**:
   - Ideal BUY if RSI is between 35 and 50.
   - No BUY if RSI <30 (oversold) or >60 (overbought).

3. **Final Decision**:
   - If both VWAP and RSI conditions are satisfied ➔ "BUY"
   - Otherwise ➔ "NO BUY"

### Output Format (STRICT JSON):

{
  "decision": "BUY" | "NO BUY",
  "reason": "Short explanation under 20 words"
}

### Inputs:
VWAP: ${vwap}
RSI (5min): ${rsi}
Live Price: ${live_price}
`.trim()
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in rangeInfo():", error);
    return null;
  }
}

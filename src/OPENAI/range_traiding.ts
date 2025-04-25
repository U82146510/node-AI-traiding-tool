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



export async function rangeInfo(
  params: Array<{ open: string; high: string; low: string; close: string; volume: string }>,
  rsi:string,
  dailyLevels: { high: string; low: string }) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a professional crypto trading algorithm analyzing SOL/USDT 5-minute charts for high-probability scalping opportunities.

### Core Rules:
1. Support/Resistance Identification:
   - Requires ≥2 CLEAR price reactions (bounces/rejections) within last 20 candles
   - Levels must show:
     * Visible liquidity (volume spikes + order book confirmation)
     * Confluence with:
       - 61.8% or 78.6% Fibonacci retracement
       - Previous daily high: ${dailyLevels.high}
       - Previous daily low: ${dailyLevels.low}
   - Round to 2 decimals (e.g., 142.67)

2. RSI Context (${rsi}):
   - <30 or >70: Only trade with trend confirmation
   - 30-70: Neutral (preferred)
   - Divergence overrides level priority

3. Wick Handling:
   - Ignore single wicks <0.5% of candle range
   - Consider wicks with:
     * ≥2x average volume
     * Consecutive rejections

4. Output Format (STRICT JSON):
{
  "support": number | null,
  "resistance": number | null,
  "confidence": "Low"|"Medium"|"High",
  "stopLoss": number | null,
  "target": number | null,
  "comment": "Max 15 words"
}

### Prohibited:
- Predicting price direction
- Levels without volume confirmation
- Over 3 levels per side
`.trim()
        },
        {
          role: "user",
          content: JSON.stringify(params)
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in rangeInfo():", error);
    return null;
  }
}

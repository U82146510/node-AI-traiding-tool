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


export async function info(params: Array<{ open: string; high: string; low: string; close: string; volume: string }>) {
  try {
    const response = await openai.chat.completions.create({
      model:'gpt-4-0125-preview',
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a crypto trading assistant analyzing the **SOL/USDT** pair using 1-hour candles.

### Objective:
Identify medium-term market structure by detecting:
- **support**: A reliable price level with multiple bounce reactions over the last 5–7 days
- **resistance**: A price level that has acted as a ceiling multiple times in the same range
- **trend**: One of "uptrend", "downtrend", or "sideways"
- **reason**: Explain briefly based on candle structure, volume, and repeated interactions

### Criteria:
- Focus on **medium-term zones**, not recent or one-off wicks
- Support/resistance levels should have **2–3 rejections** or **high-volume tests**
- Use swing highs/lows, consolidation areas, and volume spikes as confluence
- Ignore minor spikes or single-bar reactions
- Trend logic:
  - "uptrend": consistent higher highs & higher lows
  - "downtrend": consistent lower highs & lower lows
  - "sideways": choppy or range-bound movement

### Output:
Return a JSON object in this exact format, read the object and return what is written in it:
{
  "support": "price",
  "resistance": "price",
  "trend": "uptrend" | "downtrend" | "sideways",
  "recommendation:"Enter a trade" | "Stay away"
}
Return only this OBJECT. Do not include explanations outside the object.
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
    console.error("Error in info():", error);
    return null;
  }
}

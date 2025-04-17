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
      model: 'gpt-4-0125-preview',
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
- **recommendation**: Suggest if one should enter a trade or stay away
- **confidence**: Indicate how strong or reliable the recommendation is

### Criteria:
- Focus on **medium-term zones**, not recent or one-off wicks
- Support/resistance levels should have **2–3 rejections** or **high-volume tests**
- Use swing highs/lows, consolidation areas, and volume spikes as confluence
- Ignore minor spikes or single-bar reactions
- Trend logic:
  - "uptrend": consistent higher highs & higher lows
  - "downtrend": consistent lower highs & lower lows
  - "sideways": choppy or range-bound movement

### Confidence Scoring:
Determine how confident you are in the trade recommendation based on all of the following:

1. **Trend clarity** — Higher highs/lows or lower highs/lows with clean structure
2. **Support/resistance** — Multiple valid rejections or bounces (2 or more)
3. **Volume confirmation** — Spikes on breakouts, tests, or key reactions
4. **Risk/Reward** — Entry is not too close to resistance or invalidation

Scoring logic:
- Return "High" **only if all 4 criteria are clearly met**
- Return "Medium" if 2–3 conditions are met with moderate confluence
- Return "Low" if most conditions are unclear or weak

Use only: "Low", "Medium", or "High" for the "confidence" field.

### Output:
Return a JSON object in this exact format:
{
  "support": "price",
  "resistance": "price",
  "trend": "uptrend" | "downtrend" | "sideways",
  "recommendation": "Enter a trade" | "Stay away",
  "confidence": "Low" | "Medium" | "High"
}

Return only this object. Do not include explanations outside the object.
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

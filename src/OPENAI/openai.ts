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
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a crypto trading assistant analyzing the **SOL/USDT** pair using recent 1-hour candles.

### Your task:
Identify and return only:
- **support**: A strong price level where price recently bounced
- **resistance**: A strong price level where price was recently rejected
- **trend**: One of "uptrend", "downtrend", or "sideways"
- **reason**: Explain why you chose those levels and that trend based on price structure, wicks, and volume

### Guidelines:
- Use candle structure, swing highs/lows, and volume to detect S/R levels
- Support must be **at or below** the current price
- Resistance must be **at or above** the current price
- Trend logic:
  - "uptrend" if higher highs + higher lows
  - "downtrend" if lower highs + lower lows
  - "sideways" if price is range-bound
- Focus on clarity: choose levels with **at least 2–3 rejections** or **high volume re-tests**
- Do not guess: if trend is unclear, say "sideways"

### Output (strict JSON format):
{
  "support": "price",
  "resistance": "price",
  "trend": "uptrend" | "downtrend" | "sideways",
  "reason": "Your explanation here"
}
Return only the JSON. No extra commentary or headers.
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
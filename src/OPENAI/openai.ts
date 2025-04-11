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
    const period = 14;

    if (params.length < period + 1) {
      throw new Error(`At least ${period + 1} candles are required to calculate ATR.`);
    }

    // ✅ ATR Calculator
    const calculateATR = (candles: typeof params, period: number): number => {
      const trueRanges = [];

      for (let i = candles.length - period; i < candles.length; i++) {
        const prevClose = parseFloat(candles[i - 1].close);
        const high = parseFloat(candles[i].high);
        const low = parseFloat(candles[i].low);

        const tr = Math.max(
          high - low,
          Math.abs(high - prevClose),
          Math.abs(low - prevClose)
        );

        trueRanges.push(tr);
      }

      return trueRanges.reduce((sum, tr) => sum + tr, 0) / period;
    };

    const atr = calculateATR(params, period);
    const latestPrice = parseFloat(params[params.length - 1].close);
    const entry = latestPrice.toFixed(2);

    if (isNaN(atr) || isNaN(latestPrice)) {
      throw new Error("Invalid data: ATR or latest price is not a number.");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are a trading assistant focused on analyzing the **SOL/USDT** crypto pair using **1-hour candles**.

### Input:
- Recent 1-hour candles: ${JSON.stringify(params)}
- ATR (Average True Range): ${atr.toFixed(2)}
- Entry price: ${entry}

### Strategy Rules:
- This is a **long-only** strategy. No shorts.
- Entry = ${entry} (the latest 1-hour close)
- Only return "buy" if all risk conditions are satisfied, otherwise return "hold".

### Trend Logic:
- Detect overall trend: "uptrend", "downtrend", or "sideways"
- Only allow "buy" if trend is **uptrend** or **sideways**
- If trend is **downtrend**, return "hold"

### Support & Resistance Logic:
- Determine support as a strong recent bounce zone below the entry
- Determine resistance as a level above the entry that price failed to break
- Support must be **below** or **equal to** the entry price
- Resistance must be **above** or **equal to** the take profit level

### Entry Conditions:
- Entry must be **within 1.5% of support**
- If entry is **closer than 1% to resistance**, suggest "hold" unless breakout is very likely

### Risk Management:
- stop_loss = entry - 1 × ATR
- take_profit = entry + 2 × ATR
- reward = take_profit - entry
- risk = entry - stop_loss
- reward/risk must be **≥ 1.5**

### Output:
Return only this exact JSON format, using the values discussed above:
{
  "support": "price",
  "resistance": "price",
  "trend": "uptrend" | "downtrend" | "sideways",
  "action": "buy" | "hold",
  "entry": "${entry}",
  "stop_loss": "price",
  "take_profit": "price",
  "reason": "Explain clearly why 'buy' or 'hold' was chosen, based on price, trend, and R/R logic."
}
          `.trim()
        }
      ]
    });

    const result = response.choices[0].message.content;
    return result
  } catch (error) {
    console.error("Error in info():", error);
    return null;
  }
}

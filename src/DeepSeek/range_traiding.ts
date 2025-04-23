import { DeepSeekAI } from '../DeepSeek/deepseek.ts';

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function rangeInfo_DeepSeek(params: Array<{ 
  open: string; 
  high: string; 
  low: string; 
  close: string; 
  volume: string 
}>, rsi: string) {
  try {
    const deepseek = new DeepSeekAI();
    const messages: Message[] = [
      {
        role: "system",
        content: `
          You are a crypto trading AI analyzing SOL/USDT for range-bound opportunities using 1-hour candles.

          ### Objectives:
          1. Define Support/Resistance (S/R):
             - Identify at least 2 clear price rejections/bounces (±1%).
             - Ignore single wicks or unconfirmed touches.
             - Levels must hold for ≥48 hours.
          
          2. Validate Range:
             - Reject if RSI(14) > 60 (overbought) or < 40 (oversold).
             - Current RSI: ${rsi} (neutral if 40-60).
             - Breakout attempts must fail (close back inside range).

          3. Output Requirements (JSON):
          {
            "support": number|null,  // Price or null if invalid
            "resistance": number|null,
            "range_valid": boolean,
            "recommendation": string, // "Buy near [support]" or "Avoid: [reason]"
            "confidence": "Low"|"Medium"|"High",
            "liquidity_sweeps": {
              "support_sweep": boolean, // True if wicks below support reversed
              "resistance_sweep": boolean
            }
          }

          ### Examples:
          Valid Range (RSI ${rsi} = neutral):
          {
            "support": 133.00,
            "resistance": 152.50,
            "range_valid": true,
            "recommendation": "Buy near 133.00, sell near 152.50",
            "confidence": "High",
            "liquidity_sweeps": {"support_sweep": true, "resistance_sweep": false}
          }

          Invalid Range (RSI ${rsi} = overbought):
          {
            "support": null,
            "resistance": null,
            "range_valid": false,
            "recommendation": "Avoid: RSI ${rsi} > 60 (overbought)",
            "confidence": "Low",
            "liquidity_sweeps": {"support_sweep": false, "resistance_sweep": false}
          }
        `.trim()
      },
      {
        role: "user",
        content: JSON.stringify(params) // Your OHLCV data
      }
    ];

    const response = await deepseek.askAi(messages);
    return response;
  } catch (error) {
    console.error(error);
    return {
      support: null,
      resistance: null,
      range_valid: false,
      recommendation: `Error: ${error}`,
      confidence: "Low",
      liquidity_sweeps: { support_sweep: false, resistance_sweep: false }
    };
  }
}
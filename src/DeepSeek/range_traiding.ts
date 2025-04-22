import {DeepSeekAI} from '../DeepSeek/deepseek.ts';

type Message = {
    role: "user"|"assistant"|"system";
    content:string;
};

export async function rangeInfo_DeepSeek(params:Array<{ open: string; high: string; low: string; close: string; volume: string }>) {
     try {
        const deepseek = new DeepSeekAI();
        const messages: Message[] = [
            {
                role: "system",
                content: `
      You are a crypto trading assistant analyzing the **SOL/USDT** pair using 1-hour candles.
      
      ### Objective:
      Identify valid **range-bound trading opportunities** by detecting:
      - **Support**: A level tested at least 2 times with price bouncing from it
      - **Resistance**: A level tested at least 2 times with price rejected from it
      - **Range Validity**: Confirm that price is moving between these levels without breakout
      - **Recommendation**: If the range is valid, suggest "Buy near support, sell near resistance". Otherwise, suggest "Stay away"
      - **Confidence**: Estimate how reliable this range setup is
      
      ### Range Criteria:
      - Range must exist for at least 2–3 days (i.e., multiple price cycles between levels)
      - Support and resistance must each have at least **2 clear bounce or rejection points**
      - There must be no strong breakout candles (with high volume) outside the range
      - Ignore minor wicks, anomalies, and unconfirmed touches
      - Only suggest trades if the range looks stable, predictable, and clean
      
      ### Confidence Scoring:
      Score the quality of the range using:
      1. **Clarity of range** — Is price cleanly bouncing between two levels?
      2. **Rejection strength** — Are reactions decisive or weak?
      3. **Volume behavior** — Is volume decreasing near the middle and spiking at edges?
      4. **Breakout risk** — Is price staying contained or coiling for breakout?
      
      Scoring logic:
      - Return "High" only if all 4 criteria are clearly met
      - Return "Medium" if 2–3 are met with decent structure
      - Return "Low" if the range is loose, noisy, or risky
      
      Use only: "Low", "Medium", or "High" for the "confidence" field.
      
      ### Output:
      Return a JSON object in this exact format:
      
      {
        "support": "price",
        "resistance": "price",
        "range_valid": true | false,
        "recommendation": "Buy near support, sell near resistance" | "Stay away",
        "confidence": "Low" | "Medium" | "High"
      }
      
      Return ONLY this object. Do not include explanations outside the object.
              `.trim()
              }
        ]
        const response = await deepseek.askAi(messages);
        return response
    } catch (error) {
        console.error(error);
    }
}
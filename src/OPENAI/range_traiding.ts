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



export async function rangeInfo(params: Array<{ open: string; high: string; low: string; close: string; volume: string }>) {
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
  Identify valid **range-bound trading opportunities** by detecting:
  - **Support**: A level tested at least 2 times with price bouncing from it
  - **Resistance**: A level tested at least 2 times with price rejected from it
  - **Range Validity**: Confirm that price is moving between these levels without breakout
  - **Reason**: Explain your logic based on structure and volume
  - **Recommendation**: If the range is valid, suggest "Buy near support, sell near resistance". Otherwise, suggest "Stay away".
  
  ### Criteria:
  - Range must be active for at least 2–3 days
  - Support and resistance must have **2+ clear reactions**
  - Range must not have been broken with high volume
  - Ignore one-off wicks and isolated candles
  - Do not suggest trades if the range is untested or unstable
  
  ### Output:
  Return a JSON object in this exact format:
  
  {
    "support": "price",
    "resistance": "price",
    "range_valid": true | false,
    "recommendation": "Buy near support, sell near resistance" | "Stay away"
  }
  
  Return ONLY this JSON object. Do not include explanations outside the object.
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
  
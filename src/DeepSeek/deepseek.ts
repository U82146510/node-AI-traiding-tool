import dotenv from 'dotenv';
dotenv.config();

const api = process.env.deepseek as string;
if(!api){
    console.error('missing api');
    process.exit(1);
}


type Message = {
    role: "user"|"assistant"|"system";
    content:string;
};

type DeepSeekResponse = {
    choices:{
        message:{
            content:string;
        }
    }[];
}

export class DeepSeekAI{
    private api_key:string;
    private api_url:string="https://api.deepseek.com/v1/chat/completions";
    constructor(){
        this.api_key = api;
    }
    async askAi(messages:Message[],model:string = "deepseek-chat"){
        try {
            const response = await fetch(this.api_url,{
                method:'POST',
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.api_key}`,
                },
                body:JSON.stringify({
                    model,messages,temperature:0.7,max_tokens: 1000
                })
            });
            if(!response.ok){
                const error_data = await response.json();
                throw new Error(`API Error: ${error_data.error?.message || response.statusText}`);
            }
            const data:DeepSeekResponse = await response.json();
            return data.choices[0].message.content;
        } catch (error:unknown) {
            console.error('API Error',error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}
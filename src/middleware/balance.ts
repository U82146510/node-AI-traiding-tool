import { User } from "../models/user";

export async function balance(price:number){
    try {
        const user = await User.findByIdAndUpdate('67f7c41c5aa28ad6a3dfe941',
            {$set:{balance:price}},{
                new:true
            }
        );
    } catch (error) {
        console.error(error);
    }
};

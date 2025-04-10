import mongoose,{Document,Schema,model} from "mongoose";


interface IUser extends Document{
    balance:number;
}

const user_schema = new Schema<IUser>({
    balance:{
        type:Number,default:0
    }
});

export const User = model<IUser>('User',user_schema);
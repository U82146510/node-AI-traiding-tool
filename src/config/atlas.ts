import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const atlas = process.env.atlas;
if(!atlas){
    console.error(atlas);
    process.exit(1);
}

export const start = async()=>{
    try {
        await mongoose.connect(atlas);
    } catch (error) {
        console.error(error);
    }
};

const db:mongoose.Connection =  mongoose.connection;
db.on('error',(error:Error)=>{
    if(error instanceof Error){
        console.error(error);
    }
});


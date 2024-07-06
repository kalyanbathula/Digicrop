//Util to connect to mongoDB
import mongoose from "mongoose";
import { json } from 'body-parser';
 const NEXT_PUBLIC_MONGODB_URI="mongodb://localhost:27017/KisanLink"


export async function dbConnect() {
    console.log(NEXT_PUBLIC_MONGODB_URI)
        let conn = await mongoose
            .connect(String(NEXT_PUBLIC_MONGODB_URI))
            .then(console.log("Connected to db"));

        
        return conn;    
}

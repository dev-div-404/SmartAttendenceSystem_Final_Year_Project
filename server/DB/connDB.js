import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', true);

const connectDB = () =>{
    try{
        mongoose.connect(process.env.DB_URI)
        console.log('database connected')
    }catch(err){
        console.log(err)
    }
}

export default connectDB;

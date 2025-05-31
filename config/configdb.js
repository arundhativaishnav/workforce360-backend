import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const conn = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_KEY)
    .then(() => {
        console.log("Connected to MongoDB");
    });
        
    } catch (error) {
        console.log(error);    
    }        
};
conn();
export default conn ;

import User from './Models/User.js'
import bcrypt from 'bcrypt'
import connectDB from './config/configdb.js'

const userRegister = async () =>{
    try {
        const Hashedpassword = await bcrypt.hash("admin1234",10)
        const newUser = new User({
            name : "admin",
            email: "admin@gmail.com",
            password: Hashedpassword,
            role:"admin"
        }) 
        await newUser.save();
        
    } catch (error) {
        console.log(error);
     }
}
userRegister();
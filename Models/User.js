import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{type : String , require : true },
    email :{type : String , require : true },
    password :{ type:String , required : true },
    role : {type:String , enum: ["admin", "Employee"] , required: true },
    profileImage : {type:String},
    createAt : {type: Date , default: Date.now },
    updatedAt : {type: Date , default: Date.now },
   
})
const User = mongoose.model("User" , userSchema)
export default User 
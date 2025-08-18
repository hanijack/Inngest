import mongoose, { Schema } from "mongoose";



const userScehma= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{type:String , required:true,unique:true},
    imageUrl:{type:String , required:true },
    cartItems:{type:Object , default:{}}
},{minimize:false})
const User=mongoose.models.user ||mongoose.model("user",userScehma)


export default User
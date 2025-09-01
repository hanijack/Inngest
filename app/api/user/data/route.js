import { connectDB } from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {
        const {userId} = getAuth(request);
        await connectDB()
        const user=await User.findById(userId);
        if(!user){
            return new NextResponse.JSON({error:"User not found", status:404 ,success:false})
        }
        return NextResponse.json({user ,status: 200 , success:true});
    } catch (error) {
                    return new NextResponse.JSON({error:error.message, status:404 ,success:false})
    }
}
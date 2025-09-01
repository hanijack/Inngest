import { connectDB } from "@/config/db";
import { inngest } from "@/config/inngest";
import Address from "@/models/Address";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {
    await connectDB();
    try {
        const { userId } = getAuth(request);
        const { address , items } = await request.json();
        if(!address || items.length ===0){
            return NextResponse.json({ success: false, error: "Address and items are required" });
        }
        const amount =await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.price * item.quantity
        }, 0);
        
        if(amount <=0){
            return NextResponse.json({ success: false, error: "Amount must be greater than zero" });
        }
        await inngest.send({
            name:"order/create",
            data:{
                userId,
                items,
                amount: amount + Math.floor(amount * 0.2) , 
                address,
                date:Date.now()
            }
        })

        const user = await User.findById(userId);
        user.cartItems = [];
        await user.save();
        return NextResponse.json({ success: true, message: "Order created successfully" });

    } catch (error) {
        NextResponse.json({ success: false, error: error.message });
    }
}
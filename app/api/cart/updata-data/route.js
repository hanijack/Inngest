import { connectDB } from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";










export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {cartData}= await request.json()
        await connectDB()

        const user = await User.findById(userId)
        user.cartItems = cartData
        await user.save()
        return NextResponse.json({success: true, message: "Cart updated successfully", status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message, success: false, status: 500})
    }
}
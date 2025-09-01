import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const IsSeller = await authSeller(userId);
    if (!IsSeller) {
      return new NextResponse.json({ success: false, message: "You are not authorized to view products" }, { status: 403 });
    }
    await connectDB();
    const products = await Product.find({  }).sort({ createdAt: -1 });
    
    return NextResponse.json({ products, status: 200, success: true });
  } catch (error) {
    return new NextResponse.json({ error: error.message, status: 404, success: false });
  }

    
}
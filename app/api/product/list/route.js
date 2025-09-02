import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {

    await connectDB();
    const products = await Product.find({  }).sort({ createdAt: -1 });
    
    return NextResponse.json({ products, status: 200, success: true });
  } catch (error) {
    return  NextResponse.json({ error: error.message, status: 404, success: false });
  }

    
}
import { connectDB } from "@/config/db";
import Address from "@/models/Address";
import { NextResponse } from "next/server";


export async function POST(request) {



    try {
        const { userId } = getAuth(request);
        const { address } = await request.json();
        await connectDB();
        const newAddress = await Address.create({ ...address, user: userId });
        return NextResponse.json({ success: true, newAddress , message: "Address added successfully" });

    } catch (error) {
        NextResponse.json({ success: false, error: error.message });
    }
}
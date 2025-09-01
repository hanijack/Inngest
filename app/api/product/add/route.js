import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { v2 } from "cloudinary";
import { NextResponse } from "next/server";

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function POST(request){
    try {
        const {userId} =getAuth(request)
        const IsSeller=await authSeller(userId)

        if(!IsSeller){
            return new NextResponse.json({success:false, error:"You are not authorized to add products"}, {status:403});
        }
        const formData = await request.formData();
        const productName = formData.get("productName");
        const productPrice = formData.get("productPrice");
        const productDescription = formData.get("productDescription");
        const productCategory = formData.get("productCategory");
        const productOfferPrice = formData.get("productOfferPrice");
        const productImages = formData.getAll("productImages");

        if(productImages.length === 0){
            return new NextResponse.json({success:false, error:"Please upload at least one image"}, {status:400});
        }
        const result = await Promise.all(
            

            productImages.map(async (image) => {
                const arrayBuffer = await image.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {

                    const stream = v2.uploader.upload_stream(
                        {resource_type: "auto"},
                        (error, result) => {
                            if (error) {
                                reject(error);
                            }
                           else{
                                resolve(result);
                            }
                           }
                        
                    )
                    
                    stream.end(buffer);
                })
                
    })
    )
    const image=result.map(result => result.secure_url);
    await connectDB();
    const product = await Product.create({
        name: productName,
        price: Number(productPrice),
        description: productDescription,
        category: productCategory,
        offerPrice: Number(productOfferPrice),
        images: image,
        seller: userId,
        createdAt: Date.now(),
    })

    return NextResponse.json({product, success:true, status:201 , message:"Product added successfully"});
    } catch (error) {
        return new NextResponse.json({success:false, error:"Failed to add product"})
    }
}
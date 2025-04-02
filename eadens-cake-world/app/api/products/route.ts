import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where = category && category !== "all" ? { category: { equals: category } } : {}

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "An error occurred while fetching products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Get all fields from FormData
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const file = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !description || isNaN(price) || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = '/placeholder.svg';
    
    if (file && file.size > 0) { // Check if file was actually provided
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: "products",
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(buffer);
      }) as any;
      
      imageUrl = result.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        image: imageUrl,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}
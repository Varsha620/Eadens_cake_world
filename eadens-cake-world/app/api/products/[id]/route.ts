import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type')
    let data: any
    let file: File | null = null
    let currentImage: string | null = null

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category')
      }
      file = formData.get('image') as File | null
      currentImage = formData.get('currentImage') as string | null
    } else {
      data = await request.json()
    }

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let imageUrl = currentImage || '/placeholder.svg'

    // Handle file upload if new image was provided
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: "products",
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          },
          (error, result) => {
            if (error) reject(error)
            resolve(result)
          }
        ).end(buffer)
      }) as any
      
      imageUrl = result.secure_url
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name as string,
        description: data.description as string,
        price: parseFloat(data.price as string),
        category: data.category as string,
        image: imageUrl
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred while updating the product" },
      { status: 500 }
    )
  }
}
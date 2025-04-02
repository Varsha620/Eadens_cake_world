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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching the product" },
      { status: 500 }
    )
  }
}

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
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              folder: "products",
              upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
              resource_type: "auto"
            },
            (error, result) => {
              if (error) reject(error)
              resolve(result)
            }
          ).end(buffer)
        }) as any
        
        imageUrl = result.secure_url
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload product image" },
          { status: 500 }
        )
      }
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First get the product to check for associated image
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete image from Cloudinary if it's not the default placeholder
    if (product.image && !product.image.includes('/placeholder.svg')) {
      try {
        const publicId = product.image.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`)
        }
      } catch (cloudinaryError) {
        console.error("Error deleting Cloudinary asset:", cloudinaryError)
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from database
    await prisma.product.delete({
      where: { id: params.id }
    })

    return new Response(null, { status: 204 }) // 204 No Content
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred while deleting the product" },
      { status: 500 }
    )
  }
}
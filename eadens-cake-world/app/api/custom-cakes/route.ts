import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    const data = await request.json()

    // Calculate price based on options
    let price = 35.99 // Base price in ₹
    if (data.size === "10 inch") price += 10
    else if (data.size === "12 inch") price += 15
    else if (data.size === "Tiered (2 layers)") price += 25
    else if (data.size === "Tiered (3 layers)") price += 40
    if (["Red Velvet", "Carrot"].includes(data.flavor)) price += 5
    if (["Chocolate Ganache", "Caramel"].includes(data.filling)) price += 3
    if (data.frosting === "Fondant") price += 8

    // Add price for premium decorations
    if (["Fresh Fruit", "Macarons", "Edible Flowers"].includes(data.decoration)) price += 7

    const customCake = await prisma.customCake.create({
      data: {
        userId: user?.userId,
        flavor: data.flavor,
        filling: data.filling,
        frosting: data.frosting,
        decoration: data.decoration,
        shape: data.shape,
        size: data.size,
        color: data.color,
        message: data.message,
        specialInstructions: data.specialInstructions,
        generatedImage: data.generatedImage,
        price,
      },
    })

    return NextResponse.json({ customCake, price })
  } catch (error) {
    console.error("Error creating custom cake:", error)
    return NextResponse.json({ error: "An error occurred while creating the custom cake" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "An error occurred while fetching reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to submit a review" }, { status: 401 })
    }

    const { rating, comment } = await request.json()

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        rating,
        comment,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "An error occurred while creating the review" }, { status: 500 })
  }
}


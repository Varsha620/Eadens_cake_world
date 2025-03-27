import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser, requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      where.scheduledDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "An error occurred while fetching orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 })
    }

    const data = await request.json()

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        deliveryMethod: data.deliveryMethod,
        address: data.address,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.type === "standard" ? item.id : null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
            customOptions: item.customOptions ? JSON.stringify(item.customOptions) : null,
            image: item.image,
          })),
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "An error occurred while creating the order" }, { status: 500 })
  }
}


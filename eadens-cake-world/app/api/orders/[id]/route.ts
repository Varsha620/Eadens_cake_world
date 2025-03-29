import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser, requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Only allow admins or the order owner to view the order
    if (user.role !== "ADMIN" && order.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "An error occurred while fetching the order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const data = await request.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: data.status,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order. Please try again later." }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status) {
      where.status = status
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
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders. Please try again later." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to place an order" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
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
            customOptions: item.customOptions,
            image: item.image,
          })),
        },
      },
    });

    return NextResponse.json(
      { success: true, order }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order. Please try again later." },
      { status: 500 }
    );
  }
}
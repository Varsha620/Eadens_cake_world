"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  type: string
  customOptions?: string
  image?: string
}

type Order = {
  id: string
  status: string
  deliveryMethod: string
  address?: string
  subtotal: number
  deliveryFee: number
  total: number
  items: OrderItem[]
  createdAt: string
  scheduledDate?: string
}

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/user")

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <p>Loading your orders...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Orders</h2>

      <Accordion type="single" collapsible className="w-full">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={order.id}>
            <AccordionTrigger className="px-4">
              <div className="flex w-full flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-medium">Order #{order.id.slice(-6)}</span>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4 grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Delivery Method:</span>
                      <span className="text-sm">
                        {order.deliveryMethod === "DELIVERY" ? "Home Delivery" : "Takeaway"}
                      </span>
                    </div>

                    {order.address && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Delivery Address:</span>
                        <span className="text-sm">{order.address}</span>
                      </div>
                    )}

                    {order.scheduledDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Scheduled Date:</span>
                        <span className="text-sm">{new Date(order.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="mb-2 font-medium">Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between border-b pb-2">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {item.type === "custom" ? "Custom Cake" : "Standard Cake"}
                          </p>
                          {item.customOptions && (
                            <p className="text-xs text-muted-foreground">
                              {JSON.parse(item.customOptions)
                                .filter(([key, value]) => value && key !== "specialInstructions")
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                          <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}


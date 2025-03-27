"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, X } from "lucide-react"

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
  user: {
    id: string
    name: string
    email: string
  }
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED"
  deliveryMethod: "DELIVERY" | "TAKEAWAY"
  address?: string
  subtotal: number
  deliveryFee: number
  total: number
  items: OrderItem[]
  createdAt: string
  scheduledDate?: string
}

export default function OrdersTable({ status }: { status: "PENDING" | "APPROVED" | "COMPLETED" }) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?status=${status}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [status])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve order")
      }

      toast({
        title: "Order Approved",
        description: `Order ${id.slice(-6)} has been approved.`,
      })

      fetchOrders()
    } catch (error) {
      console.error("Error approving order:", error)
      toast({
        title: "Error",
        description: "Failed to approve order",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject order")
      }

      toast({
        title: "Order Rejected",
        description: `Order ${id.slice(-6)} has been rejected.`,
        variant: "destructive",
      })

      fetchOrders()
    } catch (error) {
      console.error("Error rejecting order:", error)
      toast({
        title: "Error",
        description: "Failed to reject order",
        variant: "destructive",
      })
    }
  }

  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "COMPLETED" }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete order")
      }

      toast({
        title: "Order Completed",
        description: `Order ${id.slice(-6)} has been marked as completed.`,
      })

      fetchOrders()
    } catch (error) {
      console.error("Error completing order:", error)
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <p className="text-center">Loading orders...</p>
  }

  if (orders.length === 0) {
    return <p className="text-center text-muted-foreground">No {status.toLowerCase()} orders found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left font-medium">Order ID</th>
            <th className="px-4 py-2 text-left font-medium">Customer</th>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Items</th>
            <th className="px-4 py-2 text-left font-medium">Total</th>
            <th className="px-4 py-2 text-left font-medium">Delivery</th>
            <th className="px-4 py-2 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="px-4 py-2">#{order.id.slice(-6)}</td>
              <td className="px-4 py-2">{order.user.name || order.user.email}</td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <ul className="list-inside list-disc">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2">${order.total.toFixed(2)}</td>
              <td className="px-4 py-2">
                <Badge variant={order.deliveryMethod === "DELIVERY" ? "secondary" : "outline"}>
                  {order.deliveryMethod === "DELIVERY" ? "Delivery" : "Takeaway"}
                </Badge>
                {order.address && <p className="mt-1 text-xs text-muted-foreground">{order.address}</p>}
              </td>
              <td className="px-4 py-2">
                {status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleApprove(order.id)}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleReject(order.id)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
                {status === "APPROVED" && (
                  <Button size="sm" variant="outline" onClick={() => handleComplete(order.id)}>
                    Mark Completed
                  </Button>
                )}
                {status === "COMPLETED" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Completed
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, X, RefreshCw } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMounted = useRef(true)

  const fetchOrders = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders?status=${status}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let errorMessage = "Failed to fetch orders"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          console.error("Response is not valid JSON")
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch orders")
      }

      setOrders(data.data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error instanceof Error ? error.message : "Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchOrders()

    let interval: NodeJS.Timeout | null = null
    if (status === "PENDING") {
      interval = setInterval(fetchOrders, 30000)
    }

    return () => {
      isMounted.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [status, retryCount])

  const handleApprove = async (id: string) => {
    setApprovingId(id)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to approve order")
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
        description: error instanceof Error ? error.message : "Failed to approve order",
        variant: "destructive",
      })
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setRejectingId(id)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reject order")
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
        description: error instanceof Error ? error.message : "Failed to reject order",
        variant: "destructive",
      })
    } finally {
      setRejectingId(null)
    }
  }

  const handleComplete = async (id: string) => {
    setCompletingId(id)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "COMPLETED" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to complete order")
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
        description: error instanceof Error ? error.message : "Failed to complete order",
        variant: "destructive",
      })
    } finally {
      setCompletingId(null)
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4 gap-2"
          onClick={() => {
            setRetryCount(0)
            fetchOrders()
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No {status.toLowerCase()} orders found.</p>
        <Button variant="outline" className="mt-4 gap-2" onClick={() => fetchOrders()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    )
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
                    <li key={index} className="text-sm">{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2">₹{order.total.toFixed(2)}</td>
              <td className="px-4 py-2">
                <Badge variant={order.deliveryMethod === "DELIVERY" ? "secondary" : "outline"}>
                  {order.deliveryMethod === "DELIVERY" ? "Delivery" : "Takeaway"}
                </Badge>
                {order.address && <p className="mt-1 text-xs text-muted-foreground">{order.address}</p>}
              </td>
              <td className="px-4 py-2">
                {status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleApprove(order.id)}
                      disabled={approvingId === order.id}
                    >
                      {approvingId === order.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReject(order.id)}
                      disabled={rejectingId === order.id}
                    >
                      {rejectingId === order.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                )}
                {status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleComplete(order.id)}
                    disabled={completingId === order.id}
                  >
                    {completingId === order.id ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
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
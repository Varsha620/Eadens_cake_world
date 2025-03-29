"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"

export default function CartContent() {
  const { cartItems, updateQuantity, removeFromCart, submitOrder } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [address, setAddress] = useState(user?.address || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = deliveryMethod === "delivery" ? 5.99 : 0
  const total = subtotal + deliveryFee

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)

    const success = await submitOrder(deliveryMethod, deliveryMethod === "delivery" ? address : undefined)

    if (success) {
      router.push("/account/orders")
    }

    setIsSubmitting(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted" />
        <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Looks like you haven't added any cakes to your cart yet.</p>
        <Button asChild>
          <Link href="/shop">Browse Cakes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-[120px] w-full sm:h-auto sm:w-[120px]">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p> {/* Changed $ to ₹ */}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.type === "custom" ? "Custom Cake" : "Standard Cake"}
                  </p>
                  {item.customOptions && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(item.customOptions)
                          .filter(([key, value]) => value && key !== "specialInstructions")
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span> {/* Changed $ to ₹ */}
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span> {/* Changed $ to ₹ */}
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span> {/* Changed $ to ₹ */}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Delivery Method</h3>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Home Delivery (+₹5.99)</Label> {/* Changed $ to ₹ */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway">Takeaway (Free)</Label>
                  </div>
                </RadioGroup>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleSubmitOrder} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"

type Product = {
  id: string
  name: string
  price: number
  image: string
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simulate a delay for better UX
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: "standard",
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      setIsAdding(false)
    }, 500)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}


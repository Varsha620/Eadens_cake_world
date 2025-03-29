"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: "standard" | "custom"
  customOptions?: Record<string, string>
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  submitOrder: (deliveryMethod: string, address?: string) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.type === item.type &&
          JSON.stringify(cartItem.customOptions) === JSON.stringify(item.customOptions),
      )

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const submitOrder = async (deliveryMethod: string, address?: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      router.push("/login");
      return false;
    }
  
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return false;
    }
  
    if (deliveryMethod === "delivery" && !address) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return false;
    }
  
    try {
      const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const deliveryFee = deliveryMethod === "delivery" ? 5.99 : 0;
      const total = subtotal + deliveryFee;
  
      const orderData = {
        deliveryMethod: deliveryMethod.toUpperCase(),
        address: address || null,
        subtotal,
        deliveryFee,
        total,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          image: item.image,
          customOptions: item.customOptions ? JSON.stringify(item.customOptions) : null
        })),
      };
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit order");
      }
  
      toast({
        title: "Order Submitted",
        description: `Your order of ₹${total.toFixed(2)} has been sent to the admin for approval`, // Changed $ to ₹
      });
      clearCart();
      return true;
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your order",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
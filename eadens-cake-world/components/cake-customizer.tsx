"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"

// Mock data for cake options
const cakeOptions = {
  flavors: ["Vanilla", "Chocolate", "Red Velvet", "Lemon", "Carrot", "Strawberry"],
  fillings: ["Buttercream", "Chocolate Ganache", "Cream Cheese", "Strawberry Jam", "Lemon Curd", "Caramel"],
  frostings: ["Buttercream", "Fondant", "Cream Cheese", "Whipped Cream", "Chocolate Ganache"],
  decorations: ["Sprinkles", "Fresh Fruit", "Chocolate Shavings", "Edible Flowers", "Macarons", "None"],
  shapes: ["Round", "Square", "Rectangle", "Heart", "Custom"],
  sizes: ["6 inch", "8 inch", "10 inch", "12 inch", "Tiered (2 layers)", "Tiered (3 layers)"],
  colors: ["White", "Pink", "Blue", "Yellow", "Green", "Purple", "Rainbow", "Custom"],
}

export default function CakeCustomizer() {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const [customCake, setCustomCake] = useState({
    flavor: "Vanilla",
    filling: "Buttercream",
    frosting: "Buttercream",
    decoration: "Sprinkles",
    shape: "Round",
    size: "8 inch",
    color: "White",
    message: "",
    specialInstructions: "",
  })

  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [price, setPrice] = useState(35.99)

  const handleChange = (field: string, value: string) => {
    setCustomCake((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      // Save custom cake to database
      const response = await fetch("/api/custom-cakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...customCake,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save custom cake")
      }

      const data = await response.json()

      // Add to cart
      addToCart({
        id: `custom-${Date.now()}`,
        name: "Custom Cake",
        price: data.price,
        image: "/placeholder-cake.svg",
        type: "custom",
        customOptions: customCake,
      })

      toast({
        title: "Added to cart",
        description: "Your custom cake has been added to your cart!",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Failed to Add to Cart",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const calculatePrice = () => {
    let calculatedPrice = 350.99 // Base price
    if (customCake.size === "10 inch") calculatedPrice += 10
    else if (customCake.size === "12 inch") calculatedPrice += 15
    else if (customCake.size === "Tiered (2 layers)") calculatedPrice += 25
    else if (customCake.size === "Tiered (3 layers)") calculatedPrice += 40
    if (["Red Velvet", "Carrot"].includes(customCake.flavor)) calculatedPrice += 5
    if (["Chocolate Ganache", "Caramel"].includes(customCake.filling)) calculatedPrice += 3
    if (customCake.frosting === "Fondant") calculatedPrice += 8
    if (["Fresh Fruit", "Macarons", "Edible Flowers"].includes(customCake.decoration)) calculatedPrice += 7

    setPrice(calculatedPrice)
    return calculatedPrice
  }

  // Recalculate price when options change
  useEffect(() => {
    calculatePrice()
  }, [customCake])

  return (
    <div className="grid gap-8">
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="basics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="flavor">Cake Flavor</Label>
                <Select value={customCake.flavor} onValueChange={(value) => handleChange("flavor", value)}>
                  <SelectTrigger id="flavor">
                    <SelectValue placeholder="Select flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.flavors.map((flavor) => (
                      <SelectItem key={flavor} value={flavor}>
                        {flavor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filling">Filling</Label>
                <Select value={customCake.filling} onValueChange={(value) => handleChange("filling", value)}>
                  <SelectTrigger id="filling">
                    <SelectValue placeholder="Select filling" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.fillings.map((filling) => (
                      <SelectItem key={filling} value={filling}>
                        {filling}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frosting">Frosting</Label>
                <Select value={customCake.frosting} onValueChange={(value) => handleChange("frosting", value)}>
                  <SelectTrigger id="frosting">
                    <SelectValue placeholder="Select frosting" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.frostings.map((frosting) => (
                      <SelectItem key={frosting} value={frosting}>
                        {frosting}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select value={customCake.size} onValueChange={(value) => handleChange("size", value)}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <Select value={customCake.shape} onValueChange={(value) => handleChange("shape", value)}>
                  <SelectTrigger id="shape">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.shapes.map((shape) => (
                      <SelectItem key={shape} value={shape}>
                        {shape}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={customCake.color} onValueChange={(value) => handleChange("color", value)}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decoration">Decoration</Label>
                <Select value={customCake.decoration} onValueChange={(value) => handleChange("decoration", value)}>
                  <SelectTrigger id="decoration">
                    <SelectValue placeholder="Select decoration" />
                  </SelectTrigger>
                  <SelectContent>
                    {cakeOptions.decorations.map((decoration) => (
                      <SelectItem key={decoration} value={decoration}>
                        {decoration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="extras" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">Cake Message</Label>
                <Input
                  id="message"
                  placeholder="Happy Birthday, John!"
                  value={customCake.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Message to be written on the cake (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requests or dietary requirements..."
                  value={customCake.specialInstructions}
                  onChange={(e) => handleChange("specialInstructions", e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="w-full text-center">
              <p className="text-lg font-bold">Estimated Price: ₹{price.toFixed(2)}</p> {/* Changed $ to ₹ */}
              <p className="text-sm text-muted-foreground">
                Final price may vary based on complexity and additional customizations
              </p>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              disabled={isAddingToCart} 
              size="lg" 
              className="w-full max-w-xs gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
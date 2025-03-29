import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AddToCartButton from "@/components/add-to-cart-button"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    notFound()
  }

  // Parse JSON strings
  const sizes = product.sizes ? JSON.parse(product.sizes) : []
  const ingredients = product.ingredients ? JSON.parse(product.ingredients) : []
  const allergens = product.allergens ? JSON.parse(product.allergens) : []

  return (
    <div className="container py-8 md:py-16">
      <Link href="/shop" className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
        </div>

        <div className="flex flex-col">
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          <p className="mb-4 text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</p> {/* Changed $ to ₹ */}
          <p className="mb-6 text-muted-foreground">{product.longDescription || product.description}</p>

          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <Button key={size} variant="outline" className="rounded-full">
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton product={product} />

          <div className="mt-8 grid gap-4">
            {ingredients.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">Ingredients</h3>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {ingredients.map((ingredient: string) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {allergens.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen: string) => (
                      <span key={allergen} className="rounded-full bg-muted px-3 py-1 text-xs">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


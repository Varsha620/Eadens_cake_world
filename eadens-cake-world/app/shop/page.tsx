import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category || "all"

  const where = category && category !== "all" ? { category: { equals: category } } : {}

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  })

  return (
    <div className="container py-8 md:py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary md:text-4xl">Our Cakes</h1>
        <p className="text-muted-foreground">Browse our selection of delicious cakes for any occasion</p>
      </div>

      {/* Filter options */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/shop">
          <Button variant={category === "all" || !category ? "secondary" : "outline"} className="rounded-full">
            All
          </Button>
        </Link>
        <Link href="/shop?category=chocolate">
          <Button variant={category === "chocolate" ? "secondary" : "outline"} className="rounded-full">
            Chocolate
          </Button>
        </Link>
        <Link href="/shop?category=vanilla">
          <Button variant={category === "vanilla" ? "secondary" : "outline"} className="rounded-full">
            Vanilla
          </Button>
        </Link>
        <Link href="/shop?category=fruit">
          <Button variant={category === "fruit" ? "secondary" : "outline"} className="rounded-full">
            Fruit
          </Button>
        </Link>
        <Link href="/shop?category=specialty">
          <Button variant={category === "specialty" ? "secondary" : "outline"} className="rounded-full">
            Specialty
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="cake-card overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="mt-2 text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p> {/* Changed $ to ₹ */}
            </CardContent>
            <CardFooter className="p-4">
              <Button asChild className="w-full">
                <Link href={`/shop/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}


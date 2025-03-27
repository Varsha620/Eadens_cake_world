import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Cake, Gift, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Carousel from "@/components/carousel"

const carouselImages = [
  {
    src: "/placeholder.svg?height=500&width=1200",
    alt: "Delicious birthday cake with colorful decorations",
  },
  {
    src: "/placeholder.svg?height=500&width=1200",
    alt: "Wedding cake with elegant white frosting",
  },
]

const featuredCakes = [
  {
    id: "1",
    name: "Chocolate Delight",
    description: "Rich chocolate cake with ganache frosting",
    price: 35.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "Vanilla Dream",
    description: "Light vanilla cake with buttercream frosting",
    price: 32.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Strawberry Bliss",
    description: "Fresh strawberry cake with cream cheese frosting",
    price: 38.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Red Velvet",
    description: "Classic red velvet cake with cream cheese frosting",
    price: 36.99,
    image: "/placeholder.svg?height=300&width=300",
  },
]

const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    comment: "The birthday cake for my daughter was absolutely perfect! Everyone loved it.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Michael Brown",
    comment: "Our wedding cake was not only beautiful but delicious too. Thank you!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Emily Davis",
    comment: "The custom cake design exceeded my expectations. Will definitely order again!",
    rating: 4,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <Carousel images={carouselImages} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">Eadens Cake World</h1>
          <p className="mb-6 max-w-md text-lg md:text-xl">Delicious custom cakes for all your special occasions</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/customize">Customize Your Cake</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Cake className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Fresh Ingredients</h3>
            <p className="text-muted-foreground">
              We use only the freshest and highest quality ingredients in all our cakes.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Custom Designs</h3>
            <p className="text-muted-foreground">Create your perfect cake with our customization options.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
            <p className="text-muted-foreground">We deliver your cakes fresh and on time for your special occasion.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">5-Star Quality</h3>
            <p className="text-muted-foreground">Our cakes are loved by customers for their taste and presentation.</p>
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="bg-light">
        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">About Eadens Cake World</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                At Eadens Cake World, we believe that every celebration deserves a perfect cake. Our passion for baking
                and dedication to quality has made us a trusted name for custom cakes for all occasions.
              </p>
              <Button asChild variant="secondary" className="w-fit">
                <Link href="/about" className="flex items-center gap-2">
                  Learn Morere <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Eadens Cake World bakery"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="container">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-primary md:text-4xl">Featured Cakes</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our most popular cake designs loved by our customers
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {featuredCakes.map((cake) => (
            <Link
              href={`/shop/${cake.id}`}
              key={cake.id}
              className="cake-card group rounded-lg border p-4 transition-all"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-md">
                <Image
                  src={cake.image || "/placeholder.svg"}
                  alt={cake.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mb-1 text-lg font-semibold">{cake.name}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{cake.description}</p>
              <p className="text-lg font-bold text-primary">${cake.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/shop" className="flex items-center gap-2">
              View All Cakes <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Customize Preview */}
      <section className="bg-accent text-accent-foreground">
        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Custom cake design"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Create Your Dream Cake</h2>
              <p className="mb-6 text-lg">
                Design a cake that's uniquely yours with our easy-to-use customization tool. Choose flavors, fillings,
                decorations, and more!
              </p>
              <Button asChild className="w-fit bg-light text-light-foreground hover:bg-light/90">
                <Link href="/customize" className="flex items-center gap-2">
                  Start Designing <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-primary md:text-4xl">What Our Customers Say</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">Read reviews from our satisfied customers</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.comment}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/reviews" className="flex items-center gap-2">
              Read More Reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Order Your Perfect Cake?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Whether you're celebrating a birthday, wedding, or any special occasion, we're here to make it sweeter!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-light text-light-foreground hover:bg-light/90">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-light text-light hover:bg-primary-foreground/10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


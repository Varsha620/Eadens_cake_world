import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Cake, Gift, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Carousel from "@/components/carousel"

const carouselImages = [
  {
    src: "/static/slideshow1.jpg?height=500&width=1200",
    alt: "Delicious birthday cake with colorful decorations",
  },
  {
    src: "/static/slideshow2.jpg?height=500&width=1200",
    alt: "Wedding cake with elegant white frosting",
  },
]

const featuredCakes = [
  {
    id: "1",
    name: "Chocolate Delight",
    description: "Rich chocolate cake with ganache frosting",
    price: 600.00,
    image: "/static/choc.jpg?height=300&width=300",
  },
  {
    id: "2",
    name: "Vanilla Dream",
    description: "Light vanilla cake with buttercream frosting",
    price: 600.00,
    image: "/static/vanilladr.jpg?height=300&width=300",
  },
  {
    id: "3",
    name: "Strawberry Bliss",
    description: "Fresh strawberry cake with cream cheese frosting",
    price: 500.00,
    image: "/static/strawberry.jpg?height=300&width=300",
  },
  {
    id: "4",
    name: "Red Velvet",
    description: "Classic red velvet cake with cream cheese frosting",
    price: 800.00,
    image: "/static/redv.jpg?height=300&width=300",
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
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        <Carousel images={carouselImages} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#4E0714]/80 to-transparent p-4 text-center text-white">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              Eadens Cake World
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl animate-slide-up animation-delay-100">
              Delicious custom cakes for all your special occasions
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up animation-delay-200">
              <Button asChild size="lg" className="btn-transition bg-[#4E0714] hover:bg-[#781727] px-8 py-6 text-lg">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="btn-transition bg-white/10 text-white hover:bg-white/20 border-white px-8 py-6 text-lg"
              >
                <Link href="/customize">Customize Your Cake</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-6 animate-fade-in">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Cake className="h-10 w-10 text-[#4E0714]" />,
              title: "Fresh Ingredients",
              description: "We use only the freshest and highest quality ingredients in all our cakes."
            },
            {
              icon: <Gift className="h-10 w-10 text-[#4E0714]" />,
              title: "Custom Designs",
              description: "Create your perfect cake with our customization options."
            },
            {
              icon: <Truck className="h-10 w-10 text-[#4E0714]" />,
              title: "Fast Delivery",
              description: "We deliver your cakes fresh and on time for your special occasion."
            },
            {
              icon: <Star className="h-10 w-10 text-[#4E0714]" />,
              title: "5-Star Quality",
              description: "Our cakes are loved by customers for their taste and presentation."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center animate-pop-in p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className="mb-6 rounded-full bg-[#E2B3C2]/50 p-5 backdrop-blur-sm">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#4E0714]">{feature.title}</h3>
              <p className="text-[#781727]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Preview */}
      <section className="bg-[#E2B3C2]/20 backdrop-blur-sm">
        <div className="container px-6 py-16">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-3xl font-bold text-[#4E0714] md:text-4xl lg:text-5xl">About Eadens Cake World</h2>
              <p className="text-lg text-[#781727]">
                At Eadens Cake World, we believe that every celebration deserves a perfect cake. Our passion for baking
                and dedication to quality has made us a trusted name for custom cakes for all occasions.
              </p>
              <Button asChild variant="secondary" className="w-fit btn-transition bg-[#AC5867] hover:bg-[#781727] px-8 py-6 text-lg">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[350px] overflow-hidden rounded-xl shadow-lg md:h-[450px] animate-pop-in">
              <Image
                src="/static/abt-us.jpg?height=450&width=800"
                alt="Eadens Cake World bakery"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="container px-6 animate-fade-in">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-[#4E0714] md:text-4xl">Featured Cakes</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#781727]">
            Explore our most popular cake designs loved by our customers
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCakes.map((cake) => (
            <Link
              href={`/shop/${cake.id}`}
              key={cake.id}
              className="cake-card group overflow-hidden rounded-xl border border-[#AC5867]/20 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={cake.image || "/static/15.jpg"}
                  alt={cake.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-[#4E0714]">{cake.name}</h3>
                <p className="mb-4 text-[#781727]">{cake.description}</p>
                <p className="text-xl font-bold text-[#AC5867]">₹{cake.price.toFixed(2)}</p> {/* Changed $ to ₹ */}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="secondary" className="btn-transition bg-[#AC5867] hover:bg-[#781727] px-8 py-6 text-lg">
            <Link href="/shop" className="flex items-center gap-2">
              View All Cakes <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Customize Preview */}
      <section className="bg-[#781727] text-[#EFD4C4]">
        <div className="container px-6 py-16">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="relative h-[350px] overflow-hidden rounded-xl shadow-lg md:h-[450px] animate-slide-up">
              <Image
                src="/static/4.jpg?height=450&width=800"
                alt="Custom cake design"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6 animate-slide-up animation-delay-100">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">Create Your Dream Cake</h2>
              <p className="text-lg">
                Design a cake that's uniquely yours with our easy-to-use customization tool. Choose flavors, fillings,
                decorations, and more!
              </p>
              <Button asChild className="w-fit btn-transition bg-[#EFD4C4] text-[#4E0714] hover:bg-[#E2B3C2] px-8 py-6 text-lg">
                <Link href="/customize" className="flex items-center gap-2">
                  Start Designing <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-6 animate-fade-in">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-[#4E0714] md:text-4xl">What Our Customers Say</h2>
          <p className="mx-auto max-w-2xl text-lg text-[#781727]">Read reviews from our satisfied customers</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="rounded-xl border border-[#AC5867]/20 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#AC5867]/30">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4E0714]">{testimonial.name}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "fill-[#AC5867] text-[#AC5867]" : "text-[#E2B3C2]"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#781727] italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" className="btn-transition border-[#AC5867] text-[#4E0714] hover:bg-[#E2B3C2]/20 px-8 py-6 text-lg">
            <Link href="/reviews" className="flex items-center gap-2">
              Read More Reviews <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#4E0714] text-[#EFD4C4]">
        <div className="container px-6 py-20 text-center animate-fade-in">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">Ready to Order Your Perfect Cake?</h2>
            <p className="text-xl">
              Whether you're celebrating a birthday, wedding, or any special occasion, we're here to make it sweeter!
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="btn-transition bg-[#EFD4C4] text-[#4E0714] hover:bg-[#E2B3C2] px-8 py-6 text-lg">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="btn-transition border-[#781727] text-[#EFD4C4] hover:bg-[#781727] px-8 py-6 text-lg"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
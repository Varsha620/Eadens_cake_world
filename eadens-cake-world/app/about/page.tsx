import Image from "next/image"
import { Cake, Clock, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-16">
      {/* Hero Section */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-3xl font-bold text-primary md:text-5xl">About Us</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              At Eadens Cake World, we believe that every celebration deserves a perfect cake. Our passion for baking
              and dedication to quality has made us a trusted name for custom cakes for all occasions.
            </p>
            <p className="text-muted-foreground">
              Founded in 2010, we've been creating delicious memories for our customers for over a decade. Our team of
              skilled bakers and decorators put their heart into every creation, ensuring that each cake not only looks
              amazing but tastes incredible too.
            </p>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[500px]">
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Eadens Cake World team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-light">
        <div className="container py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary md:text-4xl">Our Values</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <Cake className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality</h3>
              <p className="text-muted-foreground">
                We use only the finest ingredients to ensure every cake tastes as good as it looks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Passion</h3>
              <p className="text-muted-foreground">Our love for baking shines through in every cake we create.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer Focus</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority, and we strive to exceed your expectations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Timeliness</h3>
              <p className="text-muted-foreground">
                We understand the importance of your special day and ensure on-time delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary md:text-4xl">Our Story</h2>
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[500px]">
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Eadens Cake World bakery"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-2xl font-semibold">How It All Began</h3>
            <p className="mb-4 text-muted-foreground">
              Eadens Cake World started as a small home bakery by Eden Thompson, who had a passion for creating
              beautiful and delicious cakes. What began as baking for family and friends quickly grew into a beloved
              local business.
            </p>
            <p className="mb-4 text-muted-foreground">
              Eden's commitment to quality and creativity caught the attention of the community, and soon the demand for
              her cakes outgrew her home kitchen. In 2010, Eadens Cake World opened its first storefront.
            </p>
            <p className="text-muted-foreground">
              Today, we've grown into a team of talented bakers and decorators who share Eden's passion and vision.
              While we've expanded, our core values remain the same: to create beautiful, delicious cakes that bring joy
              to every celebration.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-muted">
        <div className="container py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary md:text-4xl">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: "Eden Thompson",
                role: "Founder & Head Baker",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Eden's passion for baking started in her grandmother's kitchen and has grown into a lifelong career.",
              },
              {
                name: "Michael Chen",
                role: "Executive Pastry Chef",
                image: "/placeholder.svg?height=300&width=300",
                bio: "With 15 years of experience, Michael brings creativity and precision to every cake design.",
              },
              {
                name: "Sophia Rodriguez",
                role: "Cake Decorator",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Sophia's artistic background gives her a unique perspective on cake decoration and design.",
              },
              {
                name: "James Wilson",
                role: "Customer Relations",
                image: "/placeholder.svg?height=300&width=300",
                bio: "James ensures that every customer's experience with Eadens Cake World is exceptional.",
              },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-2 text-sm font-medium text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


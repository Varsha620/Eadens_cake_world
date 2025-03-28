import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery | Eadens Cake World",
  description: "Browse our cake gallery for inspiration",
}

// Mock data for gallery images
const galleryImages = [
  {
    src: "/static/1.jpg?height=400&width=400",
    alt: "Birthday cake with colorful sprinkles",
    category: "Birthday",
  },
  {
    src: "/static/2.jpg?height=400&width=400",
    alt: "Elegant wedding cake with white frosting",
    category: "Wedding",
  },
  {
    src: "/static/3'.jpg?height=400&width=400",
    alt: "Anniversary cake with gold decorations",
    category: "Anniversary",
  },
  {
    src: "/static/4.jpg?height=400&width=400",
    alt: "Baby shower cake with pastel colors",
    category: "Baby Shower",
  },
  {
    src: "/static/5.jpg?height=400&width=400",
    alt: "Graduation cake with cap decoration",
    category: "Graduation",
  },
  {
    src: "/static/6.jpg?height=400&width=400",
    alt: "Christmas themed cake with festive decorations",
    category: "Holiday",
  },
  {
    src: "/static/7.jpg?height=400&width=400",
    alt: "Custom designed cake with unique shape",
    category: "Custom",
  },
  {
    src: "/static/8.jpg?height=400&width=400",
    alt: "Corporate event cake with logo",
    category: "Corporate",
  },
  {
    src: "/static/9.jpg?height=400&width=400",
    alt: "Valentine's day cake with heart decorations",
    category: "Holiday",
  },
  {
    src: "/static/10.jpg?height=400&width=400",
    alt: "Halloween themed cake with spooky decorations",
    category: "Holiday",
  },
  {
    src: "/static/13.jpg?height=400&width=400",
    alt: "Children's birthday cake with cartoon character",
    category: "Birthday",
  },
  {
    src: "/static/14.jpg?height=400&width=400",
    alt: "Engagement cake with ring decoration",
    category: "Engagement",
  },
]

export default function GalleryPage() {
  return (
    <div className="container py-8 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-primary md:text-4xl">Cake Gallery</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Browse our collection of custom cakes for inspiration. Each cake is handcrafted with love and attention to
          detail.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">All</button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">
          Birthday
        </button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">
          Wedding
        </button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">
          Anniversary
        </button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">
          Holiday
        </button>
        <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground">
          Custom
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {galleryImages.map((image, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-center text-white">{image.alt}</p>
              <span className="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {image.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


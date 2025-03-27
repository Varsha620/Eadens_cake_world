import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: Date
  user: {
    id: string
    name: string | null
  }
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No reviews yet. Be the first to leave a review!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Image
                src="/placeholder.svg?height=60&width=60"
                alt={review.user.name || "User"}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{review.user.name || "Anonymous"}</h3>
                  <time className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <div className="mb-2 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


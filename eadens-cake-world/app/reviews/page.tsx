import type { Metadata } from "next"
import ReviewsList from "@/components/reviews-list"
import ReviewForm from "@/components/review-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Reviews | Eadens Cake World",
  description: "Read what our customers have to say about their experiences with Eadens Cake World",
}

export const dynamic = "force-dynamic"

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container py-8 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-primary md:text-4xl">Customer Reviews</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Read what our customers have to say about their experiences with Eadens Cake World.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReviewsList reviews={reviews} />
        </div>

        <div>
          <ReviewForm />
        </div>
      </div>
    </div>
  )
}


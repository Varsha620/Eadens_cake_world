"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function ReviewForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment for your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your feedback!",
      })

      setComment("")
      setRating(5)
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" className="focus:outline-none" onClick={() => handleRatingChange(i + 1)}>
                  <Star className={`h-6 w-6 ${i < rating ? "fill-primary text-primary" : "text-muted"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with us"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>

          {!user && (
            <p className="text-center text-sm text-muted-foreground">You need to be logged in to submit a review</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}


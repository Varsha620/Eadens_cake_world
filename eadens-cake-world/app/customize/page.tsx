import type { Metadata } from "next"
import CakeCustomizer from "@/components/cake-customizer"

export const metadata: Metadata = {
  title: "Customize Your Cake | Eadens Cake World",
  description: "Create your perfect custom cake with our easy-to-use design tool",
}

export default function CustomizePage() {
  return (
    <div className="container py-8 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-primary md:text-4xl">Customize Your Cake</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Design your perfect cake by selecting flavors, fillings, frostings, and decorations.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <CakeCustomizer />
      </div>
    </div>
  )
}
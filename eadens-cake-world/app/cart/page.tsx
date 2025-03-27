import CartContent from "@/components/cart-content"

export const metadata = {
  title: "Shopping Cart | Eadens Cake World",
  description: "View and manage your cake orders",
}

export default function CartPage() {
  return (
    <div className="container py-8 md:py-16">
      <h1 className="mb-8 text-3xl font-bold text-primary md:text-4xl">Your Cart</h1>
      <CartContent />
    </div>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, Heart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"

export default function Navbar() {
  const pathname = usePathname()
  const { cartItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    { href: "/", label: "Home" }, // Updated Home route to point to About Us
    { href: "/shop", label: "Shop" },
    { href: "/customize", label: "Customize" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ]

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Image
                      src="/static/logo.png?height=60&width=120"
                      width={60}
                      height={60}
                      alt="Eadens Cake World Logo"
                    />
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        pathname === route.href ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/static/logo.png?height=60&width=120"
              width={120}
              height={60}
              alt="Eadens Cake World Logo"
              className="rounded-lg"
            />
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" aria-label="Favorites">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs" variant="secondary">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}


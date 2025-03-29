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
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/customize", label: "Customize" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ]

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Menu"
                className="hover:bg-rose-800 hover:text-white transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            {/* Mobile menu content */}
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image
                      src="/static/logo.png?height=60&width=120"
                      width={60}
                      height={60}
                      alt="Eadens Cake World Logo"
                    />
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:bg-rose-800 hover:text-white transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-lg font-medium transition-colors duration-200 hover:bg-rose-800 hover:text-white px-4 py-2 rounded-lg ${
                        pathname === route.href ? "bg-rose-800 text-white" : "text-muted-foreground"
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
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src="/static/logo.png?height=60&width=120"
              width={120}
              height={60}
              alt="Eadens Cake World Logo"
              className="rounded-lg"
            />
          </Link>
        </div>

        {/* Center - Desktop navigation */}
        <nav className="hidden md:flex md:gap-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors duration-200 hover:bg-rose-800 hover:text-white px-4 py-2 rounded-lg ${
                pathname === route.href ? "bg-rose-800 text-white" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Icons */}
        <div className="flex items-center gap-1">
          {/* Favorites */}
          <Link href="/favorites">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Favorites"
              className="hover:bg-rose-800 hover:text-white transition-colors duration-200"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart with improved badge */}
          <Link href="/cart" className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Cart"
              className="hover:bg-rose-800 hover:text-white transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-rose-600 text-white border-2 border-white shadow-sm"
                >
                  <span className="text-xs font-bold">{totalItems}</span>
                </Badge>
              )}
            </Button>
          </Link>

          {/* Account */}
          <Link href="/account">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Account"
              className="hover:bg-rose-800 hover:text-white transition-colors duration-200"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
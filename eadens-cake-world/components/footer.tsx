import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                width={40}
                height={40}
                alt="Eadens Cake World Logo"
                className="rounded-full bg-white"
              />
              <span className="text-xl font-bold">Eadens Cake World</span>
            </Link>
            <p className="mt-2 text-sm">
              Delicious custom cakes for all occasions. Made with love and the finest ingredients.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-accent">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/customize" className="transition-colors hover:text-accent">
                  Customize
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition-colors hover:text-accent">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2 text-sm">123 Bakery Street</p>
              <p className="mb-2 text-sm">Cakeville, CV 12345</p>
              <p className="mb-2 text-sm">Phone: (123) 456-7890</p>
              <p className="text-sm">Email: info@eadenscakeworld.com</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 transition-colors hover:text-accent" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 transition-colors hover:text-accent" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-6 w-6 transition-colors hover:text-accent" />
              </Link>
            </div>
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Subscribe to our newsletter</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-md border border-accent bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="submit"
                  className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-accent pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Eadens Cake World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


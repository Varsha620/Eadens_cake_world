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
              <p className="mb-2 text-sm">Kavumkandam</p>
              <p className="mb-2 text-sm">Kadanad, Kerala 686653</p>
              <p className="mb-2 text-sm">Phone: 099469 56878</p>
              <p className="text-sm">Email: info@eadenscakeworld.com</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-accent pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Eadens Cake World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


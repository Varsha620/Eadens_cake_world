import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 px-4 text-center md:grid-cols-4 md:px-8 md:text-left lg:px-12">
          {/* Logo and Description */}
          <div className="flex flex-col items-center gap-2 md:items-start md:pl-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/static/logo.png?height=60&width=150"
                width={60}
                height={150}
                alt="Eadens Cake World Logo"
                className="rounded-full bg-white"
              />
            </Link>
            <p className="mt-2 text-sm">
              Delicious custom cakes for all occasions. Made with love and the finest ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:pl-4">
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-accent">
                  Home
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

          {/* Contact Info */}
          <div className="md:pl-4">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2 text-sm">Kavumkandam</p>
              <p className="mb-2 text-sm">Kadanad, Kerala 686653</p>
              <p className="mb-2 text-sm">Phone: 099469 56878</p>
              <p className="text-sm">Email: info@eadenscakeworld.com</p>
            </address>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center gap-4 md:items-start md:pl-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="transition-colors hover:text-accent">
                <Instagram size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-accent">
                <Facebook size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-accent">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-accent pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Eadens Cake World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
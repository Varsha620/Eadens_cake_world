import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Check for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const payload = await verifyToken(token)

      if (!payload || payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Check for account routes
  if (request.nextUrl.pathname.startsWith("/account")) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const payload = await verifyToken(token)

      if (!payload) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}


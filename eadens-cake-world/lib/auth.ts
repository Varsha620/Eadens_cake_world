// lib/auth.ts
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import type { NextRequest } from "next/server"
import prisma from "./prisma"
import * as bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function createToken(userId: string, role: string) {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Updated session handling with proper async cookie access
export async function getSession() {
  const cookieStore = await cookies() // Must await
  const token = cookieStore.get("token")?.value

  if (!token) return null

  return await verifyToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  return {
    userId: session.userId as string,
    role: session.role as string,
  }
}

// Middleware functions
export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return {
    userId: payload.userId as string,
    role: payload.role as string,
  }
}

export async function requireAdmin(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth || auth.role !== "ADMIN") return null
  return auth
}
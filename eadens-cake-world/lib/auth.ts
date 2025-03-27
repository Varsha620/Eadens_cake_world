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
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return {
    userId: payload.userId as string,
    role: payload.role as string,
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      phone: true,
    },
  })

  return user
}

export async function requireAuth(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  return {
    userId: payload.userId as string,
    role: payload.role as string,
  }
}

export async function requireAdmin(request: NextRequest) {
  const session = await requireAuth(request)
  if (!session) return null

  if (session.role !== "ADMIN") {
    return null
  }

  return session
}


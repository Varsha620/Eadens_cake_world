import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  })

  return response
}


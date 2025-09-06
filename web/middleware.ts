import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const token = await getToken({ req })
  const url = req.nextUrl
  const protectedPaths = ["/will", "/vault", "/notary", "/compliance"]
  const needsAuth = protectedPaths.some(p => url.pathname.startsWith(p))
  if (needsAuth && !token) return NextResponse.redirect(new URL("/login", req.url))
  return NextResponse.next()
}

export const config = { matcher: ["/((?!_next|api|favicon|public).*)"] }

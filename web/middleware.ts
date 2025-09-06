import { getToken } from "next-auth/jwt"

export async function middleware(req) {
  const token = await getToken({ req })
  const url = req.nextUrl
  const protectedPaths = ["/will", "/vault", "/notary", "/compliance"]
  const needsAuth = protectedPaths.some(p => url.pathname.startsWith(p))
  if (needsAuth && !token) return Response.redirect(new URL("/login", req.url))
  return Response.next()
}

export const config = { matcher: ["/((?!_next|api|favicon|public).*)"] }

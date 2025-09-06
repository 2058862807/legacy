import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple auth guard middleware without NextAuth dependency.
// If you use NextAuth, you can replace this with next-auth/middleware.
export function middleware(req: NextRequest) {
  const protectedPaths = [
    '/dashboard',
    '/vault',
    '/will',
    '/notary',
    '/compliance'
  ]

  const { pathname } = req.nextUrl
  const needsAuth = protectedPaths.some(p => pathname === p || pathname.startsWith(`${p}/`))

  if (!needsAuth) return NextResponse.next()

  const hasSession =
    req.cookies.get('__Secure-next-auth.session-token') ||
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('auth_token')

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vault/:path*',
    '/will/:path*',
    '/notary/:path*',
    '/compliance/:path*'
  ]
}

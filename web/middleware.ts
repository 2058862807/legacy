import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // List of protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/will',
    '/will/personal',
    '/will/assets', 
    '/will/beneficiaries',
    '/will/executors',
    '/will/witnesses',
    '/will/pet-trust',
    '/vault',
    '/vault/upload',
    '/live-estate',
    '/live-estate/settings',
    '/compliance',
    '/compliance/status',
    '/notary'
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow the request to continue
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all routes except API routes, static files, and public assets
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo.svg|nextera-logo.png).*)' 
  ],
}
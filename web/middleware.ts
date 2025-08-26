import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isAuthed = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')
  const isDash = req.nextUrl.pathname.startsWith('/dashboard')
  if (isDash && !isAuthed) return NextResponse.redirect(new URL('/api/auth/signin', req.url))
  return NextResponse.next()
}

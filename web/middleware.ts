import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isAuthed(req: NextRequest) {
const a = req.cookies.get('next-auth.session-token')?.value
const b = req.cookies.get('__Secure-next-auth.session-token')?.value
return Boolean(a || b)
}

export function middleware(req: NextRequest) {
const url = req.nextUrl
if (url.pathname === '/') {
if (isAuthed(req)) {
return NextResponse.redirect(new URL('/dashboard', url))
}
}
return NextResponse.next()
}

export const config = {
matcher: ['/']
}

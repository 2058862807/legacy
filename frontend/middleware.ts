// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/will-builder", "/vault", "/heirs"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // NextAuth sets one of these cookies
  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  if (!token) {
    const url = new URL("/api/auth/signin", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Tell Next which routes are protected (Edge runtime by default)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/will-builder/:path*",
    "/vault/:path*",
    "/heirs/:path*",
  ],
};

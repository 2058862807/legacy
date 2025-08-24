// frontend/middleware.ts
export { default } from "next-auth/middleware";

// Protect these routes (add others as needed)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/will-builder/:path*",
    "/vault/:path*",
    "/heirs/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};

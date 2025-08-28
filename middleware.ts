export { auth as middleware } from '@/auth'
export const config = {
matcher: [
'/dashboard/:path*',
'/companion/:path*',
'/heirs/:path*',
'/blockchain/:path*',
'/safes/:path*',
'/vault/:path*',
'/compliance/:path*',
'/will-builder/:path*'
]
}

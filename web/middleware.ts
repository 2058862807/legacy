import { withAuth } from "next-auth/middleware"
export default withAuth({ pages: { signIn: "/login" } })
export const config = {
matcher: [
"/dashboard/:path*",
"/companion/:path*",
"/heirs/:path*",
"/blockchain/:path*",
"/safes/:path*",
"/vault/:path*",
"/compliance/:path*",
"/will-builder/:path*"
]
}

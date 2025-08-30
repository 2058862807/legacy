import { auth } from '@/auth'
 
export default auth((req) => {
  // Add any middleware logic here
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
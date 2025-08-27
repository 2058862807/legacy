export async function GET() {
const present = {
NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
NEXT_PUBLIC_BACKEND_URL: !!process.env.NEXT_PUBLIC_BACKEND_URL
}
return new Response(JSON.stringify(present), {
headers: { 'Content-Type': 'application/json' }
})
}

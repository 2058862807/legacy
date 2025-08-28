'use client'
import { signIn } from 'next-auth/react'
export default function LoginPage() {
return (
<main className="flex h-screen items-center justify-center">
<button onClick={() => signIn('google')} className="rounded bg-blue-600 px-4 py-2 text-white">
Sign in with Google
</button>
</main>
)
}

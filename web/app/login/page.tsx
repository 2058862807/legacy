'use client'
import { signIn } from "next-auth/react"
export default function Page() {
return (

<main style={{height:"100vh",display:"grid",placeItems:"center"}}> <button onClick={() => signIn("google")}>Sign in with Google</button> </main>

)
}

import { NextResponse } from "next/server"


export async function POST(req: Request) {
const body = await req.json().catch(() => ({}))
const sessionId = `sess_${Math.random().toString(36).slice(2, 10)}`
const url = `https://checkout.stripe.dev/test/${sessionId}`
return NextResponse.json({ id: sessionId, url, received: body })
}

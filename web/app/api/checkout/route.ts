import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { planId } = await req.json()
    const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const res = await fetch(`${base}/api/payments/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId })
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 })
  }
}

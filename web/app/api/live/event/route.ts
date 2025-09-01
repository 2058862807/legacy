export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'user_email is required' }, { status: 400 })
    }

    const body = await req.json()
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/live/event?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Live event backend error:', response.status, errorData)
      return NextResponse.json({ error: `Backend error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Live event API error:', error)
    return NextResponse.json({ error: 'Failed to record life event' }, { status: 500 })
  }
}
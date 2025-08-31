import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/bot/help?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Bot help API error:', error)
    return NextResponse.json({ 
      reply: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.',
      escalate: false 
    }, { status: 500 })
  }
}
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
    const response = await fetch(`${backendUrl}/api/bot/grief?user_email=${encodeURIComponent(userEmail)}`, {
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
    console.error('Bot grief API error:', error)
    return NextResponse.json({ 
      reply: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.\n\nIf you\'re in crisis, please reach out immediately:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency services: 911',
      escalate: true 
    }, { status: 500 })
  }
}
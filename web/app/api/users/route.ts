import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json()
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData }, { status: response.status })
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('User creation API error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
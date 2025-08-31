import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { user_email, ...petTrustData } = data
    
    if (!user_email) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    // Proxy to backend for pet trust storage
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/pet-trust/save?user_email=${encodeURIComponent(user_email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petTrustData)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData }, { status: response.status })
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Pet trust save error:', error)
    return NextResponse.json({ error: 'Failed to save pet trust' }, { status: 500 })
  }
}
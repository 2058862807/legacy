import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/health`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Backend unavailable' 
      }, { status: 503 })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Backend connection failed',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}

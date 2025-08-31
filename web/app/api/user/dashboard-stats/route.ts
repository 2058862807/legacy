import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/user/dashboard-stats?user_email=${encodeURIComponent(userEmail)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Backend API error:', response.status, errorData)
      return NextResponse.json({ error: `Backend error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}

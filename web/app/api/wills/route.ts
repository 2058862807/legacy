import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    // Verify the user_email matches the authenticated user
    if (userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden - can only access your own data' }, { status: 403 })
    }
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/wills?user_email=${encodeURIComponent(userEmail)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Wills list API error:', error)
    return NextResponse.json({ error: 'Failed to fetch wills' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    // Verify the user_email matches the authenticated user
    if (userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden - can only access your own data' }, { status: 403 })
    }
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/wills?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData }, { status: response.status })
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Will creation API error:', error)
    return NextResponse.json({ error: 'Failed to create will' }, { status: 500 })
  }
}
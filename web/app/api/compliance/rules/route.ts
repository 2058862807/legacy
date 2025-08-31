import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const state = req.nextUrl.searchParams.get('state') || 'CA'
    const docType = req.nextUrl.searchParams.get('doc_type') || 'will'
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/compliance/rules?state=${state}&doc_type=${docType}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Compliance rules backend error:', response.status, errorData)
      return NextResponse.json({ error: `Backend error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Compliance rules API error:', error)
    return NextResponse.json({ error: 'Failed to fetch compliance rules' }, { status: 500 })
  }
}
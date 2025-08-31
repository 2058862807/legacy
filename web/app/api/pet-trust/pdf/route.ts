import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const petTrustData = await req.json()
    const userEmail = req.nextUrl.searchParams.get('user_email')
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }
    
    // Proxy to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
    const response = await fetch(`${backendUrl}/api/pet-trust/pdf?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petTrustData),
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF generation failed' }, { status: response.status })
    }
    
    // Return the PDF blob
    const pdfBlob = await response.blob()
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Pet_Trust_Provisions.pdf"'
      }
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Generate ticket ID
    const ticketId = `NT${Date.now().toString().slice(-6)}`
    
    // In production, this would:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create support ticket in system
    // 4. Send confirmation email to user
    
    // For now, just log the support request
    console.log('Support Request:', {
      ticket_id: ticketId,
      ...data,
      created_at: new Date().toISOString()
    })
    
    return NextResponse.json({ 
      message: 'Support request submitted successfully',
      ticket_id: ticketId
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit support request' }, { status: 500 })
  }
}
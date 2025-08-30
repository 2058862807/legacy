import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const base = process.env.BACKEND_BASE_URL
    const res = await fetch(`${base}/api/user/dashboard-stats`, { cache: 'no-store' })
    if (!res.ok) throw new Error('bad')
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({
      compliance: { percent: 85, state: 'CA' },
      documents: [{ name: 'Will.pdf', status: 'Valid' }],
      recentActivity: [{ action: 'Document uploaded', details: 'Will_v3.pdf', timestamp: Date.now() - 7200000 }]
    })
  }
}

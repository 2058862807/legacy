import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      nextauth_url: process.env.NEXTAUTH_URL,
      has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
      has_google_client_id: !!process.env.GOOGLE_CLIENT_ID,
      has_google_client_secret: !!process.env.GOOGLE_CLIENT_SECRET,
      node_env: process.env.NODE_ENV,
      vercel_url: process.env.VERCEL_URL,
      host: process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'localhost:3000'
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8001'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const backendUrl = `${BACKEND_URL}/v1/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`API proxy error for ${backendUrl}:`, error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 502 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const backendUrl = `${BACKEND_URL}/v1/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const body = await request.json()
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`API proxy error for ${backendUrl}:`, error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 502 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const backendUrl = `${BACKEND_URL}/api/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const body = await request.json()
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`API proxy error for ${backendUrl}:`, error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 502 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)
  const queryString = url.searchParams.toString()
  const backendUrl = `${BACKEND_URL}/api/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`API proxy error for ${backendUrl}:`, error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 502 }
    )
  }
}
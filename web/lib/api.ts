const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Use Next.js API routes instead of direct backend calls
  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API ${response.status} ${response.statusText}: ${text}`)
  }

  return response.json() as Promise<T>
}

export { API_BASE }
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy"

interface ApiError extends Error {
  status?: number
  statusText?: string
}

async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
  
  try {
    const response = await fetch(`${API}${path}`, {
      ...opts,
      cache: "no-store" as RequestCache,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.text()
      } catch {
        errorData = response.statusText
      }
      
      const error: ApiError = new Error(
        `API ${response.status}: ${response.statusText}. ${errorData}`
      )
      error.status = response.status
      error.statusText = response.statusText
      throw error
    }

    return await response.json() as T
  } catch (error) {
    clearTimeout(timeoutId)
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timeout after 8000ms')
    }
    
    throw error
  }
}

// Convenience methods
export const apiClient = {
  get: <T>(path: string) => api<T>(path),
  post: <T>(path: string, data: any) => 
    api<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: any) => 
    api<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(path: string) => 
    api<T>(path, { method: 'DELETE' }),
}

export default api

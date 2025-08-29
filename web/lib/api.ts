const API = "/api/proxy"

interface ApiError extends Error {
  status?: number
}

export async function apiFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API}${path}`, {
      ...opts,
      cache: "no-store" as RequestCache,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers,
      },
    })

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
      throw error
    }

    return await response.json() as T
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown API error occurred')
  }
}

export default apiFetch

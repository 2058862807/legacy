export const API = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""

type Opts = { 
  method?: string, 
  headers?: Record<string,string>, 
  body?: any, 
  cache?: RequestCache 
}

export async function apiFetch<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const init: RequestInit = { 
    method: opts.method || "GET", 
    headers: { 
      "Content-Type": "application/json", 
      ...(opts.headers || {}) 
    }, 
    cache: opts.cache || "no-store" 
  }
  
  if (opts.body !== undefined) {
    init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body)
  }
  
  const r = await fetch(`${API}${path}`, init)
  
  if (!r.ok) {
    throw new Error(`API ${r.status}`)
  }
  
  return r.json() as Promise<T>
}
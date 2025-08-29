const API = "/api/proxy"

async function j<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API}${path}`, { 
    ...opts, 
    cache: "no-store" as RequestCache 
  })
  
  if (!r.ok) throw new Error(`API ${r.status}: ${r.statusText}`)
  
  return r.json() as Promise<T>
}

export default j

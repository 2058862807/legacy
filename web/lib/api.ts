export const API = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""


export type Options = {
method?: string
headers?: Record<string, string>
body?: any
cache?: RequestCache
}


export async function apiFetch<T = any>(path: string, opts: Options = {}): Promise<T> {
const init: RequestInit = {
method: opts.method || "GET",
headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
cache: opts.cache || "no-store"
}
if (opts.body !== undefined) {
init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body)
}


const res = await fetch(`${API}${path}`, init)
if (!res.ok) {
const text = await res.text()
throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
}
const data: T = await res.json()
return data
}

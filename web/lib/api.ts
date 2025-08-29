const API = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "/api/proxy"

function normalizeInit(opts: RequestInit = {}): RequestInit {
const headers = new Headers(opts.headers || {})
const init: RequestInit = {
method: opts.method || "GET",
headers,
cache: opts.cache || "no-store",
credentials: opts.credentials,
redirect: opts.redirect
}
if (opts.body !== undefined) {
const isString = typeof opts.body === "string"
if (!isString && !headers.has("Content-Type")) {
headers.set("Content-Type", "application/json")
}
init.body = isString ? opts.body : JSON.stringify(opts.body)
}
return init
}

export async function apiFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
const init = normalizeInit(opts)
const res = await fetch(${API}${path}, init)
if (!res.ok) {
const text = await res.text()
throw new Error(API ${res.status} ${res.statusText}: ${text})
}
return res.json() as Promise<T>
}

export const getHealth = () => apiFetch("/health")

export const getDashboardStats = () => apiFetch("/api/user/dashboard-stats")

export const createCheckout = (body: any) =>
apiFetch("/api/payments/create-checkout", {
method: "POST",
body
})

export const getPaymentStatus = (q?: string) =>
apiFetch(/api/payments/status${q ? ?${q} : ""})

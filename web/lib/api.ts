// @ts-nocheck
export const API = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? ""

export async function apiFetch(path, opts = {}) {
const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {})
const init = {
method: opts.method || "GET",
headers,
cache: opts.cache || "no-store"
}
if (opts.body !== undefined) {
init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body)
}
const res = await fetch(API + path, init)
if (!res.ok) {
let text = ""
try { text = await res.text() } catch {}
throw new Error("API " + res.status + " " + res.statusText + ": " + text)
}
return res.json()
}

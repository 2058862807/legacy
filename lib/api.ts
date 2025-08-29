{
  "compilerOptions": {
"target": "ES2020",
"lib": ["dom", "dom.iterable", "es2020"],
"allowJs": false,
"skipLibCheck": true,
"strict": true,
"noEmit": true,
"esModuleInterop": true,
"module": "esnext",
"moduleResolution": "bundler",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "preserve",
"baseUrl": ".",
"paths": {
"@/*": ["./*"]
}
},
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
"exclude": ["node_modules"]
}


// File: web/lib/api.ts
export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""


type ApiOptions = {
method?: "GET" | "POST" | "PUT" | "DELETE"
headers?: Record<string, string>
body?: any
cache?: RequestCache
next?: NextFetchRequestConfig
}


export async function apiFetch(path: string, opts: ApiOptions = {}) {
const url = `${BASE_URL}${path}`
const headers = { "Content-Type": "application/json", ...(opts.headers || {}) }
const init: RequestInit = {
method: opts.method || "GET",
headers,
cache: opts.cache || "no-store",
next: opts.next
}
if (opts.body !== undefined) init.body = JSON.stringify(opts.body)


const res = await fetch(url, init)
if (!res.ok) {
const text = await res.text()
throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
}
return res.json()
}

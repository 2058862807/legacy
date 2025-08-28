const API = "/api/proxy"

async function j(path: string, opts: RequestInit = {}) {
const r = await fetch(${API}${path}, { ...opts, cache: "no-store" })
if (!r.ok) throw new Error(${API} ${r.status})
return r.json()
}

export const getHealth = () => j("/health")

export const getDashboardStats = () => j("/api/user/dashboard-stats")

export const createCheckout = (body: unknown) =>
j("/api/payments/create-checkout", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify(body)
})

export const getPaymentStatus = (q?: string) =>
j(/api/payments/status${q ? ?${q} : ""})

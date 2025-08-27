const API = "/api/proxy"

async function j(path, opts = {}) {
const r = await fetch(${API}${path}, { ...opts, cache: "no-store" })
if (!r.ok) throw new Error(API ${r.status})
return r.json()
}

export const getHealth = () => j("/health")
export const getDashboardStats = () => j("/api/user/dashboard-stats")
export const createCheckout = body =>
j("/api/payments/create-checkout", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify(body)
})
export const getPaymentStatus = q =>
j(/api/payments/status${q ? ?${q} : ""})

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""
if (opts.body !== undefined) init.body = JSON.stringify(opts.body)


const res = await fetch(url, init)
if (!res.ok) {
const text = await res.text()
throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
}
return res.json()
}


// File: web/app/compliance/reports/page.tsx
import { apiFetch } from "@/lib/api"


export const dynamic = "force-dynamic"


export default async function ComplianceReportsPage() {
const reports = await getReports()
return (
<div className="p-6">
<h1 className="text-2xl font-semibold">Compliance Reports</h1>
<ul className="mt-4 space-y-2">
{reports.map((r: any) => (
<li key={r.id} className="border rounded p-3">
<div className="font-medium">{r.title}</div>
<div className="text-sm text-gray-500">{r.status}</div>
</li>
))}
</ul>
</div>
)
}


async function getReports() {
try {
return await apiFetch("/api/reports")
} catch (e) {
console.error("Failed to load reports", e)
return [] as any[]
}
}

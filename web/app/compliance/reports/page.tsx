import { apiFetch } from "@/lib/api"
export const dynamic = "force-dynamic"


export default async function ComplianceReportsPage() {
const reports = await apiFetch<any[]>("/api/reports")
return (
<div className="p-6">
<h1 className="text-2xl font-semibold">Compliance Reports</h1>
<ul className="mt-4 space-y-2">
{reports.map(r => (
<li key={r.id} className="border rounded p-3">
<div className="font-medium">{r.title}</div>
<div className="text-sm text-gray-500">{r.status}</div>
</li>
))}
</ul>
</div>
)
}


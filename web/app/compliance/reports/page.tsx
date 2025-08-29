import { apiFetch } from "@/lib/api"

export const dynamic = "force-dynamic"

type Report = {
  id: string
  title: string
  status: string
}

export default async function ComplianceReportsPage() {
  const reports = await getReports()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Compliance Reports</h1>
      <ul className="mt-4 space-y-2">
        {reports.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-500">{r.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function getReports(): Promise<Report[]> {
  try {
    return await apiFetch<Report[]>("/api/reports")
  } catch (e) {
    console.error("Failed to load reports", e)
    return []
  }
}

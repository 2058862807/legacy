export const dynamic = "force-dynamic"

type Report = { id: string; title: string; status: string }

export default async function ComplianceReportsPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""}/api/reports`, { 
      cache: "no-store" 
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch reports: ${res.status} ${res.statusText}`)
    }
    
    const reports = (await res.json()) as Report[]
    
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
  } catch (error) {
    console.error("Error fetching reports:", error)
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Compliance Reports</h1>
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <p>Error loading reports. Please try again later.</p>
        </div>
      </div>
    )
  }
}

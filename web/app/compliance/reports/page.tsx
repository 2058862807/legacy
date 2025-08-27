'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api'
import DashboardLayout from '@/components/Layout/DashboardLayout'

type Report = {
  id: string
  title: string
  created_at: string
  url?: string
}

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/compliance/reports`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setReports(Array.isArray(data) ? data : data.items || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Compliance Reports</h1>

        <div className="mb-3">
          <button onClick={load} disabled={loading} className="rounded bg-gray-800 px-3 py-2 text-white hover:bg-black">
            Refresh
          </button>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Link</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.title}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
            {!loading && reports.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-gray-500 text-center">
                  No reports
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </DashboardLayout>
  )
}

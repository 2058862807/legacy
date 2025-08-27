'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api'
import DashboardLayout from '@/components/Layout/DashboardLayout'

type NotaryRequest = {
  id: string
  document_name: string
  hash: string
  status: 'pending' | 'signed' | 'failed'
  created_at: string
  certificate_url?: string
}

export default function NotaryStatusPage() {
  const [list, setList] = useState<NotaryRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/notary/requests`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setList(Array.isArray(data) ? data : data.items || [])
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
        <h1 className="text-2xl font-bold mb-4">Notary Request Status</h1>

        <button
          onClick={load}
          disabled={loading}
          className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-black mb-4"
        >
          Refresh
        </button>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Hash</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.document_name}</td>
                <td className="p-2 max-w-[260px] truncate">{r.hash}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2">
                  {r.certificate_url ? (
                    <a href={r.certificate_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500 text-center">
                  No requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </DashboardLayout>
  )
}

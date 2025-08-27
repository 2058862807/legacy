'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api'
import DashboardLayout from '@/components/Layout/DashboardLayout'

type ComplianceStatus = {
  updated_at: string
  hipaa: { passed: boolean; issues: string[] }
  gdpr: { passed: boolean; issues: string[] }
  nist: { passed: boolean; issues: string[] }
}

function Badge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
    >
      {ok ? 'pass' : 'fail'}
    </span>
  )
}

function Issues({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <p className="text-gray-600">No issues</p>
  return (
    <ul className="mt-2 list-disc pl-5">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  )
}

export default function ComplianceStatusPage() {
  const [data, setData] = useState<ComplianceStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/compliance/status`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
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
        <h1 className="text-2xl font-bold mb-4">Compliance Status</h1>

        <div className="mb-3 flex items-center gap-3">
          <button onClick={load} disabled={loading} className="rounded bg-gray-800 px-3 py-2 text-white hover:bg-black">
            Refresh
          </button>
          {loading && <span>Working...</span>}
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {!data ? (
          <p className="text-gray-600">No data</p>
        ) : (
          <section className="grid gap-4">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">HIPAA <Badge ok={!!data.hipaa?.passed} /></h3>
              <Issues items={data.hipaa?.issues || []} />
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">GDPR <Badge ok={!!data.gdpr?.passed} /></h3>
              <Issues items={data.gdpr?.issues || []} />
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">NIST <Badge ok={!!data.nist?.passed} /></h3>
              <Issues items={data.nist?.issues || []} />
            </div>
            <p className="text-gray-600">Updated {new Date(data.updated_at).toLocaleString()}</p>
          </section>
        )}
      </main>
    </DashboardLayout>
  )
}

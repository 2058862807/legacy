'use client'

import { useEffect, useState } from 'react'
import { getComplianceStatus, ComplianceItem } from '@/lib/api'

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getComplianceStatus()
      setItems(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load compliance status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Compliance</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="text-gray-600">No checks available</div>
      )}

      <ul className="space-y-2 max-w-2xl">
        {items.map(i => (
          <li key={i.key} className="rounded-md border p-3">
            <div className="font-medium">{i.label}</div>
            <div className="text-sm">Status {i.status}</div>
            {i.details && <div className="text-xs text-gray-500 mt-1">{i.details}</div>}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button onClick={load} className="rounded-md border px-3 py-2">Refresh</button>
      </div>
    </div>
  )
}

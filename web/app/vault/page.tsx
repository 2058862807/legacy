'use client'

import { useEffect, useState } from 'react'
import { listDocuments, DocumentItem } from '@/lib/api'

export default function VaultPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listDocuments()
      setDocs(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Vault</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && docs.length === 0 && (
        <div className="text-gray-600">No documents yet</div>
      )}

      <ul className="space-y-2">
        {docs.map(d => (
          <li key={d.id} className="rounded-md border p-3">
            <div className="font-medium">{d.title}</div>
            <div className="text-xs text-gray-500">Updated {new Date(d.updatedAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button onClick={load} className="rounded-md border px-3 py-2">Refresh</button>
      </div>
    </div>
  )
}

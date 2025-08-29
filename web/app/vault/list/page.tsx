'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '../../../lib/api'
import DashboardLayout from '../../../components/Layout/DashboardLayout'

type VaultItem = {
  id: string
  name: string
  size_bytes: number
  uploaded_at: string
  url?: string
}

export default function VaultListPage() {
  const [items, setItems] = useState<VaultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/vault`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.items || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this file?')) return
    try {
      await fetch(`${API_BASE}/vault/${id}`, { method: 'DELETE' })
      await load()
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        {loading && <p>Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Size</th>
              <th className="p-2 text-left">Uploaded</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">
                  {it.url ? (
                    <a href={it.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {it.name}
                    </a>
                  ) : (
                    it.name
                  )}
                </td>
                <td className="p-2">{Intl.NumberFormat().format(it.size_bytes)} bytes</td>
                <td className="p-2">{new Date(it.uploaded_at).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500 text-center">
                  No files uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </DashboardLayout>
  )
}

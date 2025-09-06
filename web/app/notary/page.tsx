'use client'

import { useEffect, useState } from 'react'
import { getNotaryStatus, requestNotary, NotaryStatus, listDocuments, DocumentItem } from '@/lib/api'

export default function NotaryPage() {
  const [status, setStatus] = useState<NotaryStatus | null>(null)
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [docId, setDocId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const s = await getNotaryStatus()
      const d = await listDocuments()
      setStatus(s)
      setDocs(d)
      if (d.length > 0) setDocId(d[0].id)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onRequest() {
    if (!docId) return
    setSubmitting(true)
    setError(null)
    try {
      await requestNotary({ docId })
      await load()
    } catch (e: any) {
      setError(e.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Notary</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {status && (
        <div className="mb-4">
          <div className="text-sm">Enabled {status.enabled ? 'Yes' : 'No'}</div>
          <div className="text-sm">State {status.state}</div>
        </div>
      )}

      <div className="grid gap-2 max-w-md">
        <label className="text-sm">Select document</label>
        <select
          className="rounded-md border p-2"
          value={docId}
          onChange={e => setDocId(e.target.value)}
        >
          {docs.map(d => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>

        <button
          onClick={onRequest}
          disabled={submitting || !docId}
          className="rounded-md border px-3 py-2 disabled:opacity-50"
        >
          {submitting ? 'Requesting...' : 'Request notarization'}
        </button>
      </div>
    </div>
  )
}

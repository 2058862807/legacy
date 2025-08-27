'use client'

import { useState } from 'react'
import { API_BASE } from '@/lib/api'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function NotaryRequestPage() {
  const [docName, setDocName] = useState('')
  const [hash, setHash] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit() {
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`${API_BASE}/notary/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_name: docName, hash, signer_email: email }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg('Request submitted')
      setDocName('')
      setHash('')
      setEmail('')
    } catch (e: any) {
      setMsg(e.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Request Notarization</h1>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Document name"
            value={docName}
            onChange={e => setDocName(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="SHA-256 hash"
            value={hash}
            onChange={e => setHash(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            type="email"
            placeholder="Signer email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={submit}
          disabled={loading || !docName || !hash || !email}
          className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {msg && <p className="mt-4">{msg}</p>}
      </main>
    </DashboardLayout>
  )
}

'use client'

import { useState } from 'react'
import { API_BASE } from '@/lib/api'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function VaultUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function upload() {
    if (!file) return
    setLoading(true)
    setMessage(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/vault/upload`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      setMessage('Upload successful')
      setFile(null)
    } catch (err: any) {
      setMessage(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={upload}
          disabled={!file || loading}
          className="ml-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-4">{message}</p>}
      </main>
    </DashboardLayout>
  )
}

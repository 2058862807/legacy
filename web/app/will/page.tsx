'use client'

import { useEffect, useState } from 'react'
import { getWill, saveWill, WillProfile } from '@/lib/api'

type FormState = {
  fullName: string
  state: string
  executorName: string
}

export default function WillPage() {
  const [profile, setProfile] = useState<WillProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    fullName: '',
    state: '',
    executorName: ''
  })

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getWill()
      setProfile(data)
      const a = data.answers || {}
      setForm({
        fullName: a.fullName || '',
        state: a.state || '',
        executorName: a.executorName || ''
      })
    } catch (e: any) {
      setError(e.message || 'Failed to load will profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onSave() {
    setSaving(true)
    setError(null)
    try {
      const updated = await saveWill({ answers: form })
      setProfile(updated)
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function onChange<K extends keyof FormState>(key: K, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Will Builder</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && (
        <div className="space-y-3">
          <div className="grid gap-2">
            <label className="text-sm">Full name</label>
            <input className="rounded-md border p-2" value={form.fullName} onChange={e => onChange('fullName', e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">State</label>
            <input className="rounded-md border p-2" value={form.state} onChange={e => onChange('state', e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Executor name</label>
            <input className="rounded-md border p-2" value={form.executorName} onChange={e => onChange('executorName', e.target.value)} />
          </div>

          <div className="flex gap-2">
            <button disabled={saving} onClick={onSave} className="rounded-md border px-3 py-2 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={load} className="rounded-md border px-3 py-2">Reload</button>
          </div>

          {profile && (
            <div className="text-xs text-gray-500">Status {profile.status}</div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
export default function WillCreatePage() {
const [fullName, setFullName] = useState('')
const [executor, setExecutor] = useState('')
const [msg, setMsg] = useState<string | null>(null)
async function save() {
setMsg(null)
const r = await fetch(${API_BASE}/will, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ full_name: fullName, executor })
})
setMsg(r.ok ? 'saved' : 'save failed')
if (r.ok) { setFullName(''); setExecutor('') }
}
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-4">Create Will</h1>
<div className="grid gap-3 max-w-xl">
<input className="border rounded px-3 py-2" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
<input className="border rounded px-3 py-2" placeholder="Executor name" value={executor} onChange={e=>setExecutor(e.target.value)} />
<div className="flex gap-2">
<button onClick={save} disabled={!fullName || !executor} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">Save</button>
<a href="/will-builder" className="text-blue-600 hover:underline">Back</a>
</div>
{msg && <p>{msg}</p>}
</div>
</DashboardLayout>
)
}

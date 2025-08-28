'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
export default function NewHeirPage() {
const [name, setName] = useState('')
const [relation, setRelation] = useState('')
const [email, setEmail] = useState('')
const [share, setShare] = useState<number | ''>('')
const [msg, setMsg] = useState<string | null>(null)
async function save() {
setMsg(null)
const res = await fetch(${API_BASE}/heirs, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, relation, email, share: share === '' ? undefined : Number(share) })
})
if (!res.ok) return setMsg('save failed')
setMsg('saved')
setName(''); setRelation(''); setEmail(''); setShare('')
}
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-4">Add Heir</h1>
<div className="grid gap-3 max-w-xl">
<input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<input className="border rounded px-3 py-2" placeholder="Relation" value={relation} onChange={e=>setRelation(e.target.value)} />
<input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="border rounded px-3 py-2" placeholder="Share percent" type="number" value={share} onChange={e=>setShare(e.target.value === '' ? '' : Number(e.target.value))} />
<div className="flex gap-2">
<button onClick={save} disabled={!name || !relation} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">Save</button>
<a href="/heirs" className="text-blue-600 hover:underline">Back</a>
</div>
{msg && <p>{msg}</p>}
</div>
</DashboardLayout>
)
}

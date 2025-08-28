'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
type Heir = { id: string; name: string; relation: string; email?: string; share?: number }
export default function HeirsPage() {
const [list, setList] = useState<Heir[]>([])
const [error, setError] = useState<string | null>(null)
async function load() {
try {
const r = await fetch(${API_BASE}/heirs, { cache: 'no-store' })
const data = await r.json()
setList(Array.isArray(data) ? data : data.items || [])
} catch (e:any) {
setError(e.message || 'failed')
}
}
useEffect(() => { load() }, [])
return (
<DashboardLayout>
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold">Heirs</h1>
<a href="/heirs/new" className="rounded bg-blue-600 text-white px-3 py-2">Add</a>
</div>
{error && <p className="text-red-600 mb-3">{error}</p>}
<table className="min-w-full border">
<thead><tr className="bg-gray-100"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Relation</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Share</th></tr></thead>
<tbody>
{list.map(h => (
<tr key={h.id} className="border-t">
<td className="p-2">{h.name}</td>
<td className="p-2">{h.relation}</td>
<td className="p-2">{h.email || '-'}</td>
<td className="p-2">{h.share ?? '-'}</td>
</tr>
))}
{list.length === 0 && (
<tr><td colSpan={4} className="p-3 text-center text-gray-500">No heirs</td></tr>
)}
</tbody>
</table>
</DashboardLayout>
)
}

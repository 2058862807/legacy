'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
type Draft = { id: string; title: string; updated_at: string }
export default function WillDraftsPage() {
const [list, setList] = useState<Draft[]>([])
async function load() {
const r = await fetch(${API_BASE}/will/drafts, { cache: 'no-store' })
const d = await r.json()
setList(Array.isArray(d) ? d : d.items || [])
}
useEffect(() => { load() }, [])
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-4">Drafts</h1>
<table className="min-w-full border">
<thead><tr className="bg-gray-100"><th className="p-2 text-left">Title</th><th className="p-2 text-left">Updated</th></tr></thead>
<tbody>
{list.map(w => (
<tr key={w.id} className="border-t">
<td className="p-2">{w.title}</td>
<td className="p-2">{new Date(w.updated_at).toLocaleString()}</td>
</tr>
))}
{list.length === 0 && <tr><td colSpan={2} className="p-3 text-center text-gray-500">No drafts</td></tr>}
</tbody>
</table>
</DashboardLayout>
)
}

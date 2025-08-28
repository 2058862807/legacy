'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
type Safe = { id: string; name: string; items: number }
export default function SafesPage() {
const [list, setList] = useState<Safe[]>([])
async function load() {
const r = await fetch(${API_BASE}/safes, { cache: 'no-store' })
const d = await r.json()
setList(Array.isArray(d) ? d : d.items || [])
}
useEffect(() => { load() }, [])
return (
<DashboardLayout>
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold">Safes</h1>
<a className="rounded bg-blue-600 text-white px-3 py-2" href="/vault/upload">Add Item</a>
</div>
<ul className="grid gap-3">
{list.map(s => (
<li key={s.id} className="border rounded p-3">
<div className="font-semibold">{s.name}</div>
<div className="text-gray-600">{s.items} items</div>
</li>
))}
{list.length === 0 && <li className="text-gray-500">No safes</li>}
</ul>
</DashboardLayout>
)
}

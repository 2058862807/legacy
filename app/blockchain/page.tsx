'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
export default function BlockchainPage() {
const [hash, setHash] = useState('')
const [result, setResult] = useState<string | null>(null)
async function verify() {
setResult(null)
try {
const r = await fetch(${API_BASE}/blockchain/verify, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ hash })
})
const d = await r.json()
setResult(d.valid ? 'verified' : 'not found')
} catch {
setResult('error')
}
}
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-4">Blockchain Records</h1>
<div className="flex gap-2 mb-3">
<input className="border rounded px-3 py-2 flex-1" placeholder="Document hash" value={hash} onChange={e=>setHash(e.target.value)} />
<button onClick={verify} disabled={!hash} className="rounded bg-gray-800 text-white px-4 py-2">Verify</button>
</div>
{result && <p>{result}</p>}
</DashboardLayout>
)
}

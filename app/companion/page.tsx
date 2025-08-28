'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { API_BASE } from '@/lib/api'
export default function CompanionPage() {
const [input, setInput] = useState('')
const [log, setLog] = useState<{role:'user'|'assistant', text:string}[]>([])
const [busy, setBusy] = useState(false)
async function send() {
if (!input) return
const text = input
setInput('')
setLog(l => [...l, { role: 'user', text }])
setBusy(true)
try {
const res = await fetch(${API_BASE}/companion/chat, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: text })
})
const data = await res.json()
setLog(l => [...l, { role: 'assistant', text: data.reply || 'ok' }])
} catch {
setLog(l => [...l, { role: 'assistant', text: 'error' }])
} finally {
setBusy(false)
}
}
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-4">Compassionate AI Companion</h1>
<div className="border rounded p-4 max-w-2xl">
<div className="min-h-64 space-y-2 mb-3">
{log.map((m,i) => (
<div key={i} className={m.role === 'user' ? 'text-right' : ''}>
<span className={m.role === 'user' ? 'bg-blue-600 text-white px-3 py-2 rounded' : 'bg-gray-200 px-3 py-2 rounded'}>
{m.text}
</span>
</div>
))}
</div>
<div className="flex gap-2">
<input className="border rounded px-3 py-2 flex-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
<button onClick={send} disabled={busy || !input} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">Send</button>
</div>
</div>
</DashboardLayout>
)
}

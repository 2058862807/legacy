'use client'
import { useState } from 'react'
export default function AIChatAssistant() {
  const [q, setQ] = useState('')
  return (
    <div className="space-y-3">
      <div className="bg-gray-100 p-4 rounded-lg">Ask a question about your estate plan.</div>
      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Type here…" />
        <button className="bg-blue-600 text-white px-4 rounded-lg">Send</button>
      </div>
    </div>
  )
}

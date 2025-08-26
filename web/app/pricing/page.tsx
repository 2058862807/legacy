'use client'
import { useState } from 'react'

const plans = [
  { id: 'basic', name: 'Basic Will', price: 2999, desc: 'Single will' },
  { id: 'premium', name: 'Premium Will', price: 4999, desc: 'Will plus blockchain receipt' },
  { id: 'full', name: 'Full Estate Plan', price: 9999, desc: 'Complete package' }
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(id: string) {
    setLoading(id)
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId: id }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8 grid md:grid-cols-3 gap-6">
      {plans.map(p => (
        <div key={p.id} className="rounded-xl border bg-white p-6 space-y-3">
          <h2 className="text-xl font-semibold">{p.name}</h2>
          <div className="text-3xl font-bold">${(p.price/100).toFixed(2)}</div>
          <p className="text-gray-600">{p.desc}</p>
          <button onClick={() => upgrade(p.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg">
            {loading === p.id ? 'Redirecting...' : 'Upgrade'}
          </button>
        </div>
      ))}
    </main>
  )
}

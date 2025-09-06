'use client'

import { useEffect, useState } from 'react'
import { getComplianceStatus, ComplianceItem } from '../../lib/api'

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getComplianceStatus()
        if (!cancelled) {
          setItems(result)
          setLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Failed to load')
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="p-8">Loading compliance status...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Compliance Dashboard</h1>
      
      <div className="grid gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{item.label || `Compliance Item ${idx + 1}`}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                item.status === 'pass' ? 'bg-green-100 text-green-800' :
                item.status === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'fail' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
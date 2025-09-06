'use client'

import { useEffect, useState } from 'react'
import { getNotaryStatus, requestNotary, NotaryStatus } from '../../lib/api'

export default function NotaryPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getNotaryStatus()
        if (!cancelled) {
          setStatus(result)
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

  const handleCreateRequest = async () => {
    if (creating) return
    
    setCreating(true)
    try {
      const result = await requestNotary({ docId: 'sample_doc_' + Date.now() })
      alert('Notary request created successfully')
    } catch (e: any) {
      alert('Error: ' + (e.message || 'Failed to create request'))
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="p-8">Loading notary status...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Blockchain Notary</h1>
      
      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notary Status</h2>
          
          {status && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-medium">{status.network || 'Polygon'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${status.available ? 'text-green-600' : 'text-red-600'}`}>
                  {status.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {status.walletAddress && (
                <div className="flex justify-between">
                  <span>Wallet:</span>
                  <span className="font-mono text-sm">{status.walletAddress}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Notary Request</h2>
          <p className="text-gray-600 mb-4">
            Create a blockchain notarization request for your documents.
          </p>
          
          <button
            onClick={handleCreateRequest}
            disabled={creating || !status?.available}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </div>
    </div>
  )
}
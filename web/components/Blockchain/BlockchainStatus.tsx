'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface NotarizedDocument {
  id: string
  name: string
  hash: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  transactionId?: string
}

export default function BlockchainStatus() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<NotarizedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotarizedDocuments = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/documents/list?user_email=${encodeURIComponent(session.user.email)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch documents')
        }
        
        const data = await response.json()
        
        // Filter for notarized documents and transform the data
        const notarizedDocs = (Array.isArray(data) ? data : data.documents || [])
          .filter((doc: any) => doc.isNotarized && doc.blockchain_hash)
          .map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            hash: doc.blockchain_hash,
            timestamp: doc.uploadDate,
            status: doc.status || 'confirmed',
            transactionId: doc.transactionId
          }))
        
        setDocuments(notarizedDocs)
      } catch (err: any) {
        console.error('Error fetching notarized documents:', err)
        setError(err.message || 'Failed to load blockchain status')
      } finally {
        setLoading(false)
      }
    }

    fetchNotarizedDocuments()
  }, [session?.user?.email])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅'
      case 'pending':
        return '⏳'
      case 'failed':
        return '❌'
      default:
        return '⏳'
    }
  }

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  if (!session) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-blue-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Authentication Required</h3>
          <p className="text-blue-700">Please sign in to view blockchain status.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="text-red-500 text-2xl">❌</div>
          <div>
            <h3 className="font-semibold text-red-800">Blockchain Status Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Blockchain Records
          </h3>
          <p className="text-gray-500">
            Your documents haven't been notarized on the blockchain yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Blockchain Notarization Status</h2>
        <div className="text-sm text-gray-500">
          {documents.length} document{documents.length !== 1 ? 's' : ''} notarized
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📄</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <div className="text-sm text-gray-500">
                    Notarized: {formatTimestamp(doc.timestamp)}
                  </div>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                {getStatusIcon(doc.status)} {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Blockchain Hash:</span>
                <div className="font-mono text-blue-600 break-all">
                  {formatHash(doc.hash)}
                </div>
              </div>
              
              {doc.transactionId && (
                <div>
                  <span className="text-gray-500">Transaction ID:</span>
                  <div className="font-mono text-green-600 break-all">
                    {formatHash(doc.transactionId)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🔗 Immutable proof of authenticity</span>
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => {
                    // In a real implementation, this would open blockchain explorer
                    alert('Blockchain explorer integration coming soon')
                  }}
                >
                  View on Blockchain →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => d.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(d => d.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
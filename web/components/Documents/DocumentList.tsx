'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  isNotarized: boolean
  blockchain_hash?: string
  status: 'pending' | 'verified' | 'failed'
}

export default function DocumentList() {
  const { data: session, status } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      // Wait for auth to finish loading
      if (status === 'loading') {
        return
      }
      
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/documents/list?user_email=${encodeURIComponent(session.user.email)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (Array.isArray(data)) {
          setDocuments(data)
        } else if (data.documents && Array.isArray(data.documents)) {
          setDocuments(data.documents)
        } else {
          // Handle empty or invalid response
          setDocuments([])
        }
      } catch (err: any) {
        console.error('Error fetching documents:', err)
        setError(err.message || 'Failed to load documents')
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [session?.user?.email, status])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: '⏳',
      verified: '✅',
      failed: '❌'
    }
    return icons[status as keyof typeof icons] || '⏳'
  }

  if (!session) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-blue-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Authentication Required</h3>
          <p className="text-blue-700">Please sign in to view your documents.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="text-red-500 text-2xl">❌</div>
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Documents</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Documents Yet</h3>
          <p className="text-gray-500 mb-6">
            Upload your first document to get started with secure document management.
          </p>
          <button
            onClick={() => window.location.href = '/vault/upload'}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Upload Document
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* File Type Icon */}
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : '📎'}
                </span>
              </div>
              
              {/* Document Info */}
              <div>
                <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>{formatDate(doc.uploadDate)}</span>
                  {doc.isNotarized && (
                    <span className="flex items-center space-x-1 text-green-600">
                      <span>⚖️</span>
                      <span>Notarized</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center space-x-3">
              {/* Blockchain Status */}
              {doc.blockchain_hash && (
                <div className="text-xs">
                  <div className="text-gray-500">Blockchain:</div>
                  <div className="font-mono text-green-600">
                    {doc.blockchain_hash.substring(0, 8)}...
                  </div>
                </div>
              )}
              
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doc.status)}`}>
                {getStatusIcon(doc.status)} {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
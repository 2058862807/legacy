'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Document {
  id: string
  filename: string
  document_type: string
  file_size: number 
  uploaded_at: string
  blockchain_verified: boolean
}

export default function DocumentList() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [session])

  const fetchDocuments = async () => {
    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/documents/list?user_email=${encodeURIComponent(session.user.email)}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      } else {
        setError('Failed to load documents')
      }
    } catch (err) {
      setError('Error loading documents')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <div className="text-center py-4">Loading documents...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">📄</div>
        <p className="text-gray-500 mb-4">No documents uploaded yet</p>
        <Link 
          href="/vault/upload" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Your First Document
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">{doc.filename}</div>
            <div className="text-sm text-gray-500">
              {formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {doc.blockchain_verified && (
              <span className="text-green-600 text-sm">🔗 Verified</span>
            )}
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded capitalize">
              {doc.document_type}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
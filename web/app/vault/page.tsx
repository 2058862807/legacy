'use client'

import { useEffect, useState } from 'react'
import { listDocuments, createDocument, DocumentItem } from '../../lib/api'

export default function VaultPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getDocuments()
        if (!cancelled) {
          setDocuments(result)
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadDocument(file)
      setDocuments(prev => [...prev, result])
    } catch (e: any) {
      alert('Upload failed: ' + (e.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-8">Loading documents...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Document Vault</h1>
      
      <div className="mb-6">
        <label className="block">
          <span className="sr-only">Choose file</span>
          <input 
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}
      </div>

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No documents yet. Upload your first document above.</p>
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div key={idx} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{doc.filename}</h3>
                <p className="text-sm text-gray-500">
                  {doc.size ? `${Math.round(doc.size / 1024)} KB` : ''} · 
                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {doc.downloadUrl && (
                  <a 
                    href={doc.downloadUrl}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                )}
                <span className={`px-2 py-1 rounded text-xs ${
                  doc.status === 'processed' ? 'bg-green-100 text-green-800' :
                  doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doc.status || 'uploaded'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { apiFetch } from '../../lib/api'

interface NotaryStatus {
  txHash?: string
  explorerUrl?: string
  confirmations?: number
  status: 'pending' | 'confirmed' | 'failed'
}

export default function NotaryPage() {
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [hash, setHash] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [isNotarizing, setIsNotarizing] = useState(false)
  const [notaryStatus, setNotaryStatus] = useState<NotaryStatus | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setContent(event.target?.result as string)
      }
      reader.readAsText(selectedFile)
    }
  }

  const generateHash = async () => {
    if (!content.trim()) return
    
    setIsHashing(true)
    try {
      const response = await apiFetch<{ hash: string }>('/api/notary/hash', {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() })
      })
      setHash(response.hash)
    } catch (error) {
      alert('Failed to generate hash')
    } finally {
      setIsHashing(false)
    }
  }

  const notarizeDocument = async () => {
    if (!hash) return
    
    setIsNotarizing(true)
    try {
      const response = await apiFetch<{ txHash: string; explorerUrl: string }>('/api/notary/create', {
        method: 'POST',
        body: JSON.stringify({ hash })
      })
      
      setNotaryStatus({
        txHash: response.txHash,
        explorerUrl: response.explorerUrl,
        status: 'pending'
      })

      // Poll for confirmation
      pollForConfirmation(response.txHash)
    } catch (error) {
      alert('Failed to notarize document')
    } finally {
      setIsNotarizing(false)
    }
  }

  const pollForConfirmation = async (txHash: string) => {
    try {
      const response = await apiFetch<{ confirmations: number; status: string }>(`/api/notary/status?tx=${txHash}`)
      
      setNotaryStatus(prev => prev ? {
        ...prev,
        confirmations: response.confirmations,
        status: response.status as 'pending' | 'confirmed' | 'failed'
      } : null)

      if (response.status === 'pending' && response.confirmations < 3) {
        setTimeout(() => pollForConfirmation(txHash), 5000)
      }
    } catch (error) {
      console.error('Failed to check transaction status:', error)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Blockchain Notarization</h1>
        <p className="text-gray-600">Secure your documents on the Polygon blockchain</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Document Input</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="text-center text-gray-500">or</div>

          <div>
            <label className="block text-sm font-medium mb-2">Paste Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your document content here..."
              rows={8}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={generateHash}
            disabled={!content.trim() || isHashing}
            className="btn-primary w-full"
          >
            {isHashing ? 'Generating Hash...' : 'Generate SHA256 Hash'}
          </button>
        </div>

        {/* Hash & Notarization Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Blockchain Notarization</h2>
          
          {hash && (
            <div>
              <label className="block text-sm font-medium mb-2">SHA256 Hash</label>
              <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-sm">
                {hash}
              </div>
            </div>
          )}

          {hash && (
            <button
              onClick={notarizeDocument}
              disabled={isNotarizing}
              className="btn-primary w-full"
            >
              {isNotarizing ? 'Notarizing...' : 'Notarize on Polygon'}
            </button>
          )}

          {/* Status Display */}
          {notaryStatus && (
            <div className="space-y-3">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notarization Status</h3>
                
                <div className={`p-3 rounded-lg ${
                  notaryStatus.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  notaryStatus.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {notaryStatus.status === 'confirmed' ? '✅' : 
                     notaryStatus.status === 'failed' ? '❌' : '⏳'}
                    <span className="capitalize">{notaryStatus.status}</span>
                    {notaryStatus.confirmations !== undefined && (
                      <span className="ml-auto">
                        {notaryStatus.confirmations} confirmations
                      </span>
                    )}
                  </div>
                </div>

                {notaryStatus.txHash && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">Transaction Hash</label>
                    <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
                      {notaryStatus.txHash}
                    </div>
                  </div>
                )}

                {notaryStatus.explorerUrl && (
                  <a
                    href={notaryStatus.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 hover:text-blue-800 underline"
                  >
                    View on PolygonScan →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">1. Hash Generation</h3>
            <p className="text-gray-600">
              Your document is converted to a SHA256 hash - a unique fingerprint that represents your content.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">2. Blockchain Storage</h3>
            <p className="text-gray-600">
              The hash is permanently stored on the Polygon blockchain, creating an immutable timestamp.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">3. Verification</h3>
            <p className="text-gray-600">
              Anyone can verify your document existed at this time by comparing its hash to the blockchain record.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
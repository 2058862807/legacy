'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import CryptoAssetsCard from '../../../components/Dashboard/CryptoAssetsCard'

export default function DemoDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateWill, setShowCreateWill] = useState(false)
  const [documents, setDocuments] = useState([
    { id: 1, name: "Sample_Will.pdf", type: "Will", status: "Notarized", date: "2024-09-01" },
    { id: 2, name: "Trust_Document.pdf", type: "Trust", status: "Draft", date: "2024-09-05" }
  ])

  const handleConnectWallet = () => {
    setWalletAddress('0x1234567890abcdef1234567890abcdef12345678')
  }

  const handleDisconnectWallet = () => {
    setWalletAddress(null)
  }

  const handleRefreshAssets = () => {
    console.log('Refreshing assets...')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: "Document",
        status: "Processing",
        date: new Date().toISOString().split('T')[0]
      }
      setDocuments([...documents, newDoc])
      setShowUploadModal(false)
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: "Ready" } : doc
        ))
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">NexteraEstate™ Demo</h1>
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                DEMO MODE - FULL FUNCTIONALITY
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => setShowCreateWill(true)}
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-lg font-semibold">Create Will</h3>
              <p className="text-sm opacity-90">Build your estate plan</p>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              <div className="text-3xl mb-2">📄</div>
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <p className="text-sm opacity-90">Add existing documents</p>
            </button>

            <Link
              href="/demo/chat"
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors block text-center"
            >
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-sm opacity-90">Get legal guidance</p>
            </Link>

            <Link
              href="/demo/compliance"
              className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition-colors block text-center"
            >
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-lg font-semibold">Compliance</h3>
              <p className="text-sm opacity-90">State-by-state rules</p>
            </Link>
          </div>

          {/* Crypto Assets Card */}
          <div className="mb-8">
            <CryptoAssetsCard 
              walletAddress={walletAddress}
              onConnectWallet={handleConnectWallet}
              onDisconnectWallet={handleDisconnectWallet}
              onRefreshAssets={handleRefreshAssets}
            />
          </div>

          {/* Documents Table */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Documents
              </h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            doc.status === 'Notarized' ? 'bg-green-100 text-green-800' :
                            doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            doc.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900 mr-4">
                            Download
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            Notarize
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Security</h4>
              <p className="text-sm text-gray-600">Documents secured with Polygon blockchain</p>
              <div className="mt-3 text-green-600 text-sm">✅ Active (Polygon)</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">State Compliance</h4>
              <p className="text-sm text-gray-600">50-state legal compliance checking</p>
              <div className="mt-3 text-green-600 text-sm">✅ All States Verified</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">AI Legal Review</h4>
              <p className="text-sm text-gray-600">Esquire AI + Grief Support Bot</p>
              <div className="mt-3 text-blue-600 text-sm">🤖 2 Bots Available</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Stripe Payments</h4>
              <p className="text-sm text-gray-600">Secure checkout integration</p>
              <div className="mt-3 text-green-600 text-sm">💳 Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload any legal document (PDF, DOC, DOCX) and we'll process it with AI analysis.
              </p>
              <div className="mt-2">
                <label htmlFor="file-upload" className="sr-only">Choose file</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Will Modal */}
      {showCreateWill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Will</h3>
              <p className="text-gray-600 mb-4">
                Start building your estate plan with our AI-guided will creation process.
              </p>
              <div className="space-y-4">
                <Link
                  href="/demo/will-builder"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={() => setShowCreateWill(false)}
                >
                  Start Will Builder
                </Link>
                <button
                  onClick={() => setShowCreateWill(false)}
                  className="w-full px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
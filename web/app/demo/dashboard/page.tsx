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
                  href="/will"
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
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Estate Plan Overview Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Estate Plan</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your estate plan is complete and secured on blockchain.
            </p>
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-sm text-green-800">
                ✅ All blockchain fees included • No wallet required
              </p>
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              View Estate Plan
            </button>
          </div>

          {/* Crypto Assets Card */}
          <CryptoAssetsCard
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            onDisconnectWallet={handleDisconnectWallet}
            onRefreshAssets={handleRefreshAssets}
          />

          {/* Documents Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Download, share, and manage your legal documents.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Will & Testament</span>
                <span className="text-green-600 font-medium">Ready</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Power of Attorney</span>
                <span className="text-green-600 font-medium">Ready</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Download All
            </button>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setWalletAddress(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset to Disconnected State
            </button>
            <button
              onClick={handleConnectWallet}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Simulate Wallet Connection
            </button>
            <a
              href="/faq#metamask"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View MetaMask FAQ
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Current State:</strong> {walletAddress ? `Connected (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)})` : 'Disconnected'}
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-800 text-sm mb-3">
                Most users don't need to connect a crypto wallet. Your estate plan is automatically secured on blockchain with all fees included.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/faq#metamask" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                  What is MetaMask?
                </a>
                <a href="/support" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                  Contact Support
                </a>
                <a href="/compliance" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                  Legal Compliance
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
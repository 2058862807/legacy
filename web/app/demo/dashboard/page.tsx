'use client'
import React, { useState } from 'react'
import CryptoAssetsCard from '../../../components/Dashboard/CryptoAssetsCard'

export default function DemoDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setWalletAddress('0x1234567890abcdef1234567890abcdef12345678')
  }

  const handleDisconnectWallet = () => {
    setWalletAddress(null)
  }

  const handleRefreshAssets = () => {
    console.log('Refreshing assets...')
    // In real implementation, this would refresh crypto asset data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Demo</h1>
          <p className="text-gray-600 mt-2">
            Demonstrating the Crypto Assets Card with optional MetaMask integration
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
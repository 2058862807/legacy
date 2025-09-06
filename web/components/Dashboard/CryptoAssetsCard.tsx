'use client'
import React, { useState, useEffect } from 'react'

interface CryptoAssetsCardProps {
  walletAddress?: string | null
  onConnectWallet?: () => void
  onDisconnectWallet?: () => void
  onRefreshAssets?: () => void
}

export default function CryptoAssetsCard({ 
  walletAddress, 
  onConnectWallet, 
  onDisconnectWallet, 
  onRefreshAssets 
}: CryptoAssetsCardProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}…${address.slice(-4)}`
  }

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true)
  }

  const confirmDisconnect = () => {
    setShowDisconnectModal(false)
    if (onDisconnectWallet) {
      onDisconnectWallet()
    }
  }

  const isConnected = Boolean(walletAddress)

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with crypto icon */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-lg">₿</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isConnected ? 'Crypto Assets Linked' : 'Crypto Assets (Optional)'}
          </h3>
        </div>

        {/* Default state (no wallet connected) */}
        {!isConnected && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Your estate plan is secured on the blockchain with no wallet required. All blockchain fees are already included.
              </p>
            </div>

            <div className="relative">
              <button
                onClick={onConnectWallet}
                onMouseEnter={() => setShowTooltip('connect')}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <img src="/metamask-icon.svg" alt="MetaMask" className="w-5 h-5 mr-2" onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling!.style.display = 'inline'
                }} />
                <span style={{ display: 'none' }}>🦊 </span>
                Connect MetaMask
              </button>

              {/* Tooltip for Connect MetaMask */}
              {showTooltip === 'connect' && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-sm rounded-lg p-3 z-10">
                  <div className="text-center">
                    Optional feature for crypto users. Connect to include your digital assets in your estate plan.
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Connected state */}
        {isConnected && (
          <>
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-800 font-medium">
                    Your MetaMask wallet is connected.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span>
                  <span className="font-mono text-gray-800 ml-2">
                    {shortenAddress(walletAddress)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Your crypto assets will now be included in your estate plan.
                </p>
              </div>
            </div>

            {/* Action buttons for connected state */}
            <div className="flex space-x-3">
              {/* Disconnect Wallet */}
              <div className="relative flex-1">
                <button
                  onClick={handleDisconnectClick}
                  onMouseEnter={() => setShowTooltip('disconnect')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Disconnect Wallet
                </button>

                {/* Tooltip for Disconnect */}
                {showTooltip === 'disconnect' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
                    <div className="text-center">
                      Remove your MetaMask wallet connection. Your estate plan will remain secured on blockchain with included fees.
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>

              {/* Refresh Assets */}
              <div className="relative flex-1">
                <button
                  onClick={onRefreshAssets}
                  onMouseEnter={() => setShowTooltip('refresh')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Assets
                </button>

                {/* Tooltip for Refresh */}
                {showTooltip === 'refresh' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
                    <div className="text-center">
                      Update your estate plan with the latest balance and holdings from your MetaMask wallet.
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Help link */}
        <div className="mt-4 text-center">
          <a
            href="/faq#metamask"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
          >
            What is MetaMask?
          </a>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Disconnect MetaMask Wallet?
              </h3>
              
              <p className="text-gray-600 text-sm">
                Your estate plan will remain secured on blockchain with all fees included. You can reconnect your wallet anytime.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
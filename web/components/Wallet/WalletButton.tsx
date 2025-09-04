'use client'
import React from 'react'
import { useWallet } from './MetaMaskProvider'

export default function WalletButton() {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    network,
    switchToPolygon 
  } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isPolygonMainnet = network?.chainId === BigInt(137)

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.483 2.104C4.424 1.536 5.583 1.536 6.517 2.104L18.483 9.896C19.424 10.464 19.424 11.536 18.483 12.104L6.517 19.896C5.583 20.464 4.424 20.464 3.483 19.896C2.542 19.328 2.542 18.256 3.483 17.688L13.965 12L3.483 6.312C2.542 5.744 2.542 4.672 3.483 4.104Z"/>
            </svg>
            <span>Connect MetaMask</span>
          </>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {!isPolygonMainnet && (
        <button
          onClick={switchToPolygon}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Switch to Polygon
        </button>
      )}
      
      <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatAddress(account!)}
          </span>
          <span className="text-xs text-gray-500">
            {isPolygonMainnet ? 'Polygon Mainnet' : network?.name || 'Unknown Network'}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Disconnect wallet"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
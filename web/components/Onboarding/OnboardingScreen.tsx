'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OnboardingScreenProps {
  onContinue: () => void
  onConnectWallet?: () => void
}

export default function OnboardingScreen({ onContinue, onConnectWallet }: OnboardingScreenProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const router = useRouter()

  const handleContinueWithoutWallet = () => {
    // Set user preference to not use wallet
    localStorage.setItem('nextera_wallet_preference', 'none')
    onContinue()
  }

  const handleConnectMetaMask = () => {
    if (onConnectWallet) {
      onConnectWallet()
    } else {
      // Default behavior - redirect to dashboard with wallet connection flow
      localStorage.setItem('nextera_wallet_preference', 'metamask')
      onContinue()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Secure your estate plan your way
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              No wallet required. Blockchain fees are already included. Connect MetaMask only if you want to add your crypto assets.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4 mb-6">
            {/* Primary Button - Continue without wallet */}
            <div className="relative">
              <button
                onClick={handleContinueWithoutWallet}
                onMouseEnter={() => setShowTooltip('continue')}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Continue without wallet
              </button>
              
              {/* Tooltip for Continue without wallet */}
              {showTooltip === 'continue' && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-3 z-10">
                  <div className="text-center">
                    Choose this option if you do not use cryptocurrency. Your estate plan will still be notarized on blockchain with all fees covered.
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>

            {/* Secondary Button - Connect MetaMask */}
            <div className="relative">
              <button
                onClick={handleConnectMetaMask}
                onMouseEnter={() => setShowTooltip('metamask')}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
              >
                <img src="/metamask-icon.svg" alt="MetaMask" className="w-6 h-6 mr-3" onError={(e) => {
                  // Fallback to emoji if SVG not found
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling!.style.display = 'inline'
                }} />
                <span style={{ display: 'none' }}>🦊</span>
                Connect MetaMask (optional)
              </button>
              
              {/* Tooltip for Connect MetaMask */}
              {showTooltip === 'metamask' && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-3 z-10">
                  <div className="text-center">
                    Optional feature for crypto users. Connect to include your digital assets in your estate plan.
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>

          {/* Micro-copy */}
          <div className="text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              Most users do not need a wallet. MetaMask is for advanced users who wish to include existing crypto holdings.
            </p>
          </div>

          {/* Help Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/faq#metamask')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              What is MetaMask?
            </button>
            <span className="text-gray-400 mx-2">•</span>
            <button
              onClick={() => router.push('/support')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Need help? Contact us
            </button>
          </div>

          {/* Compliance Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-800">
                Estate plans created here meet legal standards across all U.S. states.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
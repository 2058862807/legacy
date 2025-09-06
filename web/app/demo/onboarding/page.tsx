'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingScreen from '../../../components/Onboarding/OnboardingScreen'

export default function DemoOnboarding() {
  const [showResult, setShowResult] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    const preference = localStorage.getItem('nextera_wallet_preference')
    setShowResult(preference || 'unknown')
  }

  const handleConnectWallet = () => {
    // Simulate wallet connection flow
    localStorage.setItem('nextera_wallet_preference', 'metamask')
    setShowResult('metamask')
  }

  const resetDemo = () => {
    localStorage.removeItem('nextera_wallet_preference')
    setShowResult(null)
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {showResult === 'metamask' ? 'MetaMask Selected' : 'Continue Without Wallet'}
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>User Preference:</strong> {showResult === 'metamask' ? 'Connect MetaMask wallet' : 'No wallet required'}
              </p>
              
              {showResult === 'metamask' ? (
                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <p className="text-purple-800 text-sm">
                    ✅ MetaMask connection flow would begin here<br/>
                    🔗 User can include crypto assets in estate plan<br/>
                    📋 Blockchain fees still included in package
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-blue-800 text-sm">
                    ✅ No wallet setup required<br/>
                    🔗 Estate plan secured on blockchain automatically<br/>
                    💰 All blockchain fees included in package
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetDemo}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Reset Demo
              </button>
              <button
                onClick={() => router.push('/demo/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard Demo
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>This demonstrates the onboarding flow with proper user preference handling.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <OnboardingScreen 
      onContinue={handleContinue}
      onConnectWallet={handleConnectWallet}
    />
  )
}
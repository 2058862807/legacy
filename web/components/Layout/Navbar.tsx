'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]
import NexteraLogo from '../NexteraLogo'

export default function Navbar() {
  const { data: session } = useSession()
  const [showStateModal, setShowStateModal] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <NexteraLogo size="md" priority />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexteraEstate™
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link href="/compliance" className="text-gray-600 hover:text-gray-900 font-medium">
              Compliance
            </Link>
            <button 
              onClick={() => setShowStateModal(true)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              State coverage
            </button>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 font-medium">
              FAQ
            </Link>
            
            {session ? (
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/start" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start your plan
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {session ? (
              <Link href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
            ) : (
              <Link href="/start" className="text-blue-600 font-medium">
                Start your plan
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* State Coverage Modal */}
      {showStateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">50 State Coverage</h2>
              <button
                onClick={() => setShowStateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              NexteraEstate supports estate planning requirements for all 50 U.S. states, ensuring your documents are legally compliant wherever you live.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {US_STATES.map((state) => (
                <div key={state} className="flex items-center p-2 border border-gray-200 rounded-lg">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
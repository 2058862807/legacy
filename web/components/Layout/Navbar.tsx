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
    </nav>
  )
}
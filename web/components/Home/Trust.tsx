'use client'
import React from 'react'

export default function Trust() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 mb-8">
            Used by people who want a fast, compliant path to signed estate documents.
          </p>
          
          {/* Trust signals */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 text-sm">💳</span>
              </div>
              <span className="text-gray-700 font-medium">Stripe payments</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 text-sm">G</span>
              </div>
              <span className="text-gray-700 font-medium">Google sign in</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 text-sm">🔗</span>
              </div>
              <span className="text-gray-700 font-medium">Gasless blockchain notarization</span>
            </div>
          </div>
          
          {/* Security line */}
          <p className="text-sm text-gray-500 mt-8">
            🔒 We use HTTPS, Stripe, and Google sign in. We store only what we need.
          </p>
        </div>
      </div>
    </section>
  )
}
'use client'
import React from 'react'

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your estate plan protected with cutting-edge blockchain technology in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1: Create your documents */}
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📝</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Create your documents
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Answer a few guided questions. Our AI builds your will and estate plan in minutes.
            </p>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-700 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI-powered • 50-state compliant • 5 minutes</span>
              </div>
            </div>
          </div>

          {/* Step 2: Secure with blockchain */}
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🔗</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">2</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Secure with blockchain
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Your documents are notarized on the blockchain. No wallet required. All blockchain fees are included in your package.
            </p>
            
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-purple-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No crypto wallet required</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-purple-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>All blockchain fees included</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-purple-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Immutable verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Access and manage */}
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📱</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">3</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Access and manage
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Download, update, and store your plan securely anytime. Optional: connect MetaMask if you want to include your crypto assets in your estate plan.
            </p>
            
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant PDF downloads</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Automatic legal updates</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Optional crypto integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Lines for Desktop */}
        <div className="hidden md:block relative -mt-16">
          <div className="absolute left-1/3 transform -translate-x-1/2 top-16">
            <svg className="w-24 h-12" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25 L90 25" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#E5E7EB" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="absolute left-2/3 transform -translate-x-1/2 top-16">
            <svg className="w-24 h-12" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25 L90 25" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead2)" />
              <defs>
                <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#E5E7EB" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to secure your family's future?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of families who trust NexteraEstate with their most important documents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Start Free Today
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
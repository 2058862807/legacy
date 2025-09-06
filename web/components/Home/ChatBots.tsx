'use client'
import React, { useState } from 'react'

export default function ChatBots() {
  const [activeBotDemo, setActiveBotDemo] = useState<'help' | 'grief' | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Legal Assistance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant help from our advanced AI legal assistants, available 24/7 to guide you through your estate planning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Esquire AI - Help Bot */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl text-white">⚖️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Esquire AI</h3>
                <p className="text-blue-600 font-medium">Legal Estate Planning Assistant</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700 leading-relaxed">
                Your personal AI lawyer specializing in estate planning. Get instant answers about wills, trusts, taxes, and state-specific legal requirements.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Esquire AI can help with:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Will requirements
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Trust strategies
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    State laws
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tax implications
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Guardian selection
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Document updates
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveBotDemo(activeBotDemo === 'help' ? null : 'help')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <span className="mr-2">💬</span>
              {activeBotDemo === 'help' ? 'Close Demo' : 'Try Esquire AI Now'}
            </button>
          </div>

          {/* Grief Bot */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl text-white">🫂</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Grief Support</h3>
                <p className="text-purple-600 font-medium">Compassionate Emotional Support</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700 leading-relaxed">
                Our caring AI support companion understands the emotional challenges of estate planning and provides compassionate guidance during difficult times.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Grief Support provides:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Emotional support
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Crisis resources
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Coping strategies
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Professional referrals
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    24/7 availability
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Safe space to talk
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveBotDemo(activeBotDemo === 'grief' ? null : 'grief')}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <span className="mr-2">🫂</span>
              {activeBotDemo === 'grief' ? 'Close Support' : 'Get Support Now'}
            </button>
          </div>
        </div>

        {/* Demo Chat Interface */}
        {activeBotDemo && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {activeBotDemo === 'help' ? '⚖️ Esquire AI Demo' : '🫂 Grief Support Demo'}
              </h3>
              <button
                onClick={() => setActiveBotDemo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-3">
                {activeBotDemo === 'help' 
                  ? 'Try asking Esquire AI about estate planning topics like:'
                  : 'Our Grief Support bot provides compassionate assistance. Try topics like:'
                }
              </p>
              
              <div className="flex flex-wrap gap-2">
                {activeBotDemo === 'help' ? (
                  <>
                    <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      "What should be in my will?"
                    </button>
                    <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      "Do I need a trust?"
                    </button>
                    <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      "What are my state's requirements?"
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                      "I'm feeling overwhelmed"
                    </button>
                    <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                      "I recently lost someone"
                    </button>
                    <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                      "I need someone to talk to"
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> This is a preview of our AI assistants. To chat with the actual bots, look for the floating chat buttons on any page, or visit your dashboard after signing up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to get started with AI-assisted estate planning?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Our AI assistants are available 24/7 to help you create your estate plan with confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Start Your Estate Plan
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More About Our AI
              </button>
            </div>
          </div>
        </div>

        {/* Floating Bot Indicators */}
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-40">
          <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">⚖️</span>
              <span>Esquire AI available →</span>
            </div>
          </div>
          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">🫂</span>
              <span>Support available →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
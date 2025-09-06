'use client'
import React from 'react'

const features = [
  {
    icon: '⚡',
    title: 'Plan documents fast',
    description: 'Create wills and estate documents with guided workflows and smart templates.'
  },
  {
    icon: '🔐', 
    title: 'Online notarization',
    description: 'Complete notarization online in states that allow it, with blockchain verification.'
  },
  {
    icon: '💳',
    title: 'Secure payments',
    description: 'Pay safely with Stripe. See all costs upfront before you commit.'
  },
  {
    icon: '👤',
    title: 'Google sign in',
    description: 'Use your Google account for quick, secure access to your documents.'
  },
  {
    icon: '🔗',
    title: 'Blockchain proof',
    description: 'Your documents are timestamped on Blockchain for permanent verification.'
  },
  {
    icon: '⚖️',
    title: 'State compliance',
    description: 'Clear rules and citations for all 50 states plus Washington DC.'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for estate planning
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From document creation to legal compliance, we've got every step covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'
import React, { useState } from 'react'

const plan = {
  name: 'NexteraEstate',
  price: 49,
  period: 'month',
  description: 'Complete estate planning solution',
  features: [
    'Will and basic documents',
    'Online payment processing', 
    'State rule guidance',
    'Notarization workflow',
    'Document storage',
    'Email support'
  ],
  popular: true
}

export default function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout failed. Please try again.')
      }
    } catch (error) {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            One plan with everything you need. No hidden fees.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className={`bg-white rounded-2xl shadow-xl p-8 relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleUpgrade('basic')}
              disabled={loading === 'basic'}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading === 'basic' ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  )
}
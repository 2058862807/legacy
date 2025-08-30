'use client'
import { useState } from 'react'
import Link from 'next/link'
import Bot from '../../components/Bot'

const plans = [
  { 
    id: 'basic', 
    name: 'Basic Will', 
    price: 2999, 
    desc: 'Essential will creation',
    features: [
      'Last Will & Testament',
      'Basic legal templates',
      'PDF download',
      'Email support'
    ]
  },
  { 
    id: 'premium', 
    name: 'Premium Will', 
    price: 4999, 
    desc: 'Will with blockchain verification',
    features: [
      'Everything in Basic',
      'Blockchain notarization',
      'Compliance checking',
      'Priority support',
      'Document vault'
    ]
  },
  { 
    id: 'full', 
    name: 'Full Estate Plan', 
    price: 9999, 
    desc: 'Complete estate planning suite',
    features: [
      'Everything in Premium',
      'Trust creation',
      'Power of Attorney',
      'Healthcare directives',
      'Tax optimization',
      'Legal consultation',
      'AI-powered guidance'
    ]
  }
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(id: string) {
    setLoading(id)
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ planId: id }) 
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <main className="max-w-6xl mx-auto p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Estate Plan</h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan to secure your family's future
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={plan.id} className={`card relative ${
              index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}>
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <div className="text-4xl font-bold text-blue-600">
                  ${(plan.price/100).toFixed(2)}
                </div>
                <p className="text-gray-600">{plan.desc}</p>
                
                <ul className="space-y-2 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => upgrade(plan.id)} 
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    index === 1 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {loading === plan.id ? 'Processing...' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Need help choosing? <Link href="/login" className="text-blue-600 underline">Talk to our experts</Link>
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>✓ 30-day money back guarantee</span>
            <span>✓ Bank-level security</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </main>

      <Bot type="help" />
    </>
  )
}
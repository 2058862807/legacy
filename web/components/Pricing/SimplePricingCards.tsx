'use client'
import React, { useState, useEffect } from 'react'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  features: string[]
  popular?: boolean
  founding?: boolean
  moneyBack?: boolean
  countdown?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Create and preview. Save progress. Email support.',
    price: '$0',
    features: [
      'Create and preview',
      'Save progress', 
      'Email support'
    ]
  },
  {
    id: 'essential',
    name: 'Essential',
    description: 'All core documents. Automatic updates. Secure sharing.',
    price: '$169 per year',
    popular: true,
    moneyBack: true,
    features: [
      'All core documents',
      'Automatic updates',
      'Secure sharing',
      '60-day money back'
    ]
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    description: 'Lifetime access. All updates included. Priority support.',
    price: '$129 once',
    founding: true,
    countdown: true,
    features: [
      'Lifetime access',
      'All updates included',
      'Priority support',
      'All future features',
      'Limited: First 200 users only'
    ]
  }
]

export default function SimplePricingCards() {
  const [countdown, setCountdown] = useState({ days: 5, hours: 12, minutes: 34, seconds: 56 })
  const [spotsLeft, setSpotsLeft] = useState(147) // Track remaining spots out of 200

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    // Simulate spots being taken (optional - for demo purposes)
    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => {
        const newSpots = Math.max(1, prev - Math.floor(Math.random() * 2)) // Decrease by 0-1 randomly
        return newSpots
      })
    }, 180000) // Update every 3 minutes

    return () => {
      clearInterval(timer)
      clearInterval(spotsTimer)
    }
  }, [])

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return
    
    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planId,
          billing_period: 'yearly'
        })
      })
      
      const data = await response.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Estate Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Free to try. Pay to export, sign, and prove. Your documents stay current as laws and life change.
          </p>
          
          {/* Trust Testimonials */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 italic mb-2">
                  "Saved me $3,000 in attorney fees. The AI caught issues I never would've found."
                </p>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Sarah M.</span> • Houston, TX
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 italic mb-2">
                  "Live updates caught a law change that would've invalidated my will. Incredible!"
                </p>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Michael D.</span> • Denver, CO
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 italic mb-2">
                  "Finally, estate planning that doesn't require a law degree to understand."
                </p>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Lisa K.</span> • Seattle, WA
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Bank-level security</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>50-state compliance</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>2,847+ families protected</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Pricing Grid - Only 3 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-4 sm:p-6 ${
                plan.popular
                  ? 'border-blue-500 shadow-xl lg:scale-105'
                  : plan.founding
                  ? 'border-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'
                  : 'border-gray-200 shadow-lg hover:shadow-xl transition-shadow'
              }`}
            >
              {/* Best Value Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
              )}

              {/* Countdown Badge */}
              {plan.founding && plan.countdown && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Early Bird: {spotsLeft} spots left
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.founding ? (
                    <div className="text-center">
                      <div className="text-lg text-gray-500 line-through mb-1">$499 once</div>
                      <span className="text-3xl font-bold text-gray-900">$129 once</span>
                      <div className="text-sm text-green-600 font-medium mt-1">Save $370 (74% off)</div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 sm:space-y-3 mb-6 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Money Back Guarantee */}
              {plan.moneyBack && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">60 day money back</p>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-3 ${
                  plan.id === 'free'
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.founding
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.id === 'free' ? 'Start Free' : 
                 plan.founding ? 'Claim Founding Spot' :
                 `Start ${plan.name}`}
              </button>

              {/* Trust Indicators for Paid Plans */}
              {plan.id !== 'free' && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>2,847+ families protected</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span>4.9/5 (284 reviews)</span>
                  </div>
                  {plan.founding && (
                    <div className="text-xs text-purple-600 font-medium">
                      ⚡ 53 spots claimed this week
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add-ons Row */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add-on Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Remote notary add on</h4>
                <span className="text-lg font-bold text-blue-600">$99</span>
              </div>
              <p className="text-sm text-gray-600">Complete notarization online with certified notary</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Attorney review add on</h4>
                <span className="text-lg font-bold text-blue-600">$79</span>
              </div>
              <p className="text-sm text-gray-600">Professional attorney review and recommendations</p>
            </div>
          </div>
        </div>

        {/* Trust and Compliance Block */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Security</h4>
              <div className="space-y-2">
                <p className="text-gray-600">Encrypted in transit and at rest</p>
                <p className="text-gray-600">Stripe payments</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Compliance</h4>
              <div className="space-y-2">
                <p className="text-gray-600">50 state coverage</p>
                <a href="/compliance" className="text-blue-600 hover:text-blue-800 underline">
                  How we stay compliant
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* See All Plans CTA */}
        <div className="text-center">
          <a
            href="/pricing"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            See All Plans & Features
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
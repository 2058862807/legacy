'use client'
import React, { useState } from 'react'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice: number
  period: 'month' | 'year'
  popular?: boolean
  founding?: boolean
  features: string[]
  limitations?: string[]
  addOns?: Array<{
    name: string
    price: number
    description: string
  }>
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Draft and preview your estate plan',
    price: 0,
    yearlyPrice: 0,
    period: 'month',
    features: [
      'Draft and preview wills',
      'Estate Readiness Score',
      'On-chain document verification checker', 
      'Basic AI legal guidance (5 questions/day)',
      'Access to compliance database',
      'Community support forum'
    ],
    limitations: [
      'Cannot export PDFs',
      'No document signing',
      'No blockchain proof',
      'Limited AI interactions'
    ]
  },
  {
    id: 'founding',
    name: 'Founding Member',
    description: 'Limited time - First 200 users only',
    price: 129,
    yearlyPrice: 129,
    period: 'year',
    founding: true,
    features: [
      'Everything in Core plan for 12 months',
      'Lock renewal at $199/year forever',
      'Founding member badge',
      'Direct feedback line to founder',
      'Early access to new features',
      'Grandfathered pricing for life'
    ]
  },
  {
    id: 'core',
    name: 'Core',
    description: 'Essential estate planning for individuals',
    price: 29,
    yearlyPrice: 199, // 30% annual discount 
    period: 'month',
    popular: true,
    features: [
      'Export professional PDFs',
      'Google OAuth sign-in',
      'Blockchain proof for every document',
      'Compliance monitoring (1 state)',
      'Email support (48hr response)',
      'Live Estate Plan basic monitoring',
      'Document version history (3 versions)',
      'AI legal guidance (20 questions/day)'
    ],
    addOns: [
      { name: 'Additional State Monitoring', price: 5, description: 'per state/month' },
      { name: 'Priority Email Support', price: 9, description: '24hr response' }
    ]
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Complete protection for growing families',
    price: 49,
    yearlyPrice: 349, // 30% annual discount
    period: 'month',
    features: [
      'Everything in Core',
      'All 50-state compliance monitoring',
      'Priority support (24hr response)',
      'Live Estate Plan full automation',
      '10 stored document versions',
      'Family account (up to 2 adults)',
      'Advanced AI guidance (50 questions/day)',
      'Automatic update notifications',
      'Multi-state move protection'
    ],
    addOns: [
      { name: 'Additional Family Members', price: 15, description: 'per person/month' },
      { name: 'Legal Review Connect', price: 29, description: 'attorney consultation setup' }
    ]
  },
  {
    id: 'pro',
    name: 'Professional',  
    description: 'For attorneys and estate planning professionals',
    price: 99,
    yearlyPrice: 799, // 33% annual discount
    period: 'month',
    features: [
      'Everything in Plus',
      'Client management system',
      'Shared client vault access',
      'White-label document options',
      'Bulk document processing',
      'API access for integrations',
      'Dedicated account manager',
      'Custom compliance rule alerts',
      'Professional referral network',
      'Usage analytics dashboard'
    ],
    addOns: [
      { name: 'Additional Client Folders', price: 5, description: 'per client/month (after 50)' },
      { name: 'White-label Branding', price: 199, description: 'one-time setup' },
      { name: 'Custom API Integration', price: 499, description: 'one-time setup' }
    ]
  },
  {
    id: 'enterprise', 
    name: 'Enterprise',
    description: 'For large organizations and law firms',
    price: 299,
    yearlyPrice: 2399, // 33% annual discount  
    period: 'month',
    features: [
      'Everything in Professional',
      'Unlimited client accounts',
      'Advanced user permissions',
      'SSO integration (SAML/OAuth)',
      'Custom workflows and automation',
      'Dedicated infrastructure', 
      'SLA guarantees (99.9% uptime)',
      'Custom training and onboarding',
      'Priority feature development',
      'Advanced security controls'
    ],
    addOns: [
      { name: 'Custom Feature Development', price: 2500, description: 'per feature' },
      { name: 'Dedicated Support Engineer', price: 1999, description: 'per month' }
    ]
  }
]

const UNIVERSAL_ADDONS = [
  {
    name: 'Remote Online Notary Session',
    price: 19,
    description: 'Platform fee + notary cost passed through',
    category: 'notarization'
  },
  {
    name: 'Extra Document Storage',
    price: 5,
    description: 'Per 10GB/month beyond plan limits',
    category: 'storage'
  },
  {
    name: 'Legal Review Referral',
    price: 29,
    description: 'Connect with vetted attorneys (paid when consultation booked)',
    category: 'legal'
  },
  {
    name: 'Expedited Processing',
    price: 25,
    description: 'Priority queue for all document generation',
    category: 'processing'
  },
  {
    name: 'Document Translation',
    price: 49,
    description: 'Professional translation (Spanish, others available)',
    category: 'translation'
  }
]

export default function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [showAddOns, setShowAddOns] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return

    setLoading(planId)
    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planId,
          billing_period: billingPeriod
        })
      })
      
      const data = await response.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert('Checkout failed. Please try again.')
      }
    } catch (error) {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return 'Free'
    if (plan.founding) return '$129 once'
    
    const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price
    const period = billingPeriod === 'yearly' ? '/year' : '/month'
    
    return `$${price}${period}`
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price === 0 || plan.founding) return null
    const monthlyTotal = plan.price * 12
    const savings = monthlyTotal - plan.yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { amount: savings, percentage }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Estate Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Free to try. Pay to export, sign, and prove. Your documents stay current as laws and life change.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => {
            const savings = getSavings(plan)
            const isFoundingVisible = plan.founding // Show founding member plan
            
            if (plan.founding && !isFoundingVisible) return null

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-6 ${
                  plan.popular
                    ? 'border-blue-500 shadow-xl scale-105'
                    : plan.founding
                    ? 'border-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'
                    : 'border-gray-200 shadow-lg hover:shadow-xl transition-shadow'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Founding Badge */}
                {plan.founding && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Limited Time
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {getDisplayPrice(plan)}
                    </span>
                    {savings && billingPeriod === 'yearly' && (
                      <div className="text-sm text-green-600 font-medium">
                        Save ${savings.amount} ({savings.percentage}%)
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations for Free Plan */}
                {plan.limitations && (
                  <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Limitations:</p>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.id === 'free'
                      ? 'bg-gray-100 text-gray-700 cursor-default'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.founding
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {loading === plan.id ? (
                    'Processing...'
                  ) : plan.id === 'free' ? (
                    'Start Free'
                  ) : plan.founding ? (
                    'Claim Founding Spot'
                  ) : (
                    `Start ${plan.name}`
                  )}
                </button>

                {/* Add-ons Link */}
                {plan.addOns && plan.addOns.length > 0 && (
                  <button
                    onClick={() => setShowAddOns(showAddOns === plan.id ? null : plan.id)}
                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAddOns === plan.id ? 'Hide' : 'View'} Add-ons →
                  </button>
                )}

                {/* Add-ons Dropdown */}
                {showAddOns === plan.id && plan.addOns && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg space-y-2">
                    {plan.addOns.map((addon, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                          <div className="text-xs text-gray-600">{addon.description}</div>
                        </div>
                        <div className="text-sm font-bold text-blue-600">+${addon.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Universal Add-ons */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Add-on Services (Available with All Paid Plans)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSAL_ADDONS.map((addon, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                  <span className="text-lg font-bold text-blue-600">${addon.price}</span>
                </div>
                <p className="text-sm text-gray-600">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Offers */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🚀 Launch Offers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">First Month Special</h4>
              <p className="text-sm text-gray-600">Get Core plan for just <span className="font-bold text-green-600">$9</span> your first month</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Refer a Friend</h4>
              <p className="text-sm text-gray-600">Earn one free notarization credit for each successful referral</p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>✅ <strong>14-day money-back guarantee</strong> on your first payment</p>
          <p>💰 <strong>30% discount</strong> on all annual plans</p>
          <p>🔒 All notarization fees shown upfront with no hidden costs</p>
          <p>📞 Cancel anytime with no cancellation fees</p>
        </div>
      </div>
    </section>
  )
}
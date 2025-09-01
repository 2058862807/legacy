'use client'
import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../../components/Layout/Navbar'
import Footer from '../../../components/Footer'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // Verify payment status
      fetch(`/api/payments/status?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setPaymentStatus(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Payment verification error:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [sessionId])

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to NexteraEstate. Your subscription is now active.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
        ) : paymentStatus ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">NexteraEstate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">$49/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            You can now access all NexteraEstate features including:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900">Will Builder</h3>
              <p className="text-sm text-gray-600">Create comprehensive wills</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Legal guidance and support</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-2xl mb-2">🔗</div>
              <h3 className="font-semibold text-gray-900">Blockchain Security</h3>
              <p className="text-sm text-gray-600">Document verification</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/will"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Start Creating Your Will
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </main>
      }>
        <CheckoutSuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
}
'use client'
import React from 'react'
import Link from 'next/link'

export default function HomeCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to secure your legacy?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands who have created their estate plan with NexteraEstate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/start"
            className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start your plan
          </Link>
          <Link
            href="#pricing"
            className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
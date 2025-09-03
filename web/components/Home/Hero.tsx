'use client'
import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build a state compliant will in 12 minutes
          </h1>
          
          {/* Subhead */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start free. Pay when you download. Works in all 50 states.
          </p>
          
          {/* Explainer bullets */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <span className="text-gray-700 font-medium">Plan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <span className="text-gray-700 font-medium">Notarize</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <span className="text-gray-700 font-medium">Comply</span>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start your plan
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
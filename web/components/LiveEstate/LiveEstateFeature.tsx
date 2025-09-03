'use client'
import React from 'react'
import Link from 'next/link'

export default function LiveEstateFeature() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Revolutionary Technology</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Live Estate Plan
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
            Your documents stay current as laws and life change
          </p>
          
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            The first estate planning system that automatically monitors 50-state legal changes 
            and updates your documents with blockchain-verified audit trails.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-3">Never outdated</h3>
            <p className="text-blue-100">
              Your plan updates when laws change. We show what changed and why.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-white mb-3">Automatic updates</h3>
            <p className="text-blue-100">
              Review and accept changes in one click. Keep everything current.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-white mb-3">Blockchain audit</h3>
            <p className="text-blue-100">
              Each version is notarized with a public hash. <a href="https://polygonscan.com/tx/0x0000000000000000000000000000000000000000000000000000000000000000" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-blue-200">View sample</a>
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">How It Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Create your profile</h4>
              <p className="text-sm text-blue-200">
                Answer a few questions about you and your family.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Build your plan</h4>
              <p className="text-sm text-blue-200">
                We assemble the right documents for your state.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400/30">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Review and approve</h4>
              <p className="text-sm text-blue-200">
                You control every clause before you sign.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-400/30">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Download and share</h4>
              <p className="text-sm text-blue-200">
                Get a PDF package and a secure online copy.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-white/20">
            <p className="text-lg text-blue-100 mb-4">
              "Finally, an estate plan that doesn't go stale! Live Estate Plan caught a major law change in Texas 
              that would have invalidated my will. The automatic update saved my family from months of legal headaches."
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">James Davidson</div>
                <div className="text-sm text-blue-200">Houston, TX - Beta User</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">
              Ready for an estate plan that never gets outdated?
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/start"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start your plan
              </Link>
              <Link
                href="#pricing"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View pricing
              </Link>
            </div>
            
            <p className="text-sm text-blue-200 mt-4">
              Included with all NexteraEstate plans • 50-state monitoring • Blockchain verified
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
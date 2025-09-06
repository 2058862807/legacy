'use client'
import React from 'react'
import Navbar from '../../../components/Layout/Navbar'
import Footer from '../../../components/Footer'
import Bot from '../../../components/Bot'

export default function GriefSupport() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white">🫂</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Grief Support & Compassionate Care
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              You don't have to navigate this difficult time alone. Our compassionate AI support is here to listen and help.
            </p>
          </div>

          {/* Crisis Resources Banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-3">Immediate Crisis Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-red-800">National Suicide Prevention Lifeline</p>
                    <p className="text-red-700">Call or text: <a href="tel:988" className="underline font-medium">988</a></p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Crisis Text Line</p>
                    <p className="text-red-700">Text HOME to: <a href="sms:741741" className="underline font-medium">741741</a></p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">National Alliance on Mental Illness</p>
                    <p className="text-red-700">Call: <a href="tel:1-800-950-6264" className="underline font-medium">1-800-950-6264</a></p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Emergency Services</p>
                    <p className="text-red-700">Call: <a href="tel:911" className="underline font-medium">911</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* How We Help */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How Our Grief Support Helps</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">24/7 Emotional Support</h3>
                    <p className="text-gray-600 text-sm">
                      Our AI companion is trained to provide compassionate responses and emotional support whenever you need it, day or night.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional Resource Connection</h3>
                    <p className="text-gray-600 text-sm">
                      When appropriate, our AI can connect you with professional grief counselors, therapists, and support groups in your area.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Safe & Private Space</h3>
                    <p className="text-gray-600 text-sm">
                      Share your feelings in a judgment-free environment. Our conversations are private and secure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Coping Strategies & Resources</h3>
                    <p className="text-gray-600 text-sm">
                      Learn healthy coping mechanisms and get access to helpful resources for managing grief and loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* When to Reach Out */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">When to Reach Out</h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  It's normal to experience a wide range of emotions during difficult times. Consider reaching out to our Grief Support AI if you're experiencing:
                </p>
                
                <div className="space-y-3">
                  {[
                    'Feeling overwhelmed by estate planning decisions',
                    'Recently lost a loved one',
                    'Struggling with the emotional aspects of end-of-life planning',
                    'Need someone to listen without judgment',
                    'Looking for coping strategies',
                    'Want information about grief counseling resources',
                    'Feeling isolated or alone in your grief journey'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-pink-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-purple-800">
                      <strong>Remember:</strong> Our AI provides emotional support and resources, but it's not a replacement for professional mental health care. If you're experiencing thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Chat CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to talk?</h3>
              <p className="text-purple-100 mb-6 text-lg">
                Our compassionate AI support is here for you. Start a conversation whenever you're ready.
              </p>
              <div className="flex flex-col items-center">
                <p className="text-purple-100 text-sm mb-4">
                  Look for the floating support chat in the bottom-right corner ↘️
                </p>
                <div className="flex items-center space-x-2 bg-purple-500 px-4 py-2 rounded-lg">
                  <span className="text-2xl">🫂</span>
                  <span className="font-medium">Grief Support Chat Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Grief Support Bot */}
      <Bot type="grief" />
    </>
  )
}
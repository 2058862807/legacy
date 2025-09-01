'use client'
import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import Footer from '../../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: August 31, 2025
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using NexteraEstate's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NexteraEstate provides an online platform for estate planning, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Will and trust creation tools</li>
              <li>State-specific legal compliance guidance</li>
              <li>AI-powered legal assistance</li>
              <li>Document storage and management</li>
              <li>Blockchain-based notarization services</li>
              <li>Payment processing for subscriptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ IMPORTANT LEGAL NOTICE</p>
              <p className="text-yellow-700 leading-relaxed">
                NexteraEstate is a technology platform that provides tools and information for estate planning. We are NOT a law firm and do not provide legal advice. Our services do not create an attorney-client relationship. All information is provided for educational purposes only.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              You should consult with a qualified attorney in your jurisdiction for legal advice specific to your situation. Laws vary by state and individual circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Use the service only for lawful purposes</li>
              <li>Maintain the security of your account credentials</li>
              <li>Review all generated documents with legal counsel</li>
              <li>Comply with applicable state and federal laws</li>
              <li>Not share your account access with others</li>
              <li>Report any suspected security breaches immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Monthly subscription fee of $49 per month</li>
              <li>Payments processed securely through Stripe</li>
              <li>Automatic renewal unless cancelled</li>
              <li>30-day money-back guarantee for new subscribers</li>
              <li>Cancellation effective at end of current billing period</li>
              <li>No refunds for partial months after 30-day period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content, features, and functionality of NexteraEstate are owned by NexteraEstate LLC and protected by copyright, trademark, and other intellectual property laws. Your documents and personal information remain your property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXTERAESTATE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING FROM YOUR USE OF OUR SERVICES.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blockchain Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our blockchain notarization services store document hashes on the Polygon network. This provides timestamped proof of document existence but does not constitute legal notarization in all jurisdictions. Check your state's requirements for valid notarization.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may suspend or terminate your account for violation of these terms. You may cancel your subscription at any time through your account settings. Upon termination, you retain access to download your documents for 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These terms are governed by the laws of the State of Alabama. Any disputes shall be resolved in the courts of Tuscaloosa County, Alabama.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><strong>NexteraEstate LLC</strong></p>
              <p className="text-gray-700">4105 D.T. James Parkway</p>
              <p className="text-gray-700">Tuscaloosa, Alabama 35404</p>
              <p className="text-gray-700">Email: <a href="mailto:support@nexteraestate.com" className="text-blue-600 hover:text-blue-800">support@nexteraestate.com</a></p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
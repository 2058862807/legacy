'use client'
import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import Footer from '../../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: August 31, 2025
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NexteraEstate LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our estate planning platform and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Google account information (when using Google Sign-In)</li>
              <li>Estate planning details (beneficiaries, assets, wishes)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Document uploads and generated legal documents</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>IP address and browser information</li>
              <li>Usage data and interaction patterns</li>
              <li>Blockchain transaction hashes (for notarization)</li>
              <li>Session data and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide estate planning services and document generation</li>
              <li>Process payments and manage subscriptions</li>
              <li>Ensure compliance with state-specific legal requirements</li>
              <li>Provide AI-powered legal guidance and support</li>
              <li>Communicate important updates and notifications</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Encrypted storage of sensitive documents and information</li>
              <li>Secure authentication through Google OAuth</li>
              <li>PCI-compliant payment processing through Stripe</li>
              <li>Blockchain-based document verification on Polygon network</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Stripe for payments, Google for authentication</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              <li><strong>Blockchain:</strong> Document hashes (not content) stored on public blockchain</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Access, update, or delete your personal information</li>
              <li>Download your documents and data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request data portability</li>
              <li>File complaints with relevant authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Estate planning documents are typically retained for 7 years after account closure, as required by legal standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or your data, please contact us:
            </p>
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
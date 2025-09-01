import React from 'react'
import Link from 'next/link'
import NexteraLogo from './NexteraLogo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <NexteraLogo size="md" />
              <span className="text-xl font-bold">NexteraEstate™</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Estate planning made simple. Create your plan, notarize on Polygon, meet your state rules.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>NexteraEstate LLC</p>
              <p>4105 41st Ave.</p>
              <p>Northport, Alabama 35473</p>
              <p>
                <a href="mailto:support@nexteraestate.com" className="hover:text-white transition-colors">
                  support@nexteraestate.com
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/will" className="text-gray-300 hover:text-white transition-colors">
                  Will Builder
                </Link>
              </li>
              <li>
                <Link href="/vault" className="text-gray-300 hover:text-white transition-colors">
                  Document Vault
                </Link>
              </li>
              <li>
                <Link href="/notary" className="text-gray-300 hover:text-white transition-colors">
                  Blockchain Notary
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-300 hover:text-white transition-colors">
                  Compliance Center
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Legal & Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@nexteraestate.com" className="text-gray-300 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 NexteraEstate™. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-green-400 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                SSL Secured
              </span>
              <span className="text-blue-400 text-sm flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Blockchain Verified
              </span>
              <span className="text-purple-400 text-sm flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
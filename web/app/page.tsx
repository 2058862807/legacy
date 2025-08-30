import Link from 'next/link'
import Bot from '../components/Bot'

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NexteraEstate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure estate planning with AI assistance, blockchain notarization, and seamless payments
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-3">
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-2">Estate Planning</h3>
            <p className="text-gray-600">
              Comprehensive will and trust creation with legal compliance checking
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">Blockchain Notarization</h3>
            <p className="text-gray-600">
              Secure document timestamps on Polygon blockchain for immutable proof
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Assistance</h3>
            <p className="text-gray-600">
              Smart guidance through estate planning with personalized recommendations
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Estate Plan Today</h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of families who have secured their legacy with NexteraEstate
          </p>
          <Link href="/login" className="btn-primary text-lg px-8 py-3">
            Sign Up Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                NexteraEstate
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Secure your family's future with cutting-edge estate planning technology, AI guidance, and blockchain security.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-green-400">🔒</span>
                  <span className="text-sm">Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-blue-400">🔗</span>
                  <span className="text-sm">Blockchain Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/notary" className="text-gray-300 hover:text-white transition-colors">
                    Blockchain Notary
                  </Link>
                </li>
                <li>
                  <Link href="/vault" className="text-gray-300 hover:text-white transition-colors">
                    Document Vault
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
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
                  <Link href="/security" className="text-gray-300 hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-gray-300 hover:text-white transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 NexteraEstate. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-400 text-sm">
                🇺🇸 United States
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Bot Components */}
      <Bot type="help" />
    </main>
  )
}
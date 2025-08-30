import Link from 'next/link'
import Bot from '../components/Bot'
import WalletButton from '../components/Wallet/WalletButton'

export default function Home() {
  return (
    <div>
      <main className="max-w-5xl mx-auto p-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NexteraEstate
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Secure your legacy with cutting-edge technology, AI guidance, and blockchain security.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/will" className="btn-primary">
              Get Started
            </Link>
            <Link href="/pricing" className="btn-secondary">
              View Pricing
            </Link>
            <WalletButton />
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>SSL Secured</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Blockchain Verified</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>MetaMask Ready</span>
            </span>
          </div>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/features/estate-planning" className="card text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Estate Planning</h3>
            <p className="text-gray-600">
              Comprehensive will and trust creation with legal compliance checking
            </p>
            <div className="mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More →
            </div>
          </Link>
          
          <Link href="/features/blockchain-notarization" className="card text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🔗</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Blockchain Notarization</h3>
            <p className="text-gray-600">
              Secure document timestamps on Polygon blockchain for immutable proof
            </p>
            <div className="mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More →
            </div>
          </Link>
          
          <Link href="/features/ai-assistance" className="card text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">AI Assistance</h3>
            <p className="text-gray-600">
              Smart guidance through estate planning with personalized recommendations
            </p>
            <div className="mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More →
            </div>
          </Link>
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
    </div>
  )
}
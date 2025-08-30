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
              
              {/* Social Media Links */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-200">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/nexteraestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Follow us on Facebook"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://twitter.com/nexteraestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-black rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Follow us on X (Twitter)"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://linkedin.com/company/nexteraestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Follow us on LinkedIn"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://instagram.com/nexteraestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all group"
                    aria-label="Follow us on Instagram"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C8.396 0 7.927.01 7.075.048 2.281.207.207 2.281.048 7.075.01 7.927 0 8.396 0 12.017c0 3.624.01 4.09.048 4.943.159 4.794 2.233 6.868 7.027 7.027.853.038 1.32.048 4.943.048 3.624 0 4.09-.01 4.943-.048 4.794-.159 6.868-2.233 7.027-7.027.038-.853.048-1.32.048-4.943 0-3.624-.01-4.09-.048-4.943C23.793 2.233 21.719.159 16.925.048 16.073.01 15.604 0 12.017 0zM12.017 2.17c3.557 0 3.978.01 5.38.048 4.265.195 5.934 1.87 6.129 6.129.038 1.402.048 1.823.048 5.38s-.01 3.978-.048 5.38c-.195 4.265-1.87 5.934-6.129 6.129-1.402.038-1.823.048-5.38.048s-3.978-.01-5.38-.048c-4.265-.195-5.934-1.87-6.129-6.129-.038-1.402-.048-1.823-.048-5.38s.01-3.978.048-5.38c.195-4.265 1.87-5.934 6.129-6.129 1.402-.038 1.823-.048 5.38-.048zm0 3.68c-3.701 0-6.7 2.999-6.7 6.7s2.999 6.7 6.7 6.7 6.7-2.999 6.7-6.7-2.999-6.7-6.7-6.7zm0 11.05c-2.402 0-4.35-1.948-4.35-4.35s1.948-4.35 4.35-4.35 4.35 1.948 4.35 4.35-1.948 4.35-4.35 4.35zm8.538-11.338c0-.864-.701-1.565-1.565-1.565s-1.565.701-1.565 1.565.701 1.565 1.565 1.565 1.565-.701 1.565-1.565z"/>
                    </svg>
                  </a>
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
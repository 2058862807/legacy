import Link from 'next/link'
import Bot from '../components/Bot'

export default function Home() {
  return (
    <>
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

      {/* Bot Components */}
      <Bot type="help" />
    </>
  )
}
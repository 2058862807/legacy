import Link from 'next/link'

export const metadata = {
  title: 'Estate Planning Features - NexteraEstate',
  description: 'Comprehensive will and trust creation with 50-state legal compliance checking, AI guidance, and professional-grade document management.',
}

export default function EstatePlanningPage() {
  return (
    <main className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-6">🏛️</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Estate Planning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive will and trust creation with legal compliance checking across all 50 states
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-3">Will Builder</h3>
          <p className="text-gray-600 mb-4">
            Step-by-step guided will creation with intelligent questionnaires and real-time legal compliance validation.
          </p>
          <Link href="/will" className="text-blue-600 hover:text-blue-800 font-medium">
            Start Will Builder →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">⚖️</div>
          <h3 className="text-lg font-semibold mb-3">50-State Compliance</h3>
          <p className="text-gray-600 mb-4">
            Real-time legal requirement checking across all US jurisdictions with professional citations and witness requirements.
          </p>
          <Link href="/compliance" className="text-blue-600 hover:text-blue-800 font-medium">
            View Compliance →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🗂️</div>
          <h3 className="text-lg font-semibold mb-3">Document Vault</h3>
          <p className="text-gray-600 mb-4">
            Secure document storage and management with version control, beneficiary access, and blockchain timestamping.
          </p>
          <Link href="/vault" className="text-blue-600 hover:text-blue-800 font-medium">
            Access Vault →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">👥</div>
          <h3 className="text-lg font-semibold mb-3">Beneficiary Management</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive beneficiary tracking with relationship mapping, contact management, and inheritance distribution planning.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold mb-3">Pet Trusts</h3>
          <p className="text-gray-600 mb-4">
            Specialized pet trust creation with state-specific legal frameworks and caregiver appointment systems.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-3">Legal Templates</h3>
          <p className="text-gray-600 mb-4">
            Professional-grade legal document templates customized for your state's requirements and personal circumstances.
          </p>
        </div>
      </div>

      {/* Professional Standards */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Standards</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🎓 Legal Expertise</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Attorney-reviewed templates and procedures</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>State-specific legal requirement validation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Professional legal citations and references</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🔒 Security & Privacy</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Bank-level encryption for all documents</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Secure multi-factor authentication</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>HIPAA-compliant data handling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Answer Questions</h3>
            <p className="text-sm text-gray-600">Complete our intelligent questionnaire about your assets, family, and wishes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">AI Optimization</h3>
            <p className="text-sm text-gray-600">Our AI analyzes your responses and suggests optimal estate planning strategies</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Legal Compliance</h3>
            <p className="text-sm text-gray-600">Automatic validation against your state's legal requirements and witness rules</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Secure Storage</h3>
            <p className="text-sm text-gray-600">Documents stored securely with blockchain timestamping and beneficiary access</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Legacy?</h2>
        <p className="text-lg opacity-90 mb-6">
          Join thousands of families who trust NexteraEstate with their most important documents
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/will" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Start Your Will
          </Link>
          <Link href="/login" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </div>
    </main>
  )
}
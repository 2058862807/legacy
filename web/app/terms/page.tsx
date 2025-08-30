import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexteraEstate
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 text-lg">
              Last updated: August 29, 2024
            </p>
          </div>

          <div className="prose max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Agreement to Terms</h3>
              <p className="text-blue-800">
                By accessing and using NexteraEstate, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
              <p className="mb-4">NexteraEstate provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Estate Planning Tools:</strong> Will creation, trust management, and legal document generation</li>
                <li><strong>Document Security:</strong> Blockchain-based notarization and secure storage</li>
                <li><strong>AI Guidance:</strong> Personalized estate planning assistance and recommendations</li>
                <li><strong>Compliance Checking:</strong> State-specific legal requirement verification</li>
                <li><strong>Digital Vault:</strong> Encrypted storage for important documents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts & Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Eligibility Requirements</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>You must be at least 18 years of age</li>
                <li>You must have legal capacity to enter into contracts</li>
                <li>You must provide accurate and complete information</li>
                <li>You must comply with all applicable laws and regulations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>You are liable for all activities that occur under your account</li>
                <li>We may suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Disclaimer</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important Legal Notice</h3>
                <p className="text-yellow-800">
                  NexteraEstate provides tools and technology for estate planning but does not provide legal advice. Always consult with a qualified attorney for legal matters.
                </p>
              </div>

              <ul className="list-disc pl-6 space-y-2">
                <li>Our platform generates documents based on your inputs but cannot guarantee legal validity</li>
                <li>Estate planning laws vary by state and change over time</li>
                <li>We strongly recommend having documents reviewed by qualified legal counsel</li>
                <li>We are not responsible for the legal sufficiency of documents created using our platform</li>
                <li>AI guidance is for informational purposes only and is not legal advice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription & Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing & Billing</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                <li>Prices are subject to change with 30 days' notice</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>You authorize us to charge your payment method for all fees</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancellation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of your current billing period</li>
                <li>You retain access to your data for 90 days after cancellation</li>
                <li>We may suspend service for non-payment after 15 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Uses</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Personal estate planning and document management</li>
                <li>Sharing documents with designated beneficiaries and professionals</li>
                <li>Using AI features for planning guidance and recommendations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Uses</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating fraudulent or illegal documents</li>
                <li>Attempting to access other users' accounts or data</li>
                <li>Using the platform for money laundering or tax evasion</li>
                <li>Reverse engineering or copying our technology</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Harassing other users or our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Rights</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>NexteraEstate owns all rights to our platform, technology, and content</li>
                <li>Our trademarks, logos, and brand elements are protected</li>
                <li>You may not copy, modify, or distribute our intellectual property</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of documents and content you create</li>
                <li>You grant us a license to process and store your content</li>
                <li>You can export your data at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data & Privacy</h2>
              <p className="mb-4">Your privacy is important to us. Our data practices are governed by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our comprehensive <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                <li>Industry-standard security measures and encryption</li>
                <li>Compliance with applicable data protection laws</li>
                <li>Blockchain immutability for notarized documents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">🚨 Important Limitation</h3>
                <p className="text-red-800">
                  Our liability is limited to the greatest extent permitted by law. Please read this section carefully.
                </p>
              </div>

              <ul className="list-disc pl-6 space-y-2">
                <li>We provide our platform "as is" without warranties of any kind</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>Our total liability is limited to the amount you paid in the last 12 months</li>
                <li>We are not liable for indirect, consequential, or punitive damages</li>
                <li>Some jurisdictions do not allow liability limitations, so these may not apply to you</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless NexteraEstate from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Your use of our platform or services</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit or create using our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
              <p className="mb-4">These terms are governed by the laws of California, without regard to conflict of law principles.</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Arbitration</h3>
              <p className="mb-4">Most disputes can be resolved informally. If not, they will be resolved through binding arbitration rather than in court, except for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Small claims court actions</li>
                <li>Intellectual property disputes</li>
                <li>Emergency injunctive relief</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="mb-4">We may modify these Terms of Service at any time. When we do:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will post the updated terms on our website</li>
                <li>We will notify you via email or platform notification</li>
                <li>Continued use constitutes acceptance of new terms</li>
                <li>If you disagree with changes, you may terminate your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Right to Terminate</h3>
              <p className="mb-4">You may terminate your account at any time by contacting support or using account settings.</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Right to Terminate</h3>
              <p className="mb-4">We may suspend or terminate your account if you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate these Terms of Service</li>
                <li>Fail to pay subscription fees</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Pose a security risk to our platform</li>
              </ul>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="mb-4">Questions about these Terms of Service? Contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@nexteraestate.com</p>
                  <p><strong>Mail:</strong> NexteraEstate Legal Department<br />123 Estate Planning Blvd<br />Suite 100<br />San Francisco, CA 94105</p>
                  <p><strong>Phone:</strong> 1-800-NEXTERA (1-800-639-8372)</p>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Effective Date:</strong> These terms become effective when you first use our service and remain in effect until terminated.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
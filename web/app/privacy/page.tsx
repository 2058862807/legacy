import Link from 'next/link'

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">
              Last updated: August 29, 2024
            </p>
          </div>

          <div className="prose max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
              <p className="text-blue-800">
                At NexteraEstate, we understand the sensitive nature of estate planning. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our services.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name, email address, phone number, and mailing address</li>
                <li>Date of birth and Social Security Number (encrypted)</li>
                <li>Financial information for estate planning purposes</li>
                <li>Beneficiary and heir information</li>
                <li>Legal documents you upload to our platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>IP address, browser type, and device information</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Blockchain transaction records (public)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Estate Planning Services:</strong> Create wills, trusts, and other legal documents</li>
                <li><strong>Document Security:</strong> Blockchain notarization and secure storage</li>
                <li><strong>AI Assistance:</strong> Personalized guidance and recommendations</li>
                <li><strong>Compliance:</strong> Verify legal requirements in your jurisdiction</li>
                <li><strong>Communication:</strong> Send updates, notifications, and support</li>
                <li><strong>Payment Processing:</strong> Process subscription and service payments</li>
                <li><strong>Platform Improvement:</strong> Analyze usage to enhance our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security & Protection</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">🔒 Bank-Level Security</h3>
                <p className="text-green-800">
                  We employ industry-leading security measures to protect your sensitive information.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Security Measures</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Encryption:</strong> 256-bit SSL encryption for all data transmission</li>
                <li><strong>Storage:</strong> AES-256 encryption for data at rest</li>
                <li><strong>Access Control:</strong> Multi-factor authentication and role-based access</li>
                <li><strong>Blockchain:</strong> Immutable document timestamps on Polygon network</li>
                <li><strong>Compliance:</strong> SOC 2 Type II and GDPR compliant infrastructure</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Designated Recipients:</strong> People you explicitly authorize to receive information</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                <li><strong>Emergency Situations:</strong> To prevent harm to you or others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Access & Portability</h4>
                  <p className="text-sm text-gray-600">Request a copy of your personal data in a portable format</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Correction</h4>
                  <p className="text-sm text-gray-600">Update or correct inaccurate personal information</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-sm text-gray-600">Request deletion of your personal data (subject to legal retention)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Opt-Out</h4>
                  <p className="text-sm text-gray-600">Unsubscribe from marketing communications</p>
                </div>
              </div>

              <p>To exercise these rights, contact us at <strong>privacy@nexteraestate.com</strong></p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies & Tracking</h2>
              <p className="mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Enable social media features</li>
                <li>Serve targeted advertisements (with your consent)</li>
              </ul>
              <p className="mt-4">You can control cookie preferences through your browser settings.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain your information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain blockchain records (permanent by design)</li>
              </ul>
              <p className="mt-4">Upon account deletion, we will securely delete your data within 90 days, except where retention is required by law.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Transfers</h2>
              <p>
                If you access our services from outside the United States, your information may be transferred to and processed in the US. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we discover that we have collected information from a child, we will promptly delete it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices in our platform</li>
              </ul>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@nexteraestate.com</p>
                  <p><strong>Mail:</strong> NexteraEstate Privacy Office<br />123 Estate Planning Blvd<br />Suite 100<br />San Francisco, CA 94105</p>
                  <p><strong>Phone:</strong> 1-800-NEXTERA (1-800-639-8372)</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
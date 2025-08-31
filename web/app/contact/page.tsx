'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import LegalDisclaimer from '../../components/Legal/LegalDisclaimer'

export default function ContactPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'legal', label: 'Legal Questions' },
    { value: 'documents', label: 'Document Issues' },
    { value: 'account', label: 'Account Management' }
  ]

  const priorities = [
    { value: 'low', label: 'Low - General question' },
    { value: 'normal', label: 'Normal - Standard inquiry' },
    { value: 'high', label: 'High - Urgent issue' },
    { value: 'critical', label: 'Critical - System down' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.message) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form')
      }
      
      const result = await response.json()
      setSuccess(`Thank you! Your support ticket #${result.ticket_id} has been created. We'll respond within 24 hours.`)
      
      // Reset form
      setFormData({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        subject: '',
        category: 'general',
        priority: 'normal',
        message: ''
      })
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit contact form')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
          <p className="text-gray-600">
            Get help with your NexteraEstate™ account, documents, or legal questions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Submit a Support Request</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-400 mr-3">⚠️</div>
                    <div>
                      <h4 className="text-red-800 font-semibold">Error</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-green-400 mr-3">✅</div>
                    <div>
                      <h4 className="text-green-800 font-semibold">Success</h4>
                      <p className="text-green-700 text-sm">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => updateField('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide detailed information about your issue, including any error messages, steps you've taken, and what you expected to happen."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Submitting...' : 'Submit Support Request'}
                </button>
              </form>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-8">
              <LegalDisclaimer type="general" />
            </div>
          </div>

          {/* Support Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Response Times */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Critical Issues</span>
                  <span className="text-sm font-medium text-red-600">2-4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Priority</span>
                  <span className="text-sm font-medium text-orange-600">8-12 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Normal Issues</span>
                  <span className="text-sm font-medium text-blue-600">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">General Questions</span>
                  <span className="text-sm font-medium text-gray-600">48 hours</span>
                </div>
              </div>
            </div>

            {/* Alternative Support */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Other Ways to Get Help</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 text-xl">🤖</div>
                  <div>
                    <h4 className="font-medium">Esquire AI</h4>
                    <p className="text-sm text-gray-600">Get instant answers to common estate planning questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-600 text-xl">📚</div>
                  <div>
                    <h4 className="font-medium">Knowledge Base</h4>
                    <p className="text-sm text-gray-600">Browse articles and guides (Coming Soon)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-purple-600 text-xl">📧</div>
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-gray-600">support@nexteraestate.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Legal Emergency?</h3>
              <p className="text-sm text-red-700 mb-3">
                For urgent legal matters, please contact a licensed attorney immediately. 
                NexteraEstate™ provides tools and information but is not a law firm.
              </p>
              <p className="text-xs text-red-600">
                Call 911 for life-threatening emergencies
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
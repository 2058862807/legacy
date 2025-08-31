'use client'
import React, { useState, useEffect } from 'react'
import ComplianceStatus from '../../components/Compliance/ComplianceStatus'
import { apiFetch } from '../../lib/api'

interface ComplianceRule {
  state: string
  doc_type: string
  notarization_required: boolean
  witnesses_required: number
  ron_allowed: boolean
  esign_allowed: boolean
  recording_supported: boolean
  pet_trust_allowed: boolean
  citations: string[]
  updated_at: string
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
]

const DOC_TYPES = [
  { value: 'will', label: 'Will' },
  { value: 'pet_trust', label: 'Pet Trust' },
  { value: 'notarization', label: 'Notarization' },
  { value: 'esignature', label: 'E-Signature' }
]

export default function CompliancePage() {
  const [selectedState, setSelectedState] = useState('CA')
  const [selectedDocType, setSelectedDocType] = useState('will')
  const [rule, setRule] = useState<ComplianceRule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [complianceEnabled, setComplianceEnabled] = useState(true)

  // Check if compliance is enabled
  useEffect(() => {
    const checkCompliance = async () => {
      try {
        const response = await apiFetch('/api/health')
        setComplianceEnabled(response.compliance_enabled || false)
      } catch (err) {
        console.error('Failed to check compliance status:', err)
        setComplianceEnabled(false)
      }
    }
    checkCompliance()
  }, [])

  // Fetch compliance rule when state or doc type changes
  useEffect(() => {
    if (!complianceEnabled) return

    const fetchRule = async () => {
      setLoading(true)
      setError('')
      
      try {
        console.log(`Fetching compliance data for ${selectedState} - ${selectedDocType}`)
        const response = await apiFetch<ComplianceRule>(
          `/api/compliance/rules?state=${selectedState}&doc_type=${selectedDocType}`
        )
        console.log('Compliance data received:', response)
        setRule(response)
      } catch (err: any) {
        console.error('Compliance fetch error:', err)
        setError(err.message || 'Failed to fetch compliance data')
        setRule(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRule()
  }, [selectedState, selectedDocType, complianceEnabled])

  if (!complianceEnabled) {
    return (
      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <div className="text-blue-600 text-6xl mb-4">ℹ️</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Compliance Feature</h2>
          <p className="text-blue-800 text-lg mb-6">
            The 50-state compliance feature is currently being configured. 
            This feature will provide real-time legal requirements for estate planning documents across all states.
          </p>
          <div className="bg-white rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Coming Soon:</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Real-time witness requirements by state</li>
              <li>• Notarization and RON availability</li>
              <li>• Electronic signature compliance</li>
              <li>• Pet trust legal framework</li>
              <li>• Legal citations and references</li>
            </ul>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          50-State Compliance Center
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real-time legal requirements for estate planning documents across all US states and DC
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* State Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {US_STATES.map(state => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DOC_TYPES.map(docType => (
                <button
                  key={docType.value}
                  onClick={() => setSelectedDocType(docType.value)}
                  className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedDocType === docType.value
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {docType.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <ComplianceStatus rule={rule} loading={loading} error={error} />

      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Compliance Data</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">📊 Data Sources</h3>
            <p className="text-sm">
              Our compliance data is sourced from official state statutes, probate codes, 
              and legal databases. All information includes proper legal citations for verification.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🔄 Updates</h3>
            <p className="text-sm">
              Compliance requirements are updated regularly as laws change. 
              Each rule shows the last updated date for transparency.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">⚖️ Legal Notice</h3>
            <p className="text-sm">
              This information is for educational purposes. Always consult with a qualified 
              attorney in your jurisdiction for specific legal advice.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎯 Coverage</h3>
            <p className="text-sm">
              Covers all 50 US states plus Washington DC. Includes wills, trusts, 
              notarization requirements, and e-signature compliance.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

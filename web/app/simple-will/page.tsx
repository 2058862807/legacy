'use client'

import { useState } from 'react'

export default function SimpleWillPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    email: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    assetDescription: '',
    assetValue: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setResult(null)

    try {
      // First create user
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name
        })
      })

      if (!userResponse.ok) {
        throw new Error(`User creation failed: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      console.log('User created:', userData)

      // Then create will
      const willData = {
        state: formData.state,
        personal_info: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        beneficiaries: formData.beneficiaryName ? [{
          name: formData.beneficiaryName,
          relationship: formData.beneficiaryRelationship,
          percentage: 100
        }] : [],
        assets: formData.assetDescription ? [{
          type: 'Asset',
          description: formData.assetDescription,
          value: parseFloat(formData.assetValue) || 0
        }] : []
      }

      const willResponse = await fetch(`/api/wills?user_email=${encodeURIComponent(formData.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(willData)
      })

      if (!willResponse.ok) {
        const errorText = await willResponse.text()
        throw new Error(`Will creation failed: ${willResponse.status} - ${errorText}`)
      }

      const willResult = await willResponse.json()
      setResult(willResult)
      console.log('Will created successfully:', willResult)

    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-green-600 mb-6">✅ Will Created Successfully!</h1>
            
            <div className="space-y-4">
              <div>
                <strong>Will ID:</strong> {result.id}
              </div>
              <div>
                <strong>User ID:</strong> {result.user_id}
              </div>
              <div>
                <strong>State:</strong> {result.state}
              </div>
              <div>
                <strong>Completion:</strong> {result.completion_percentage}%
              </div>
              <div>
                <strong>Created:</strong> {new Date(result.created_at).toLocaleString()}
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Success!</h3>
              <p className="text-green-700">
                Your will has been successfully created and stored in the database. 
                This proves that the backend API is working correctly.
              </p>
            </div>

            <button 
              onClick={() => {
                setResult(null)
                setFormData({
                  name: '',
                  address: '',
                  city: '',
                  state: 'CA',
                  zip: '',
                  email: '',
                  beneficiaryName: '',
                  beneficiaryRelationship: '',
                  assetDescription: '',
                  assetValue: ''
                })
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Another Will
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Will - Simple Version</h1>
          <p className="text-gray-600 mb-8">No authentication required - Direct API test</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Beneficiary (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  value={formData.beneficiaryRelationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryRelationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Charity">Charity</option>
                </select>
              </div>
            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Asset (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Savings Account, House, Car"
                  value={formData.assetDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.assetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Will...' : 'Create My Will'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
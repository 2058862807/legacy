'use client'

import { useState } from 'react'

export default function SimpleWillCreator() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    state: 'CA',
    beneficiary_name: '',
    beneficiary_relationship: '',
    asset_description: '',
    asset_value: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First create user
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.full_name,
          provider: 'simple'
        })
      })

      if (!userResponse.ok) {
        throw new Error('Failed to create user')
      }

      // Then create will
      const willData = {
        state: formData.state,
        personal_info: {
          full_name: formData.full_name,
          email: formData.email,
          address: formData.address
        },
        beneficiaries: formData.beneficiary_name ? [{
          name: formData.beneficiary_name,
          relationship: formData.beneficiary_relationship,
          percentage: 100
        }] : [],
        assets: formData.asset_description ? [{
          type: 'general',
          description: formData.asset_description,
          value: parseInt(formData.asset_value) || 0
        }] : [],
        witnesses: [],
        executor: {
          name: formData.beneficiary_name || formData.full_name,
          email: formData.email
        }
      }

      const willResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/wills?user_email=${formData.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(willData)
      })

      if (willResponse.ok) {
        const willResult = await willResponse.json()
        setResult(willResult)
      } else {
        throw new Error('Failed to create will')
      }
    } catch (error) {
      console.error('Will creation error:', error)
      setResult({ error: 'Failed to create will. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Will Creation Result</h1>
          </div>

          {result.error ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200">{result.error}</p>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-200 mb-4">✅ Will Created Successfully!</h2>
              <div className="text-green-100 space-y-2">
                <p><strong>Will ID:</strong> {result.id}</p>
                <p><strong>State:</strong> {result.state}</p>
                <p><strong>Completion:</strong> {result.completion_percentage}%</p>
                <p><strong>Created:</strong> {new Date(result.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Create Another Will
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NexteraEstate™</h1>
          <p className="text-gray-300">Simple Will Creator - Test Version</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St, City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Beneficiary Name</label>
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Relationship</label>
              <input
                type="text"
                name="beneficiary_relationship"
                value={formData.beneficiary_relationship}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Spouse, Child, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Asset Description</label>
              <input
                type="text"
                name="asset_description"
                value={formData.asset_description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bank Account, House, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Asset Value ($)</label>
              <input
                type="number"
                name="asset_value"
                value={formData.asset_value}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? 'Creating Will...' : 'Create My Will'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-300 text-sm">
            This is a simplified will creator for testing purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
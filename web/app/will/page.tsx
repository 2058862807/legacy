'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Link from 'next/link'
import LegalDisclaimer from '../../components/Legal/LegalDisclaimer'

interface Will {
  id: string
  title: string
  status: 'draft' | 'completed' | 'signed' | 'notarized'
  completion_percentage: number
  state: string
  created_at: string
  updated_at: string
}

interface WillDetails {
  id: string
  title: string
  status: string
  completion_percentage: number
  state: string
  personal_info: any
  executors: any[]
  beneficiaries: any[]
  assets: any[]
  bequests: any[]
  guardians: any[]
  special_instructions: string
  witnesses_required: number
  notarization_required: boolean
  witnesses_signed: boolean
  notarized: boolean
}

interface ComplianceInfo {
  witnesses_required: number
  notarization_required: boolean
  ron_allowed: boolean
  citations: string[]
}

export default function WillBuilderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wills, setWills] = useState<Will[]>([])
  const [selectedWill, setSelectedWill] = useState<WillDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWillData, setNewWillData] = useState({
    title: '',
    state: 'CA'
  })
  const [complianceInfo, setComplianceInfo] = useState<ComplianceInfo | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      fetchUserWills()
    }
  }, [status])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'

  const fetchUserWills = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!session?.user?.email) return
      
      const response = await fetch(`/api/wills?user_email=${encodeURIComponent(session.user.email)}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wills: ${response.status}`)
      }
      
      const data = await response.json()
      setWills(data)
      
      // Auto-select the first will if available
      if (data.length > 0 && !selectedWill) {
        await fetchWillDetails(data[0].id)
      }
    } catch (err: any) {
      console.error('Error fetching wills:', err)
      setError(err.message || 'Failed to load wills')
    } finally {
      setLoading(false)
    }
  }

  const fetchWillDetails = async (willId: string) => {
    try {
      if (!session?.user?.email) return
      
      const response = await fetch(`/api/wills/${willId}?user_email=${encodeURIComponent(session.user.email)}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch will details: ${response.status}`)
      }
      
      const willDetails = await response.json()
      setSelectedWill(willDetails)
      
      // Fetch compliance info for the will's state
      await fetchComplianceInfo(willDetails.state)
    } catch (err: any) {
      console.error('Error fetching will details:', err)
      setError(err.message || 'Failed to load will details')
    }
  }

  const fetchComplianceInfo = async (state: string) => {
    try {
      const response = await fetch(`/api/compliance/rules?state=${state}&doc_type=will`, {
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        const compliance = await response.json()
        setComplianceInfo(compliance)
      }
    } catch (err) {
      console.error('Error fetching compliance info:', err)
    }
  }

  const createNewWill = async () => {
    try {
      if (!session?.user?.email || !newWillData.title || !newWillData.state) return
      
      const response = await fetch(`/api/wills?user_email=${encodeURIComponent(session.user.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newWillData.title,
          state: newWillData.state,
          personal_info: {}
        })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create will: ${response.status}`)
      }
      
      const newWill = await response.json()
      
      // Refresh the wills list and select the new will
      await fetchUserWills()
      await fetchWillDetails(newWill.id)
      
      // Reset form
      setNewWillData({ title: '', state: 'CA' })
      setShowCreateForm(false)
    } catch (err: any) {
      console.error('Error creating will:', err)
      setError(err.message || 'Failed to create will')
    }
  }

  const updateWillSection = async (sectionData: any) => {
    try {
      if (!selectedWill || !session?.user?.email) return
      
      const response = await fetch(`/api/wills/${selectedWill.id}?user_email=${encodeURIComponent(session.user.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update will: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Refresh will details to show updated completion percentage
      await fetchWillDetails(selectedWill.id)
    } catch (err: any) {
      console.error('Error updating will:', err)
      setError(err.message || 'Failed to update will')
    }
  }

  if (loading && status === 'loading') {
    return <div className="p-8">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Legal Disclaimer */}
        <LegalDisclaimer type="will" className="mb-8" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Will Builder</h1>
              <p className="text-gray-600">Create and manage your legal will with state-specific compliance</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Will
            </button>
          </div>
        </div>

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

        {/* Create Will Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Create New Will</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will Title
                  </label>
                  <input
                    type="text"
                    value={newWillData.title}
                    onChange={(e) => setNewWillData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., My Last Will and Testament"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your State (for legal compliance)
                  </label>
                  <select
                    value={newWillData.state}
                    onChange={(e) => setNewWillData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                    <option value="DC">District of Columbia</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewWill}
                  disabled={!newWillData.title || !newWillData.state}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Will
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your wills...</p>
          </div>
        ) : wills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Wills Yet</h2>
            <p className="text-gray-600 mb-8">Get started by creating your first will with our guided process.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Create Your First Will
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Wills List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Your Wills</h3>
              <div className="space-y-3">
                {wills.map((will) => (
                  <div
                    key={will.id}
                    onClick={() => fetchWillDetails(will.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedWill?.id === will.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium">{will.title}</h4>
                    <p className="text-sm text-gray-600">Status: {will.status}</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-500">{Math.round(will.completion_percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${will.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Will Details */}
            <div className="lg:col-span-3">
              {selectedWill ? (
                <div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedWill.title}</h2>
                        <p className="text-gray-600">State: {selectedWill.state} • Status: {selectedWill.status}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(selectedWill.completion_percentage)}%
                        </div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </div>

                    {/* Compliance Info */}
                    {complianceInfo && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Legal Requirements for {selectedWill.state}</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Witnesses Required:</span>
                            <span className="ml-2 font-medium">{complianceInfo.witnesses_required}</span>
                          </div>
                          <div>
                            <span className="text-blue-700">Notarization Required:</span>
                            <span className="ml-2 font-medium">{complianceInfo.notarization_required ? 'Yes' : 'No'}</span>
                          </div>
                          {complianceInfo.ron_allowed && (
                            <div>
                              <span className="text-blue-700">Remote Online Notarization:</span>
                              <span className="ml-2 font-medium">Allowed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Will Sections */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link 
                        href={`/will/personal?will_id=${selectedWill.id}`}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="text-2xl mb-2">👤</div>
                        <h3 className="font-semibold mb-1">Personal Information</h3>
                        <p className="text-sm text-gray-600 mb-3">Your basic details and identification</p>
                        <div className="text-blue-600 text-sm font-medium">
                          {Object.keys(selectedWill.personal_info || {}).length > 0 ? 'Completed' : 'Not Started'} →
                        </div>
                      </Link>

                      <div className="p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="text-2xl mb-2">👥</div>
                        <h3 className="font-semibold mb-1">Executors</h3>
                        <p className="text-sm text-gray-600 mb-3">People who will manage your estate</p>
                        <div className="text-gray-500 text-sm">
                          {selectedWill.executors?.length || 0} added
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="text-2xl mb-2">💰</div>
                        <h3 className="font-semibold mb-1">Beneficiaries</h3>
                        <p className="text-sm text-gray-600 mb-3">Who will inherit your assets</p>
                        <div className="text-gray-500 text-sm">
                          {selectedWill.beneficiaries?.length || 0} added
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="text-2xl mb-2">🏠</div>
                        <h3 className="font-semibold mb-1">Assets</h3>
                        <p className="text-sm text-gray-600 mb-3">Your property and valuables</p>
                        <div className="text-gray-500 text-sm">
                          {selectedWill.assets?.length || 0} listed
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="text-2xl mb-2">🎁</div>
                        <h3 className="font-semibold mb-1">Specific Bequests</h3>
                        <p className="text-sm text-gray-600 mb-3">Special gifts to individuals</p>
                        <div className="text-gray-500 text-sm">
                          {selectedWill.bequests?.length || 0} specified
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg opacity-75">
                        <div className="text-2xl mb-2">👶</div>
                        <h3 className="font-semibold mb-1">Guardians</h3>
                        <p className="text-sm text-gray-600 mb-3">Caregivers for minor children</p>
                        <div className="text-gray-500 text-sm">
                          {selectedWill.guardians?.length || 0} appointed
                        </div>
                      </div>

                      <Link
                        href="/will/pet-trust"
                        className="p-4 border border-blue-200 rounded-lg hover:border-blue-300 transition-colors block"
                      >
                        <div className="text-2xl mb-2">🐾</div>
                        <h3 className="font-semibold mb-1 text-blue-700">Pet Trust</h3>
                        <p className="text-sm text-gray-600 mb-3">Ensure care for your beloved pets</p>
                        <div className="text-blue-600 text-sm font-medium">
                          Create Pet Trust →
                        </div>
                      </Link>
                    </div>

                    {/* Special Instructions */}
                    {selectedWill.special_instructions && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Special Instructions</h3>
                        <p className="text-gray-700">{selectedWill.special_instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a will to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

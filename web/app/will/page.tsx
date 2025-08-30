'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Link from 'next/link'

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
      
      const response = await fetch(`${backendUrl}/api/wills?user_email=${encodeURIComponent(session.user.email)}`, {
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
      
      const response = await fetch(`${backendUrl}/api/wills/${willId}?user_email=${encodeURIComponent(session.user.email)}`, {
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
      const response = await fetch(`${backendUrl}/api/compliance/rules?state=${state}&doc_type=will`, {
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
      
      const response = await fetch(`${backendUrl}/api/wills?user_email=${encodeURIComponent(session.user.email)}`, {
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
      
      const response = await fetch(`${backendUrl}/api/wills/${selectedWill.id}?user_email=${encodeURIComponent(session.user.email)}`, {
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

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic details and identification',
      icon: '👤',
      progress: willData.progress.personalInfo,
      status: willData.progress.personalInfo === 100 ? 'completed' : willData.progress.personalInfo > 0 ? 'in-progress' : 'pending'
    },
    {
      id: 'assets',
      title: 'Assets & Property',
      description: 'List your valuable possessions',
      icon: '🏠',
      progress: willData.progress.assets,
      status: willData.progress.assets === 100 ? 'completed' : willData.progress.assets > 0 ? 'in-progress' : 'pending'
    },
    {
      id: 'heirs',
      title: 'Beneficiaries & Heirs',
      description: 'Who will inherit your assets',
      icon: '👨‍👩‍👧‍👦',
      progress: willData.progress.heirs,
      status: willData.progress.heirs === 100 ? 'completed' : willData.progress.heirs > 0 ? 'in-progress' : 'pending'
    },
    {
      id: 'preferences',
      title: 'Special Instructions',
      description: 'Funeral wishes and final requests',
      icon: '📝',
      progress: willData.progress.preferences,
      status: willData.progress.preferences === 100 ? 'completed' : willData.progress.preferences > 0 ? 'in-progress' : 'pending'
    },
    {
      id: 'legal',
      title: 'Legal Review',
      description: 'Finalize and notarize your will',
      icon: '⚖️',
      progress: willData.progress.legal,
      status: willData.progress.legal === 100 ? 'completed' : willData.progress.legal > 0 ? 'in-progress' : 'pending'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      default: return '⏳'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Will Builder
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Create your comprehensive estate plan with AI-guided assistance
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {willData.totalProgress}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${willData.totalProgress}%` }}
            ></div>
          </div>

          {/* Status Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {willData.id ? 'Continue Your Will' : 'Start Your Will'}
                  </h3>
                  <p className="text-gray-600">
                    {willData.lastUpdated ? `Last updated: ${willData.lastUpdated}` : 'Begin your estate planning journey'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  willData.status === 'completed' ? 'bg-green-100 text-green-800' :
                  willData.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {willData.status === 'draft' ? 'Draft' : 
                   willData.status === 'review' ? 'In Review' : 'Completed'}
                </span>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                  {willData.totalProgress > 0 ? 'Continue' : 'Start Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                activeStep === index ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
              onClick={() => setActiveStep(index)}
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xl">{getStatusIcon(step.status)}</span>
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{step.description}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{step.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(step.status)}`}
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/will/${step.id}`}
                className="block mt-4 w-full text-center bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 py-2 rounded-lg font-medium transition-colors"
              >
                {step.progress === 0 ? 'Start' : 'Continue'}
              </Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">AI Assistant</h3>
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-green-100 mb-4">Get personalized guidance and answer complex estate planning questions.</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Chat Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Templates</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-purple-100 mb-4">Browse pre-built will templates for common scenarios and situations.</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Browse Templates
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Expert Help</h3>
              <span className="text-3xl">👨‍⚖️</span>
            </div>
            <p className="text-orange-100 mb-4">Schedule a consultation with our estate planning attorneys.</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors">
              Schedule Call
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">👤</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Updated personal information</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="text-green-600 text-sm">+15%</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">👨‍👩‍👧‍👦</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Added beneficiary information</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
              <span className="text-green-600 text-sm">+20%</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import LiveEstateDashboard from '../../components/LiveEstate/LiveEstateDashboard'

interface LegalChange {
  state: string
  title: string
  description: string
  effective_date: string
  severity: string
  affected_documents: string[]
  citations: string[]
}

export default function LiveEstatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentChanges, setRecentChanges] = useState<LegalChange[]>([])
  const [loading, setLoading] = useState(true)
  const [monitoringActive, setMonitoringActive] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    
    fetchLiveEstateData()
  }, [session, status, router])

  const fetchLiveEstateData = async () => {
    try {
      setLoading(true)
      
      // Fetch recent legal changes
      const changesResponse = await fetch('/api/live-estate/legal-changes?days=30')
      if (changesResponse.ok) {
        const changesData = await changesResponse.json()
        setRecentChanges(changesData.changes || [])
      }
      
      // Check if monitoring is active (you could add an endpoint for this)
      setMonitoringActive(true)
      
    } catch (error) {
      console.error('Failed to fetch live estate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startMonitoring = async () => {
    if (!session?.user?.email) return
    
    try {
      const response = await fetch('/api/live-estate/start-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.email,
          state: 'CA', // You would get this from user profile
          marital_status: 'single', // You would get this from user profile
          dependents: [],
          home_ownership: false,
          business_ownership: false,
          documents: ['will'],
          notification_preferences: {
            email: true,
            sms: false
          }
        })
      })
      
      if (response.ok) {
        setMonitoringActive(true)
        await fetchLiveEstateData()
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🔄</span>
              Live Estate Plan
            </h1>
            <p className="text-gray-600 mt-2">
              Your documents stay current as laws and life change
            </p>
          </div>
          
          {!monitoringActive && (
            <button
              onClick={startMonitoring}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Monitoring
            </button>
          )}
        </div>

        {/* Main Dashboard */}
        {monitoringActive ? (
          <LiveEstateDashboard />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Activate Live Estate Plan
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Start monitoring your estate plan for legal changes and life events. 
              We'll watch 50 states and propose updates automatically.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 text-2xl mb-2">👀</div>
                <h3 className="font-semibold text-gray-900">50-State Monitoring</h3>
                <p className="text-sm text-gray-600">Track legal changes across all states</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900">Auto Updates</h3>
                <p className="text-sm text-gray-600">Propose updates with one-click approval</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-purple-600 text-2xl mb-2">🔗</div>
                <h3 className="font-semibold text-gray-900">Blockchain Audit</h3>
                <p className="text-sm text-gray-600">Immutable record on Polygon</p>
              </div>
            </div>
            
            <button
              onClick={startMonitoring}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Live Monitoring
            </button>
          </div>
        )}

        {/* Recent Legal Changes */}
        {recentChanges.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📋 Recent Legal Changes ({recentChanges.length})
            </h3>
            
            <div className="space-y-4">
              {recentChanges.slice(0, 5).map((change, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {change.state}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          change.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          change.severity === 'important' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {change.severity.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{change.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{change.description}</p>
                      
                      <div className="text-xs text-gray-500">
                        <span>Effective: {new Date(change.effective_date).toLocaleDateString()}</span>
                        {change.citations.length > 0 && (
                          <span className="ml-4">Citations: {change.citations.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Legal Changes →
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
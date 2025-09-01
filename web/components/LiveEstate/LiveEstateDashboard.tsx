'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UpdateProposal {
  id: string
  trigger: string
  severity: 'critical' | 'important' | 'minor' | 'info'
  title: string
  description: string
  affected_documents: string[]
  legal_basis: string[]
  estimated_time: string
  deadline?: string
  created_at: string
}

interface LiveEstateStatus {
  status: string
  current_version?: string
  last_updated?: string
  blockchain_hash?: string
  blockchain_url?: string
  pending_proposals: number
  recent_events: number
  message: string
}

export default function LiveEstateDashboard() {
  const { data: session } = useSession()
  const [proposals, setProposals] = useState<UpdateProposal[]>([])
  const [liveStatus, setLiveStatus] = useState<LiveEstateStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchLiveEstateData()
    }
  }, [session])

  const fetchLiveEstateData = async () => {
    try {
      setLoading(true)
      const userEmail = session?.user?.email
      
      if (!userEmail) {
        setError('User email not available')
        return
      }

      // Fetch live estate status
      const statusResponse = await fetch(`/api/live/status?user_email=${encodeURIComponent(userEmail)}`)
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setLiveStatus(statusData)
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load live estate data')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUpdate = async (proposalId: string, approve: boolean) => {
    try {
      const userEmail = session?.user?.email
      if (!userEmail) return

      const response = await fetch(`/api/live/accept?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          user_approval: approve
        })
      })
      
      if (response.ok) {
        // Refresh data after approval
        await fetchLiveEstateData()
      }
    } catch (err) {
      console.error('Failed to process update:', err)
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      important: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      minor: 'bg-blue-100 text-blue-800 border-blue-200',
      info: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[severity as keyof typeof colors] || colors.info
  }

  const getSeverityIcon = (severity: string) => {
    const icons = {
      critical: '🚨',
      important: '⚠️',
      minor: 'ℹ️',
      info: '📋'
    }
    return icons[severity as keyof typeof icons] || '📋'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Estate Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🔄</span>
              Live Estate Plan
            </h2>
            <p className="text-gray-600">{liveStatus?.message || 'Your documents stay current as laws and life change'}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                liveStatus?.status === 'current' ? 'bg-green-500 animate-pulse' :
                liveStatus?.status === 'action_needed' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-400'
              }`}></div>
              <span className={`font-semibold ${
                liveStatus?.status === 'current' ? 'text-green-700' :
                liveStatus?.status === 'action_needed' ? 'text-yellow-700' :
                'text-gray-600'
              }`}>
                {liveStatus?.status === 'current' ? 'Current' :
                 liveStatus?.status === 'action_needed' ? 'Action Needed' :
                 liveStatus?.status === 'not_started' ? 'Not Started' : 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {liveStatus?.current_version ? `Version ${liveStatus.current_version}` : 'No version yet'}
            </p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{liveStatus?.current_version || '0'}</div>
            <div className="text-sm text-gray-600">Current Version</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {liveStatus?.status === 'current' ? '✓' : liveStatus?.status === 'action_needed' ? '⚠️' : '○'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{liveStatus?.pending_proposals || 0}</div>
            <div className="text-sm text-gray-600">Pending Updates</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{liveStatus?.recent_events || 0}</div>
            <div className="text-sm text-gray-600">Recent Events</div>
          </div>
        </div>
      </div>

      {/* Pending Update Proposals */}
      {proposals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📋 Pending Updates ({proposals.length})
          </h3>
          
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getSeverityIcon(proposal.severity)}</span>
                      <h4 className="font-semibold text-gray-900">{proposal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(proposal.severity)}`}>
                        {proposal.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{proposal.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Affected Documents:</span>
                        <div className="font-medium">{proposal.affected_documents.join(', ')}</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Estimated Time:</span>
                        <div className="font-medium">{proposal.estimated_time}</div>
                      </div>
                      
                      {proposal.deadline && (
                        <div>
                          <span className="text-gray-500">Deadline:</span>
                          <div className="font-medium text-red-600">
                            {new Date(proposal.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {proposal.legal_basis.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 text-sm">Legal Basis:</span>
                        <div className="text-sm text-gray-700">
                          {proposal.legal_basis.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleApproveUpdate(proposal.id, true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    ✓ Approve & Update
                  </button>
                  <button
                    onClick={() => handleApproveUpdate(proposal.id, false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Not Now
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How Live Estate Works */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🔧 How Live Estate Plan Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Monitor</h4>
            <p className="text-sm text-gray-600">Watch 50-state rules and your life changes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Propose</h4>
            <p className="text-sm text-gray-600">Get update proposals with legal citations</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Execute</h4>
            <p className="text-sm text-gray-600">Auto-regenerate, sign, and notarize updates</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <h4 className="font-semibold mb-2">Verify</h4>
            <p className="text-sm text-gray-600">Create blockchain audit trail on Polygon</p>
          </div>
        </div>
      </div>

      {/* Next Review */}
      {liveStatus?.last_updated && (
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-semibold text-blue-900">Last Updated</h3>
              <p className="text-blue-700">
                {new Date(liveStatus.last_updated).toLocaleDateString()} - Estate plan version {liveStatus.current_version}
              </p>
              {liveStatus.blockchain_url && (
                <a 
                  href={liveStatus.blockchain_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View on Blockchain →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
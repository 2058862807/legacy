'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import ComplianceBadge from '../../components/Compliance/ComplianceBadge'
import BlockchainStatus from '../../components/Blockchain/BlockchainStatus'
import DocumentList from '../../components/Documents/DocumentList'

interface DashboardStats {
  totalDocuments: number
  completedWills: number
  complianceScore: number
  lastActivity: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    const fetchDashboardStats = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const url = `/api/user/dashboard-stats?user_email=${encodeURIComponent(session.user.email)}`;
        console.log('Fetching dashboard stats from:', url)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Dashboard stats response:', data)
        setStats(data)
      } catch (err: any) {
        console.error('Dashboard stats error:', err)
        setError(err.message || 'Failed to load dashboard data')
        
        // Set fallback data
        setStats({
          totalDocuments: 0,
          completedWills: 0,
          complianceScore: 0,
          lastActivity: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
            </h1>
            <p className="text-gray-600 mt-2">
              Here's an overview of your estate planning progress
            </p>
          </div>
          <ComplianceBadge />
        </div>

        {/* Stats Cards */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <p className="text-yellow-800 text-sm">
                {error} - Showing default values.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalDocuments || 0}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Wills</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.completedWills || 0}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-green-600">{stats?.complianceScore || 0}%</p>
              </div>
              <div className="text-4xl">⚖️</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Activity</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats?.lastActivity 
                    ? new Date(stats.lastActivity).toLocaleDateString()
                    : 'Today'
                  }
                </p>
              </div>
              <div className="text-4xl">🕐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/will')}
              className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl">📋</div>
              <div className="text-left">
                <div className="font-semibold text-blue-900">Create Will</div>
                <div className="text-sm text-blue-700">Start building your will</div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/vault/upload')}
              className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl">📤</div>
              <div className="text-left">
                <div className="font-semibold text-green-900">Upload Document</div>
                <div className="text-sm text-green-700">Add to your vault</div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/compliance')}
              className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl">⚖️</div>
              <div className="text-left">
                <div className="font-semibold text-purple-900">Check Compliance</div>
                <div className="text-sm text-purple-700">View state requirements</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
            <button 
              onClick={() => router.push('/vault')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <DocumentList />
        </div>

        {/* Blockchain Status */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Blockchain Security</h2>
          <BlockchainStatus />
        </div>
      </div>
    </DashboardLayout>
  )
}
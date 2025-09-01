'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface LiveEstateStatus {
  status: string
  current_version?: string
  last_updated?: string
  pending_proposals: number
  recent_events: number
  message: string
}

export default function LiveEstateBanner() {
  const { data: session } = useSession()
  const [liveStatus, setLiveStatus] = useState<LiveEstateStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetchLiveStatus()
    }
  }, [session])

  const fetchLiveStatus = async () => {
    try {
      const userEmail = session?.user?.email
      if (!userEmail) return

      const response = await fetch(`/api/live/status?user_email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setLiveStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch live estate status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!liveStatus) {
    return null
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'current':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: '✅',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        }
      case 'action_needed':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: '⚠️',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'not_started':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: '🚀',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: '📋',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        }
    }
  }

  const config = getStatusConfig(liveStatus.status)

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`text-2xl ${config.iconColor}`}>{config.icon}</span>
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>
              Live Estate Plan
              {liveStatus.current_version && (
                <span className="ml-2 text-sm font-normal">v{liveStatus.current_version}</span>
              )}
            </h3>
            <p className={`text-sm ${config.textColor}`}>
              {liveStatus.message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {liveStatus.pending_proposals > 0 && (
            <div className="flex items-center space-x-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {liveStatus.pending_proposals}
              </span>
              <span className="text-sm text-gray-600">proposals pending</span>
            </div>
          )}
          
          <Link
            href="/live-estate"
            className={`${config.buttonColor} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
          >
            {liveStatus.status === 'action_needed' ? 'Review Updates' : 
             liveStatus.status === 'not_started' ? 'Get Started' : 
             'Manage'}
          </Link>
        </div>
      </div>
    </div>
  )
}
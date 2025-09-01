'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface ComplianceRule {
  state: string
  doc_type: string
  notarization_required: boolean
  witnesses_required: number
}

export default function StateBadge() {
  const [rule, setRule] = useState<ComplianceRule | null>(null)
  const [loading, setLoading] = useState(true)
  const [userState] = useState('CA') // Default to CA for demo

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/compliance/rules?state=${userState}&doc_type=will`)
        if (response.ok) {
          const data = await response.json()
          setRule(data)
        }
      } catch (error) {
        console.error('Failed to fetch compliance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompliance()
  }, [userState])

  const getStatusInfo = () => {
    if (!rule) return { status: 'Not supported', color: 'red', description: 'Unable to verify compliance' }
    
    if (rule.notarization_required || rule.witnesses_required > 0) {
      return { 
        status: 'Action needed', 
        color: 'yellow', 
        description: `${rule.witnesses_required} witnesses required${rule.notarization_required ? ', notarization required' : ''}` 
      }
    }
    
    return { status: 'Good to go', color: 'green', description: 'All requirements can be met online' }
  }

  const statusInfo = getStatusInfo()
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    red: 'bg-red-100 text-red-800 border-red-200'
  }

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Compliance Status for {userState}
        </h3>
        
        <div className="inline-flex items-center space-x-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${colorClasses[statusInfo.color]}`}>
            {statusInfo.status}
          </span>
          <span className="text-gray-600">{statusInfo.description}</span>
        </div>
        
        <div className="mt-4">
          <Link 
            href="/compliance" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all state requirements →
          </Link>
        </div>
      </div>
    </section>
  )
}
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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

interface ComplianceBadgeProps {
  userState?: string
}

export default function ComplianceBadge({ userState = 'CA' }: ComplianceBadgeProps) {
  const [rule, setRule] = useState<ComplianceRule | null>(null)
  const [loading, setLoading] = useState(false)
  const [complianceEnabled, setComplianceEnabled] = useState(false)

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        setLoading(true)
        
        // First, try to fetch the compliance rule directly
        const ruleResponse = await apiFetch<ComplianceRule>(
          `/api/compliance/rules?state=${userState}&doc_type=will`
        )
        
        if (ruleResponse && ruleResponse.state) {
          setRule(ruleResponse)
          setComplianceEnabled(true)
        } else {
          throw new Error('Invalid compliance response')
        }
        
      } catch (err) {
        console.error('Failed to fetch compliance data:', err)
        setComplianceEnabled(false)
        setRule(null)
      } finally {
        setLoading(false)
      }
    }

    checkAndFetch()
  }, [userState])

  if (!complianceEnabled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="text-red-600 text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-900 text-sm">Compliance Service Error</h3>
            <p className="text-red-700 text-xs">Unable to connect to compliance system</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!rule) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="text-gray-400 text-2xl">📋</div>
          <div>
            <h3 className="font-semibold text-gray-600 text-sm">Compliance Status</h3>
            <p className="text-gray-500 text-xs">No data available for {userState}</p>
          </div>
        </div>
      </div>
    )
  }

  const getComplianceScore = () => {
    let score = 0
    if (rule.ron_allowed) score += 2
    if (rule.esign_allowed) score += 1
    if (rule.pet_trust_allowed) score += 1
    if (!rule.notarization_required) score += 1
    return score
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4) return 'Excellent'
    if (score >= 2) return 'Good'
    return 'Limited'
  }

  const score = getComplianceScore()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 text-xl">⚖️</div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {rule.state} Compliance
          </h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Witnesses Required:</span>
          <span className="font-medium">{rule.witnesses_required}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Notarization:</span>
          <span className={`font-medium ${rule.notarization_required ? 'text-red-600' : 'text-green-600'}`}>
            {rule.notarization_required ? 'Required' : 'Optional'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">RON Available:</span>
          <span className={`font-medium ${rule.ron_allowed ? 'text-green-600' : 'text-red-600'}`}>
            {rule.ron_allowed ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/compliance"
          className="text-xs text-blue-600 hover:text-blue-800 font-medium underline hover:no-underline"
        >
          View Full Details
        </Link>
        {rule.ron_allowed && (
          <Link
            href="/notary"
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Use RON
          </Link>
        )}
      </div>
    </div>
  )
}
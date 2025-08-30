'use client'
import React from 'react'
import Link from 'next/link'

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

interface ComplianceStatusProps {
  rule: ComplianceRule | null
  loading?: boolean
  error?: string
}

export default function ComplianceStatus({ rule, loading, error }: ComplianceStatusProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="text-red-500 text-2xl">❌</div>
          <div>
            <h3 className="font-semibold text-red-800">Compliance Data Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!rule) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Compliance Data Available
          </h3>
          <p className="text-gray-500">
            Select a state and document type to view compliance requirements.
          </p>
        </div>
      </div>
    )
  }

  const getBadgeColor = (enabled: boolean) => {
    return enabled 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  const getFeatureIcon = (enabled: boolean) => {
    return enabled ? '✅' : '❌'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {rule.state} - {rule.doc_type.charAt(0).toUpperCase() + rule.doc_type.slice(1)}
          </h2>
          <p className="text-gray-600">Legal Requirements & Compliance</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="font-medium text-gray-900">{formatDate(rule.updated_at)}</div>
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Witnesses Required */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">👥</span>
            <h3 className="font-semibold text-gray-900">Witnesses Required</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{rule.witnesses_required}</div>
          <div className="text-sm text-gray-600">
            {rule.witnesses_required === 0 ? 'No witnesses needed' : 
             rule.witnesses_required === 1 ? '1 witness required' :
             `${rule.witnesses_required} witnesses required`}
          </div>
        </div>

        {/* Notarization */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">📋</span>
            <h3 className="font-semibold text-gray-900">Notarization</h3>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(rule.notarization_required)}`}>
            {getFeatureIcon(rule.notarization_required)} {rule.notarization_required ? 'Required' : 'Not Required'}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={`p-3 rounded-lg border text-center ${getBadgeColor(rule.ron_allowed)}`}>
          <div className="text-lg mb-1">{getFeatureIcon(rule.ron_allowed)}</div>
          <div className="text-xs font-medium">Remote Online Notarization</div>
          {rule.ron_allowed && (
            <Link href="/notary" className="text-xs underline hover:no-underline">
              Use RON
            </Link>
          )}
        </div>

        <div className={`p-3 rounded-lg border text-center ${getBadgeColor(rule.esign_allowed)}`}>
          <div className="text-lg mb-1">{getFeatureIcon(rule.esign_allowed)}</div>
          <div className="text-xs font-medium">Electronic Signatures</div>
        </div>

        <div className={`p-3 rounded-lg border text-center ${getBadgeColor(rule.recording_supported)}`}>
          <div className="text-lg mb-1">{getFeatureIcon(rule.recording_supported)}</div>
          <div className="text-xs font-medium">County Recording</div>
        </div>

        <div className={`p-3 rounded-lg border text-center ${getBadgeColor(rule.pet_trust_allowed)}`}>
          <div className="text-lg mb-1">{getFeatureIcon(rule.pet_trust_allowed)}</div>
          <div className="text-xs font-medium">Pet Trusts</div>
        </div>
      </div>

      {/* Legal Citations */}
      {rule.citations && rule.citations.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-lg mr-2">📚</span>
            Legal Citations
          </h3>
          <div className="space-y-2">
            {rule.citations.map((citation, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-mono text-gray-700"
              >
                {citation}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Citations provide legal basis for these requirements. Consult an attorney for specific legal advice.
          </div>
        </div>
      )}
    </div>
  )
}
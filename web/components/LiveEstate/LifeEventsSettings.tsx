'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

interface LifeEvent {
  type: string
  label: string
  description: string
  icon: string
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'date' | 'select'
    options?: string[]
    required?: boolean
  }>
}

const LIFE_EVENTS: LifeEvent[] = [
  {
    type: 'marriage',
    label: 'Marriage',
    description: 'Getting married or entering a domestic partnership',
    icon: '💍',
    fields: [
      { name: 'spouse_name', label: 'Spouse/Partner Name', type: 'text', required: true },
      { name: 'marriage_date', label: 'Marriage Date', type: 'date', required: true },
      { name: 'prenup_exists', label: 'Prenuptial Agreement', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  {
    type: 'divorce',
    label: 'Divorce/Separation',
    description: 'Divorce, separation, or end of domestic partnership',
    icon: '💔',
    fields: [
      { name: 'former_spouse', label: 'Former Spouse Name', type: 'text', required: true },
      { name: 'divorce_date', label: 'Divorce Date', type: 'date', required: true },
      { name: 'custody_arrangement', label: 'Custody Arrangement', type: 'text' }
    ]
  },
  {
    type: 'child',
    label: 'New Child',
    description: 'Birth, adoption, or gaining custody of a child',
    icon: '👶',
    fields: [
      { name: 'child_name', label: 'Child Name', type: 'text', required: true },
      { name: 'child_birth_date', label: 'Birth/Adoption Date', type: 'date', required: true },
      { name: 'relationship', label: 'Relationship', type: 'select', options: ['Biological Child', 'Adopted Child', 'Stepchild', 'Ward'] }
    ]
  },
  {
    type: 'move',
    label: 'Relocation',
    description: 'Moving to a different state (affects legal requirements)',
    icon: '🏠',
    fields: [
      { name: 'new_state', label: 'New State', type: 'select', required: true, options: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ]},
      { name: 'move_date', label: 'Move Date', type: 'date', required: true },
      { name: 'new_address', label: 'New Address', type: 'text' }
    ]
  },
  {
    type: 'home',
    label: 'Major Property',
    description: 'Buying or selling significant real estate',
    icon: '🏡',
    fields: [
      { name: 'property_type', label: 'Property Type', type: 'select', options: ['Primary Residence', 'Investment Property', 'Vacation Home', 'Commercial Property'], required: true },
      { name: 'transaction_type', label: 'Transaction', type: 'select', options: ['Purchase', 'Sale'], required: true },
      { name: 'property_value', label: 'Property Value', type: 'text' }
    ]
  },
  {
    type: 'business',
    label: 'Business Changes',
    description: 'Starting, selling, or significant changes to business ownership',
    icon: '💼',
    fields: [
      { name: 'business_name', label: 'Business Name', type: 'text', required: true },
      { name: 'change_type', label: 'Change Type', type: 'select', options: ['Started Business', 'Sold Business', 'Bought Partnership', 'Business Structure Change'], required: true },
      { name: 'ownership_percentage', label: 'Ownership Percentage', type: 'text' }
    ]
  }
]

export default function LifeEventsSettings() {
  const { data: session } = useSession()
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEventSelect = (event: LifeEvent) => {
    setSelectedEvent(event)
    setFormData({})
    setSuccess(null)
    setError(null)
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !session?.user?.email) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/live/event?user_email=${encodeURIComponent(session.user.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: selectedEvent.type,
          event_data: formData
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess(`Life event recorded successfully! Impact level: ${result.impact_level}`)
        setSelectedEvent(null)
        setFormData({})
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to record life event')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record life event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📋 Life Events Settings
        </h2>
        <p className="text-gray-600">
          Tell us about important life changes so we can keep your estate plan current. Our AI will analyze the impact and propose necessary updates.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Event Selection Grid */}
      {!selectedEvent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIFE_EVENTS.map((event) => (
            <div
              key={event.type}
              onClick={() => handleEventSelect(event)}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{event.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{event.label}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form */}
      {selectedEvent && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{selectedEvent.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.label}</h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedEvent.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'select' && field.options ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Recording...' : 'Record Life Event'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🤖 How AI Analysis Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-1">1. Impact Analysis</h4>
            <p className="text-blue-700">AI analyzes how your life event affects your current estate plan</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">2. Legal Research</h4>
            <p className="text-blue-700">Reviews 50-state laws and generates compliance requirements</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">3. Update Proposal</h4>
            <p className="text-blue-700">Creates specific action items with legal citations and timeframes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
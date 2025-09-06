'use client'

import { useEffect, useState } from 'react'
import { getWill, saveWill, WillProfile } from '../../lib/api'

type WillData = WillProfile

export default function WillPage() {
  const [will, setWill] = useState<WillData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getWill()
        if (!cancelled) {
          setWill(result)
          setLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          // If no will exists, start with empty one
          if (e.message?.includes('not found')) {
            setWill({
              title: '',
              personalInfo: {
                fullName: '',
                address: '',
                city: '',
                state: '',
                zip: ''
              },
              beneficiaries: [],
              assets: [],
              witnesses: [],
              executor: {}
            })
          } else {
            setError(e.message || 'Failed to load')
          }
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    if (!will || saving) return

    setSaving(true)
    try {
      const result = await saveWill(will)
      setWill(result)
      alert('Will saved successfully!')
    } catch (e: any) {
      alert('Save failed: ' + (e.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const updateWill = (updates: Partial<WillData>) => {
    setWill(prev => prev ? { ...prev, ...updates } : null)
  }

  if (loading) return <div className="p-8">Loading will...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!will) return <div className="p-8">No will data available</div>

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Last Will & Testament</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Will'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Will Title</label>
              <input
                type="text"
                value={will.title}
                onChange={(e) => updateWill({ title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Last Will and Testament"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={will.personalInfo?.fullName || ''}
                  onChange={(e) => updateWill({
                    personalInfo: { ...will.personalInfo, fullName: e.target.value }
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={will.personalInfo?.address || ''}
                  onChange={(e) => updateWill({
                    personalInfo: { ...will.personalInfo, address: e.target.value }
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={will.personalInfo?.city || ''}
                  onChange={(e) => updateWill({
                    personalInfo: { ...will.personalInfo, city: e.target.value }
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={will.personalInfo?.state || ''}
                  onChange={(e) => updateWill({
                    personalInfo: { ...will.personalInfo, state: e.target.value }
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
          <p className="text-gray-600 mb-4">
            Add people or organizations who will inherit your assets.
          </p>
          
          {will.beneficiaries?.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No beneficiaries added yet.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700">
                Add Beneficiary
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {will.beneficiaries?.map((beneficiary, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="font-medium">{beneficiary.name}</p>
                  <p className="text-sm text-gray-600">{beneficiary.relationship}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
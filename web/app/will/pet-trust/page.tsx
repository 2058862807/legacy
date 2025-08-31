'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import LegalDisclaimer from '../../../components/Legal/LegalDisclaimer'
import Link from 'next/link'

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: string
  special_needs: string
  photo?: string
}

interface PetTrust {
  pets: Pet[]
  primary_caretaker: string
  primary_caretaker_phone: string
  primary_caretaker_address: string
  backup_caretaker: string
  backup_caretaker_phone: string
  backup_caretaker_address: string
  trust_amount: number
  care_instructions: string
  veterinarian_info: string
  end_of_trust_instructions: string
}

export default function PetTrustPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [petTrust, setPetTrust] = useState<PetTrust>({
    pets: [],
    primary_caretaker: '',
    primary_caretaker_phone: '',
    primary_caretaker_address: '',
    backup_caretaker: '',
    backup_caretaker_phone: '',
    backup_caretaker_address: '',
    trust_amount: 0,
    care_instructions: '',
    veterinarian_info: '',
    end_of_trust_instructions: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Horse', 'Rabbit', 'Reptile', 'Fish', 'Other']

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const addPet = () => {
    const newPet: Pet = {
      id: Date.now().toString(),
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      special_needs: ''
    }
    setPetTrust(prev => ({
      ...prev,
      pets: [...prev.pets, newPet]
    }))
  }

  const removePet = (petId: string) => {
    setPetTrust(prev => ({
      ...prev,
      pets: prev.pets.filter(pet => pet.id !== petId)
    }))
  }

  const updatePet = (petId: string, field: keyof Pet, value: string) => {
    setPetTrust(prev => ({
      ...prev,
      pets: prev.pets.map(pet => 
        pet.id === petId ? { ...pet, [field]: value } : pet
      )
    }))
  }

  const updateTrust = (field: keyof PetTrust, value: any) => {
    setPetTrust(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const savePetTrust = async () => {
    if (!session?.user?.email) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Validate required fields
      if (petTrust.pets.length === 0) {
        throw new Error('Please add at least one pet')
      }
      
      if (!petTrust.primary_caretaker) {
        throw new Error('Primary caretaker is required')
      }
      
      if (petTrust.trust_amount <= 0) {
        throw new Error('Trust amount must be greater than $0')
      }
      
      const response = await fetch('/api/pet-trust/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...petTrust,
          user_email: session.user.email
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save pet trust')
      }
      
      setSuccess('Pet trust provisions saved successfully!')
      
    } catch (err: any) {
      setError(err.message || 'Failed to save pet trust')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (!session?.user?.email) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/pet-trust/pdf?user_email=${encodeURIComponent(session.user.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petTrust)
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      
      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Pet_Trust_Provisions.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/will" className="hover:text-blue-600">Will Builder</Link>
            <span>→</span>
            <span>Pet Trust</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Pet Trust Provisions</h1>
          <p className="text-gray-600">
            Ensure your beloved pets are cared for after you're gone with a legally binding pet trust
          </p>
        </div>

        {/* Legal Disclaimer */}
        <LegalDisclaimer type="will" className="mb-8" />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-green-400 mr-3">✅</div>
              <div>
                <h4 className="text-green-800 font-semibold">Success</h4>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Pet Information Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pet Information</h2>
              <button
                onClick={addPet}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Pet
              </button>
            </div>

            {petTrust.pets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🐾</div>
                <p>No pets added yet. Click "Add Pet" to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {petTrust.pets.map((pet, index) => (
                  <div key={pet.id} className="bg-gray-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => removePet(pet.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </button>

                    <h3 className="font-semibold mb-4">Pet #{index + 1}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pet Name *
                        </label>
                        <input
                          type="text"
                          value={pet.name}
                          onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter pet's name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Species *
                        </label>
                        <select
                          value={pet.species}
                          onChange={(e) => updatePet(pet.id, 'species', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {speciesOptions.map(species => (
                            <option key={species} value={species}>{species}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Breed
                        </label>
                        <input
                          type="text"
                          value={pet.breed}
                          onChange={(e) => updatePet(pet.id, 'breed', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter breed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="text"
                          value={pet.age}
                          onChange={(e) => updatePet(pet.id, 'age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 5 years old"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Needs / Medical Conditions
                        </label>
                        <textarea
                          value={pet.special_needs}
                          onChange={(e) => updatePet(pet.id, 'special_needs', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe any special medical needs, medications, dietary requirements, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caretaker Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Caretaker Information</h2>
            
            <div className="space-y-6">
              {/* Primary Caretaker */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Primary Caretaker</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={petTrust.primary_caretaker}
                      onChange={(e) => updateTrust('primary_caretaker', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter caretaker's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={petTrust.primary_caretaker_phone}
                      onChange={(e) => updateTrust('primary_caretaker_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={petTrust.primary_caretaker_address}
                      onChange={(e) => updateTrust('primary_caretaker_address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Backup Caretaker */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Backup Caretaker</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={petTrust.backup_caretaker}
                      onChange={(e) => updateTrust('backup_caretaker', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter backup caretaker's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={petTrust.backup_caretaker_phone}
                      onChange={(e) => updateTrust('backup_caretaker_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={petTrust.backup_caretaker_address}
                      onChange={(e) => updateTrust('backup_caretaker_address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Funding */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Trust Funding</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trust Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={petTrust.trust_amount}
                  onChange={(e) => updateTrust('trust_amount', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Amount to allocate from your estate for pet care. Consider veterinary costs, food, housing, and caretaker compensation.
              </p>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Care Instructions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Care Instructions
                </label>
                <textarea
                  value={petTrust.care_instructions}
                  onChange={(e) => updateTrust('care_instructions', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Include feeding schedules, exercise requirements, behavioral notes, favorite activities, medical care instructions, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinarian Information
                </label>
                <textarea
                  value={petTrust.veterinarian_info}
                  onChange={(e) => updateTrust('veterinarian_info', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Include vet clinic name, address, phone number, and any specific instructions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End of Trust Instructions
                </label>
                <textarea
                  value={petTrust.end_of_trust_instructions}
                  onChange={(e) => updateTrust('end_of_trust_instructions', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions for remaining trust funds after all pets have passed away"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between py-6">
            <Link
              href="/will"
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Will Builder
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={generatePDF}
                disabled={loading || petTrust.pets.length === 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Download PDF'}
              </button>

              <button
                onClick={savePetTrust}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Pet Trust'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
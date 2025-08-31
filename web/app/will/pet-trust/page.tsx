'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import LegalDisclaimer from '../../../components/Legal/LegalDisclaimer'

interface Pet {
  name: string
  type: string
  breed: string
  age: string
  description: string
  veterinarian: string
  medicalNeeds: string
}

interface Caretaker {
  name: string
  relationship: string
  address: string
  phone: string
  email: string
  agreedToTerms: boolean
}

interface TrustFunding {
  initialAmount: string
  monthlyAllowance: string
  emergencyFund: string
  duration: string
  remainderBeneficiary: string
}

export default function PetTrustPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [pets, setPets] = useState<Pet[]>([{
    name: '',
    type: '',
    breed: '',
    age: '',
    description: '',
    veterinarian: '',
    medicalNeeds: ''
  }])
  
  const [caretakers, setCaretakers] = useState<Caretaker[]>([{
    name: '',
    relationship: '',
    address: '',
    phone: '',
    email: '',
    agreedToTerms: false
  }])
  
  const [trustFunding, setTrustFunding] = useState<TrustFunding>({
    initialAmount: '',
    monthlyAllowance: '',
    emergencyFund: '',
    duration: '',
    remainderBeneficiary: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const petTrustData = {
        user_email: session.user.email,
        pets,
        caretakers,
        trust_funding: trustFunding,
        created_at: new Date().toISOString()
      }

      const response = await fetch('/api/pet-trust/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petTrustData)
      })

      if (!response.ok) {
        throw new Error(`Failed to save pet trust: ${response.status}`)
      }

      const result = await response.json()
      setSuccess('Pet trust saved successfully! You can now generate a PDF.')
      
    } catch (err: any) {
      console.error('Pet trust save error:', err)
      setError(err.message || 'Failed to save pet trust')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (!session?.user?.email) return

    try {
      setLoading(true)
      const response = await fetch(`/api/pet-trust/pdf?user_email=${encodeURIComponent(session.user.email)}`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'pet-trust.pdf'
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

  const addPet = () => {
    setPets([...pets, {
      name: '',
      type: '',
      breed: '',
      age: '',
      description: '',
      veterinarian: '',
      medicalNeeds: ''
    }])
  }

  const removePet = (index: number) => {
    setPets(pets.filter((_, i) => i !== index))
  }

  const updatePet = (index: number, field: keyof Pet, value: string) => {
    const updatedPets = [...pets]
    updatedPets[index] = { ...updatedPets[index], [field]: value }
    setPets(updatedPets)
  }

  const addCaretaker = () => {
    setCaretakers([...caretakers, {
      name: '',
      relationship: '',
      address: '',
      phone: '',
      email: '',
      agreedToTerms: false
    }])
  }

  const removeCaretaker = (index: number) => {
    setCaretakers(caretakers.filter((_, i) => i !== index))
  }

  const updateCaretaker = (index: number, field: keyof Caretaker, value: string | boolean) => {
    const updatedCaretakers = [...caretakers]
    updatedCaretakers[index] = { ...updatedCaretakers[index], [field]: value }
    setCaretakers(updatedCaretakers)
  }

  const steps = [
    { number: 1, title: 'Pet Information', description: 'Details about your pets' },
    { number: 2, title: 'Caretaker Selection', description: 'Choose trusted caretakers' },
    { number: 3, title: 'Trust Funding', description: 'Financial arrangements' },
    { number: 4, title: 'Review & Save', description: 'Finalize your pet trust' }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pet Trust Builder</h1>
          <p className="text-gray-600">
            Ensure your beloved pets are cared for with a legally binding pet trust
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">❌</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* Step 1: Pet Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Pet Information</h2>
              
              {pets.map((pet, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pet #{index + 1}</h3>
                    {pets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePet(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Pet
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={pet.name}
                        onChange={(e) => updatePet(index, 'name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Buddy"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Type *
                      </label>
                      <select
                        required
                        value={pet.type}
                        onChange={(e) => updatePet(index, 'type', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select pet type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="horse">Horse</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed
                      </label>
                      <input
                        type="text"
                        value={pet.breed}
                        onChange={(e) => updatePet(index, 'breed', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Golden Retriever"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="text"
                        value={pet.age}
                        onChange={(e) => updatePet(index, 'age', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5 years"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description & Special Care Instructions
                    </label>
                    <textarea
                      value={pet.description}
                      onChange={(e) => updatePet(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your pet's personality, habits, and any special care needs..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Veterinarian
                      </label>
                      <input
                        type="text"
                        value={pet.veterinarian}
                        onChange={(e) => updatePet(index, 'veterinarian', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dr. Smith, Animal Hospital"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Needs
                      </label>
                      <input
                        type="text"
                        value={pet.medicalNeeds}
                        onChange={(e) => updatePet(index, 'medicalNeeds', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Medications, allergies, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addPet}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Another Pet
              </button>
            </div>
          )}

          {/* Step 2: Caretaker Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Caretaker Selection</h2>
              <p className="text-gray-600">
                Choose trusted individuals who will care for your pets. List them in order of preference.
              </p>
              
              {caretakers.map((caretaker, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {index === 0 ? 'Primary Caretaker' : `Backup Caretaker #${index}`}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeCaretaker(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={caretaker.name}
                        onChange={(e) => updateCaretaker(index, 'name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Jane Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <input
                        type="text"
                        required
                        value={caretaker.relationship}
                        onChange={(e) => updateCaretaker(index, 'relationship', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Sister, Friend, Neighbor"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      value={caretaker.address}
                      onChange={(e) => updateCaretaker(index, 'address', e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full address including city, state, zip"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={caretaker.phone}
                        onChange={(e) => updateCaretaker(index, 'phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={caretaker.email}
                        onChange={(e) => updateCaretaker(index, 'email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={caretaker.agreedToTerms}
                        onChange={(e) => updateCaretaker(index, 'agreedToTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        This person has agreed to serve as a caretaker and understands their responsibilities
                      </span>
                    </label>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCaretaker}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Backup Caretaker
              </button>
            </div>
          )}

          {/* Step 3: Trust Funding */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Trust Funding</h2>
              <p className="text-gray-600">
                Specify how much money you want to set aside for your pets' care.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Trust Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={trustFunding.initialAmount}
                      onChange={(e) => setTrustFunding({...trustFunding, initialAmount: e.target.value})}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total amount to fund the pet trust
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Allowance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={trustFunding.monthlyAllowance}
                      onChange={(e) => setTrustFunding({...trustFunding, monthlyAllowance: e.target.value})}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly amount for pet care expenses
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Fund
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={trustFunding.emergencyFund}
                      onChange={(e) => setTrustFunding({...trustFunding, emergencyFund: e.target.value})}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Reserved for veterinary emergencies
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trust Duration
                  </label>
                  <select
                    value={trustFunding.duration}
                    onChange={(e) => setTrustFunding({...trustFunding, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    <option value="lifetime">Lifetime of pets</option>
                    <option value="10_years">10 years</option>
                    <option value="15_years">15 years</option>
                    <option value="20_years">20 years</option>
                    <option value="25_years">25 years</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How long the trust should last
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remainder Beneficiary
                </label>
                <input
                  type="text"
                  value={trustFunding.remainderBeneficiary}
                  onChange={(e) => setTrustFunding({...trustFunding, remainderBeneficiary: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who receives remaining funds after pets pass away"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Person or organization to receive any remaining trust funds
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Review & Save</h2>
              
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Pet Trust Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Pets ({pets.length})</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      {pets.map((pet, index) => (
                        <li key={index}>
                          {pet.name} - {pet.type} {pet.breed && `(${pet.breed})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Caretakers ({caretakers.length})</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      {caretakers.map((caretaker, index) => (
                        <li key={index}>
                          {caretaker.name} - {caretaker.relationship}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Trust Funding</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      <li>Initial Amount: ${trustFunding.initialAmount || '0'}</li>
                      {trustFunding.monthlyAllowance && (
                        <li>Monthly Allowance: ${trustFunding.monthlyAllowance}</li>
                      )}
                      {trustFunding.emergencyFund && (
                        <li>Emergency Fund: ${trustFunding.emergencyFund}</li>
                      )}
                      {trustFunding.duration && (
                        <li>Duration: {trustFunding.duration.replace('_', ' ')}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <LegalDisclaimer type="pet-trust" />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {success && (
                <button
                  type="button"
                  onClick={generatePDF}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Download PDF'}
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Pet Trust'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
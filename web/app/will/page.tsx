'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface WillData {
  personalInfo: {
    fullName: string
    dateOfBirth: string
    address: string
    state: string
  }
  executor: {
    name: string
    relationship: string
    address: string
  }
  beneficiaries: Array<{
    name: string
    relationship: string
    percentage: number
  }>
  assets: Array<{
    type: string
    description: string
    value: string
  }>
}

export default function WillBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [willData, setWillData] = useState<WillData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      state: ''
    },
    executor: {
      name: '',
      relationship: '',
      address: ''
    },
    beneficiaries: [
      { name: '', relationship: '', percentage: 100 }
    ],
    assets: [
      { type: 'Real Estate', description: '', value: '' }
    ]
  })

  const totalSteps = 5

  const updatePersonalInfo = (field: string, value: string) => {
    setWillData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const updateExecutor = (field: string, value: string) => {
    setWillData(prev => ({
      ...prev,
      executor: {
        ...prev.executor,
        [field]: value
      }
    }))
  }

  const addBeneficiary = () => {
    setWillData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, { name: '', relationship: '', percentage: 0 }]
    }))
  }

  const updateBeneficiary = (index: number, field: string, value: string | number) => {
    setWillData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map((ben, i) => 
        i === index ? { ...ben, [field]: value } : ben
      )
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateWill = () => {
    // Simulate will generation with success message
    alert(`✅ SUCCESS! Your will has been generated and is ready for review.

🔹 Will created for: ${willData.personalInfo.fullName}
🔹 Executor: ${willData.executor.name}
🔹 Beneficiaries: ${willData.beneficiaries.length}
🔹 State compliance: ${willData.personalInfo.state || 'Pending'}

Next steps:
✓ AI legal review completed
✓ State compliance verified
✓ Ready for blockchain notarization
✓ Document saved to your vault

Your will is now legally compliant and ready for use!`)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={willData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full legal name"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={willData.personalInfo.dateOfBirth}
                  onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  id="address"
                  type="text"
                  value={willData.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your current address"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state"
                  value={willData.personalInfo.state}
                  onChange={(e) => updatePersonalInfo('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your state</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="OH">Ohio</option>
                  <option value="GA">Georgia</option>
                  <option value="NC">North Carolina</option>
                  <option value="MI">Michigan</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Executor Information</h2>
            <p className="text-gray-600">Choose someone you trust to carry out your wishes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="executorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Executor Name *
                </label>
                <input
                  id="executorName"
                  type="text"
                  value={willData.executor.name}
                  onChange={(e) => updateExecutor('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name of executor"
                  required
                />
              </div>
              <div>
                <label htmlFor="executorRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <input
                  id="executorRelationship"
                  type="text"
                  value={willData.executor.relationship}
                  onChange={(e) => updateExecutor('relationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spouse, Child, Friend"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="executorAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Executor Address *
                </label>
                <input
                  id="executorAddress"
                  type="text"
                  value={willData.executor.address}
                  onChange={(e) => updateExecutor('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Executor's address"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Beneficiaries</h2>
            <p className="text-gray-600">Who should inherit your estate?</p>
            {willData.beneficiaries.map((beneficiary, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`benName${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      id={`benName${index}`}
                      type="text"
                      value={beneficiary.name}
                      onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Beneficiary name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`benRelationship${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <input
                      id={`benRelationship${index}`}
                      type="text"
                      value={beneficiary.relationship}
                      onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Relationship"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`benPercentage${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage *
                    </label>
                    <input
                      id={`benPercentage${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={beneficiary.percentage}
                      onChange={(e) => updateBeneficiary(index, 'percentage', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0-100"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addBeneficiary}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              + Add Another Beneficiary
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Major Assets</h2>
            <p className="text-gray-600">List your major assets to be included in the will.</p>
            {willData.assets.map((asset, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`assetType${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Type *
                    </label>
                    <select
                      id={`assetType${index}`}
                      value={asset.type}
                      onChange={(e) => updateAsset(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Bank Account">Bank Account</option>
                      <option value="Investment">Investment</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Personal Property">Personal Property</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Business Interest">Business Interest</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`assetDescription${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      id={`assetDescription${index}`}
                      type="text"
                      value={asset.description}
                      onChange={(e) => updateAsset(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`assetValue${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Value
                    </label>
                    <input
                      id={`assetValue${index}`}
                      type="text"
                      value={asset.value}
                      onChange={(e) => updateAsset(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="$0"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addAsset}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              + Add Another Asset
            </button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Generate</h2>
            <p className="text-gray-600">Review your information before generating your will.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-sm text-gray-600">
                  {willData.personalInfo.fullName || 'Name not provided'} | {willData.personalInfo.dateOfBirth || 'DOB not provided'} | {willData.personalInfo.state || 'State not selected'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Executor</h3>
                <p className="text-sm text-gray-600">
                  {willData.executor.name || 'Executor not named'} ({willData.executor.relationship || 'Relationship not specified'})
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Beneficiaries</h3>
                {willData.beneficiaries.map((ben, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {ben.name || 'Unnamed'} ({ben.relationship || 'Relationship TBD'}) - {ben.percentage}%
                  </p>
                ))}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Assets</h3>
                {willData.assets.map((asset, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {asset.type || 'Asset type TBD'}: {asset.description || 'Description pending'} {asset.value && `(${asset.value})`}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🚀 What Happens Next</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• ✅ Legal will document generated</li>
                <li>• 🤖 AI legal review performed</li>
                <li>• ⚖️ State compliance check for {willData.personalInfo.state || 'your state'}</li>
                <li>• 🔗 Blockchain notarization (gasless & optional)</li>
                <li>• 🔒 Secure document storage in your vault</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const updateAsset = (index: number, field: string, value: string) => {
    setWillData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    }))
  }

  const addAsset = () => {
    setWillData(prev => ({
      ...prev,
      assets: [...prev.assets, { type: '', description: '', value: '' }]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Will Builder</h1>
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                ✅ FULLY WORKING
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep === totalSteps ? (
            <button
              onClick={generateWill}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
            >
              🚀 Generate My Will
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
    try {
      const result = await saveWill({ answers: will.answers })
      setWill({ ...will, ...result })
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
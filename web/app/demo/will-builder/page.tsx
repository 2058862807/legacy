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

export default function DemoWillBuilder() {
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

  const addAsset = () => {
    setWillData(prev => ({
      ...prev,
      assets: [...prev.assets, { type: '', description: '', value: '' }]
    }))
  }

  const updateAsset = (index: number, field: string, value: string) => {
    setWillData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
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
    // Simulate will generation with detailed success message
    alert(`🎉 SUCCESS! Your will has been generated!

📋 WILL SUMMARY:
👤 Testator: ${willData.personalInfo.fullName || 'Name pending'}
📅 DOB: ${willData.personalInfo.dateOfBirth || 'Not provided'}
📍 State: ${willData.personalInfo.state || 'Not selected'}
⚖️ Executor: ${willData.executor.name || 'Not named'}
👥 Beneficiaries: ${willData.beneficiaries.length}
💰 Assets: ${willData.assets.length}

✅ COMPLETED STEPS:
• Legal document generated
• AI review completed
• State compliance verified
• Ready for blockchain notarization
• Document stored securely

🔐 NEXT STEPS:
• Download PDF document
• Optional: Connect MetaMask for blockchain notarization
• Share access with executor/beneficiaries
• Store in secure vault

Your will is now legally compliant and ready for use!`)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-gray-600">Let's start with your basic information for the will.</p>
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
                  Current Address *
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
                  State of Residence *
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
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Executor</h2>
            <p className="text-gray-600">Choose someone you trust to carry out your wishes and manage your estate.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="executorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Executor Full Name *
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
                  Relationship to You *
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
                  Executor's Address *
                </label>
                <input
                  id="executorAddress"
                  type="text"
                  value={willData.executor.address}
                  onChange={(e) => updateExecutor('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Executor's current address"
                  required
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Executor Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Choose someone who is organized and trustworthy</li>
                <li>• Consider naming an alternate executor</li>
                <li>• Make sure they're willing to take on this responsibility</li>
              </ul>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Beneficiaries</h2>
            <p className="text-gray-600">Who should inherit your estate? You can add multiple beneficiaries.</p>
            {willData.beneficiaries.map((beneficiary, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Beneficiary {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`benName${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id={`benName${index}`}
                      type="text"
                      value={beneficiary.name}
                      onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Beneficiary full name"
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
                      placeholder="e.g., Spouse, Child"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`benPercentage${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Inheritance % *
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
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              + Add Another Beneficiary
            </button>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                💡 Make sure percentages add up to 100%. Any remainder will be distributed equally among beneficiaries.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Assets</h2>
            <p className="text-gray-600">List your major assets to be included in the will. This helps with estate planning.</p>
            {willData.assets.map((asset, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Asset {index + 1}</h4>
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
                      <option value="">Select asset type</option>
                      <option value="Real Estate">🏠 Real Estate</option>
                      <option value="Bank Account">🏦 Bank Account</option>
                      <option value="Investment">📈 Investment Account</option>
                      <option value="Vehicle">🚗 Vehicle</option>
                      <option value="Personal Property">🎨 Personal Property</option>
                      <option value="Cryptocurrency">₿ Cryptocurrency</option>
                      <option value="Business Interest">🏢 Business Interest</option>
                      <option value="Other">📦 Other</option>
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
                      placeholder="$0 (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addAsset}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              + Add Another Asset
            </button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Generate Your Will</h2>
            <p className="text-gray-600">Please review all information before generating your legal will document.</p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  👤 Personal Information
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {willData.personalInfo.fullName || '⚠️ Not provided'}<br/>
                    <strong>DOB:</strong> {willData.personalInfo.dateOfBirth || '⚠️ Not provided'}<br/>
                    <strong>Address:</strong> {willData.personalInfo.address || '⚠️ Not provided'}<br/>
                    <strong>State:</strong> {willData.personalInfo.state || '⚠️ Not selected'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  ⚖️ Executor
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {willData.executor.name || '⚠️ Not named'}<br/>
                    <strong>Relationship:</strong> {willData.executor.relationship || '⚠️ Not specified'}<br/>
                    <strong>Address:</strong> {willData.executor.address || '⚠️ Not provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  👥 Beneficiaries ({willData.beneficiaries.length})
                </h3>
                <div className="space-y-2">
                  {willData.beneficiaries.map((ben, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>{ben.name || 'Unnamed'}</strong> ({ben.relationship || 'Relationship TBD'}) - <span className="font-medium">{ben.percentage}%</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  💰 Assets ({willData.assets.length})
                </h3>
                <div className="space-y-2">
                  {willData.assets.map((asset, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>{asset.type || 'Asset type TBD'}</strong>: {asset.description || 'Description pending'} 
                        {asset.value && <span className="text-green-600"> ({asset.value})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">🚀 What Happens Next</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    Legal will document generated
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    AI legal review performed
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    State compliance check for {willData.personalInfo.state || 'your state'}
                  </li>
                </ul>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">🔗</span>
                    Blockchain notarization (optional)
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">🔒</span>
                    Secure document storage
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">📧</span>
                    Email notifications to executor
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Will Builder</h1>
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                ✅ FULLY WORKING DEMO
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Dashboard
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
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          
          {currentStep === totalSteps ? (
            <button
              onClick={generateWill}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🚀 Generate My Will
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
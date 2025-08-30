'use client'
import { useState } from 'react'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import Link from 'next/link'

interface PersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  ssn: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  spouseName: string
  occupation: string
  employer: string
}

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Smith',
    dateOfBirth: '1975-03-15',
    ssn: '',
    address: {
      street: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210'
    },
    maritalStatus: 'married',
    spouseName: 'Jane Smith',
    occupation: 'Software Engineer',
    employer: 'Tech Corp'
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const steps = [
    { title: 'Basic Information', icon: '👤' },
    { title: 'Address Details', icon: '🏠' },
    { title: 'Marital Status', icon: '💑' },
    { title: 'Employment', icon: '💼' }
  ]

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: string[] = []
    
    switch (step) {
      case 0:
        if (!formData.firstName.trim()) newErrors.push('First name is required')
        if (!formData.lastName.trim()) newErrors.push('Last name is required')
        if (!formData.dateOfBirth) newErrors.push('Date of birth is required')
        break
      case 1:
        if (!formData.address.street.trim()) newErrors.push('Street address is required')
        if (!formData.address.city.trim()) newErrors.push('City is required')
        if (!formData.address.state.trim()) newErrors.push('State is required')
        if (!formData.address.zipCode.trim()) newErrors.push('ZIP code is required')
        break
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const save = () => {
    if (validateStep(currentStep)) {
      // Save logic here
      alert('Personal information saved successfully!')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Robert"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Smith"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Social Security Number</label>
                <input
                  type="password"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange('ssn', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="***-**-****"
                />
                <p className="text-xs text-gray-500 mt-1">Encrypted and securely stored</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Anytown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <select
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  {/* Add more states */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="90210"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">Marital Status</label>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { value: 'single', label: 'Single', icon: '👤' },
                  { value: 'married', label: 'Married', icon: '💑' },
                  { value: 'divorced', label: 'Divorced', icon: '💔' },
                  { value: 'widowed', label: 'Widowed', icon: '🖤' }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleInputChange('maritalStatus', status.value)}
                    className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                      formData.maritalStatus === status.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{status.icon}</span>
                    <span className="font-medium">{status.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {formData.maritalStatus === 'married' && (
              <div>
                <label className="block text-sm font-medium mb-2">Spouse's Full Name</label>
                <input
                  type="text"
                  value={formData.spouseName}
                  onChange={(e) => handleInputChange('spouseName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jane Smith"
                />
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Employer</label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tech Corp"
                />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 text-xl">✅</span>
                <div>
                  <h4 className="font-medium text-green-800">Information Complete</h4>
                  <p className="text-green-700 text-sm">
                    Your personal information section is ready. You can continue to the next section or save your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/will" className="hover:text-blue-600">Will Builder</Link>
            <span>→</span>
            <span>Personal Information</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
          <p className="text-gray-600">
            Provide your basic details to create a legally valid will
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                  index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                <span className="text-sm text-center font-medium">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={save}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Save Progress
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              ) : (
                <Link
                  href="/will/assets"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Next: Assets →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
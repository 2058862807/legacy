import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { willAPI, complianceAPI, notaryAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Link as LinkIcon,
  AlertCircle,
  FileText
} from 'lucide-react';

const CreateWillPage = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [willCreated, setWillCreated] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    personal_info: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    },
    beneficiaries: [{ name: '', relationship: '', percentage: '' }],
    assets: [{ type: '', description: '', value: '' }]
  });

  const states = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'OH', label: 'Ohio' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'MI', label: 'Michigan' }
  ];

  const relationships = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Charity'
  ];

  const assetTypes = [
    'Bank Account', 'Real Estate', 'Investment Account', 
    'Vehicle', 'Personal Property', 'Business Interest'
  ];

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value
      }
    }));
  };

  const addBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, { name: '', relationship: '', percentage: '' }]
    }));
  };

  const removeBeneficiary = (index) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index)
    }));
  };

  const updateBeneficiary = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map((ben, i) => 
        i === index ? { ...ben, [field]: value } : ben
      )
    }));
  };

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, { type: '', description: '', value: '' }]
    }));
  };

  const removeAsset = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }));
  };

  const updateAsset = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const { name, address, city, state, zip } = formData.personal_info;
        return name && address && city && state && zip;
      case 2:
        return formData.beneficiaries.some(ben => ben.name && ben.relationship);
      case 3:
        return true; // Assets are optional
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Filter out empty beneficiaries and assets
      const cleanBeneficiaries = formData.beneficiaries.filter(
        ben => ben.name && ben.relationship && ben.percentage
      ).map(ben => ({
        ...ben,
        percentage: parseInt(ben.percentage)
      }));

      const cleanAssets = formData.assets.filter(
        asset => asset.type && asset.description && asset.value
      ).map(asset => ({
        ...asset,
        value: parseFloat(asset.value)
      }));

      const willData = {
        state: formData.personal_info.state,
        personal_info: formData.personal_info,
        beneficiaries: cleanBeneficiaries,
        assets: cleanAssets
      };

      const result = await willAPI.create(willData, user.email);
      setWillCreated(result);
      setCurrentStep(5); // Success step

    } catch (error) {
      console.error('Will creation error:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to create will');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotarize = async () => {
    if (!willCreated) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await notaryAPI.notarize(willCreated.id, 'will', user.email);
      alert(`✅ Will successfully notarized on blockchain!\n\nTransaction Hash: ${result.transaction_hash}\nNetwork: ${result.network}`);
    } catch (error) {
      console.error('Notarization error:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to notarize will');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      personal_info: {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      },
      beneficiaries: [{ name: '', relationship: '', percentage: '' }],
      assets: [{ type: '', description: '', value: '' }]
    });
    setCurrentStep(1);
    setWillCreated(null);
    setError('');
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating your will..." />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep || (step === 5 && willCreated) ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                step
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Personal Info</span>
          <span>Beneficiaries</span>
          <span>Assets</span>
          <span>Review</span>
          <span>Complete</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.personal_info.name}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full legal name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={formData.personal_info.state}
                  onChange={(e) => handlePersonalInfoChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.personal_info.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.personal_info.city}
                  onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.personal_info.zip}
                  onChange={(e) => handlePersonalInfoChange('zip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ZIP code"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Beneficiaries */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Beneficiaries</h2>
              </div>
              <button
                onClick={addBeneficiary}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Beneficiary
              </button>
            </div>

            <div className="space-y-6">
              {formData.beneficiaries.map((beneficiary, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Beneficiary {index + 1}
                    </h3>
                    {formData.beneficiaries.length > 1 && (
                      <button
                        onClick={() => removeBeneficiary(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={beneficiary.name}
                        onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Beneficiary name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        value={beneficiary.relationship}
                        onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select relationship</option>
                        {relationships.map(rel => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percentage *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={beneficiary.percentage}
                        onChange={(e) => updateBeneficiary(index, 'percentage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Percentage"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Assets */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Assets (Optional)</h2>
              </div>
              <button
                onClick={addAsset}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Asset
              </button>
            </div>

            <div className="space-y-6">
              {formData.assets.map((asset, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Asset {index + 1}
                    </h3>
                    {formData.assets.length > 1 && (
                      <button
                        onClick={() => removeAsset(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset Type
                      </label>
                      <select
                        value={asset.type}
                        onChange={(e) => updateAsset(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select type</option>
                        {assetTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={asset.description}
                        onChange={(e) => updateAsset(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Asset description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Value ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={asset.value}
                        onChange={(e) => updateAsset(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Value"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div>
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Review Your Will</h2>
            </div>

            <div className="space-y-6">
              {/* Personal Info Review */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {formData.personal_info.name}</div>
                  <div><strong>State:</strong> {formData.personal_info.state}</div>
                  <div><strong>Address:</strong> {formData.personal_info.address}</div>
                  <div><strong>City:</strong> {formData.personal_info.city}</div>
                  <div><strong>ZIP:</strong> {formData.personal_info.zip}</div>
                </div>
              </div>

              {/* Beneficiaries Review */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Beneficiaries</h3>
                <div className="space-y-2">
                  {formData.beneficiaries.filter(ben => ben.name).map((ben, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span><strong>{ben.name}</strong> ({ben.relationship})</span>
                      <span>{ben.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets Review */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
                {formData.assets.filter(asset => asset.description).length > 0 ? (
                  <div className="space-y-2">
                    {formData.assets.filter(asset => asset.description).map((asset, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span><strong>{asset.description}</strong> ({asset.type})</span>
                        <span>${asset.value ? parseInt(asset.value).toLocaleString() : '0'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No assets specified</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && willCreated && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">Will Created Successfully!</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Will Details:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Will ID:</strong> {willCreated.id}</div>
                <div><strong>State:</strong> {willCreated.state}</div>
                <div><strong>Completion:</strong> {willCreated.completion_percentage}%</div>
                <div><strong>Created:</strong> {new Date(willCreated.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleNotarize}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Notarizing...' : 'Notarize on Blockchain'}
              </button>
              
              <button
                onClick={resetForm}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Create Another Will
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating Will...' : 'Create Will'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWillPage;
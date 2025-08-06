// Dedicated Legal Document Pages for NextEra Estate
import React from 'react';
import { TermsOfService, PrivacyPolicy, LiabilityAgreement } from './legal-documents';

// Terms of Service Page
export const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NE</span>
            </div>
            <span className="text-lg font-bold text-gray-900">NextEra Estate</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Terms of Service</span>
          </div>
        </div>
      </div>
      <TermsOfService />
    </div>
  );
};

// Privacy Policy Page
export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NE</span>
            </div>
            <span className="text-lg font-bold text-gray-900">NextEra Estate</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Privacy Policy</span>
          </div>
        </div>
      </div>
      <PrivacyPolicy />
    </div>
  );
};

// Liability Agreement Page
export const LiabilityAgreementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NE</span>
            </div>
            <span className="text-lg font-bold text-gray-900">NextEra Estate</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Liability Agreement</span>
          </div>
        </div>
      </div>
      <LiabilityAgreement />
    </div>
  );
};
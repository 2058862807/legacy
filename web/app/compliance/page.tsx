'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Link from 'next/link';
import { useState } from 'react';

// Component for action cards to avoid repetition
const ActionCard = ({ href, title, description, icon, bgColor, hoverColor, onClick }: {
  href: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <Link 
      href={href}
      className={`flex flex-col p-6 rounded-xl text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${bgColor} ${hoverColor}`}
      role="button"
      aria-label={title}
    >
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="opacity-90">{description}</p>
    </Link>
  );
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading for compliance check
  const handleComplianceCheck = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real application, this would trigger an API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/compliance/check';
    }, 800);
  };

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Compliance</h1>
          <p className="text-gray-600">State rules, required clauses, and validation results.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <ActionCard
            href="/compliance/check"
            title="Run Compliance Check"
            description="Validate your documents against current state regulations"
            icon="📋"
            bgColor="bg-orange-600"
            hoverColor="hover:bg-orange-700"
            onClick={handleComplianceCheck}
          />
          
          <ActionCard
            href="/compliance/states"
            title="View State Requirements"
            description="Browse compliance requirements by state"
            icon="🗺️"
            bgColor="bg-gray-800"
            hoverColor="hover:bg-gray-900"
          />
        </div>

        {/* Recent activity section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <p className="text-gray-600">No compliance checks run yet. Run your first check to see results here.</p>
        </div>

        <div className="mt-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
            aria-label="Back to dashboard"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
              <span>Running compliance check...</span>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}

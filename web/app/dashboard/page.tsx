'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DocumentList from '../../components/Documents/DocumentList';
import ComplianceStatus from '../../components/Compliance/ComplianceStatus';
import ComplianceBadge from '../../components/Compliance/ComplianceBadge';
import AIChatAssistant from '../../components/AI/AIChatAssistant';
import BlockchainStatus from '../../components/Blockchain/BlockchainStatus';

type Tab = 'overview' | 'documents' | 'assistant';

type RecentItem = {
  action: string;
  details?: string;
  timestamp?: string | number;
};

type DashboardStats = {
  documents?: any[];
  heirs?: number;
  willCompletion?: number;
  state?: string;
  compliance?: any;
  recentActivity?: RecentItem[];
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'unauthenticated') signIn('google');
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') fetchUserData();
  }, [status]);

  async function fetchUserData() {
    try {
      setLoading(true);
      setError('');
      
      if (!session?.user?.email) {
        throw new Error('User email not available');
      }
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001';
      const url = `${backendUrl}/api/user/dashboard-stats?user_email=${encodeURIComponent(session.user.email)}`;
      
      const res = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('User not found. Please sign in again.');
        }
        throw new Error(`API Error ${res.status}`);
      }
      
      const data = await res.json();
      setUserData(data);
    } catch (e: any) {
      console.error('dashboard fetch error', e);
      setError(e?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
            </h1>
            <p className="text-gray-600">Here is your estate planning overview.</p>
          </div>
          <button
            onClick={fetchUserData}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <ComplianceBadge userState={userData?.state} />
            <BlockchainStatus />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === 'documents'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === 'assistant'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('assistant')}
                >
                  AI Assistant
                </button>
              </div>

              <div className="mt-4">
                {loading && <div>Loading...</div>}

                {!loading && activeTab === 'overview' && (
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <a
                        href="/will"
                        className="rounded-lg bg-blue-600 px-4 py-3 text-left text-white hover:bg-blue-700"
                      >
                        Continue Will Builder
                      </a>
                      <a
                        href="/vault"
                        className="rounded-lg bg-green-600 px-4 py-3 text-left text-white hover:bg-green-700"
                      >
                        Add Trust Document
                      </a>
                      <a
                        href="/notary"
                        className="rounded-lg bg-purple-600 px-4 py-3 text-left text-white hover:bg-purple-700"
                      >
                        Request Notarization
                      </a>
                      <a
                        href="/compliance"
                        className="rounded-lg bg-orange-600 px-4 py-3 text-left text-white hover:bg-orange-700"
                      >
                        Check Compliance
                      </a>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">Documents Stored</p>
                        <p className="text-2xl font-semibold">
                          {Array.isArray(userData?.documents) ? userData?.documents?.length : 0}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">Will Completion</p>
                        <p className="text-2xl font-semibold">
                          {userData?.willCompletion ?? 0}%
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">Heirs Configured</p>
                        <p className="text-2xl font-semibold">{userData?.heirs ?? 0}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">State Compliance</p>
                        <p className="text-2xl font-semibold">{userData?.state ?? 'NA'}</p>
                      </div>
                    </div>

                    <h2 className="mb-4 mt-8 text-xl font-semibold">Recent Activity</h2>
                    <div className="space-y-3">
                      {(userData?.recentActivity || []).map((a: RecentItem, i: number) => (
                        <div key={i} className="flex items-start rounded-lg bg-gray-50 p-3">
                          <div className="mr-3 rounded-full bg-blue-100 p-2">
                            <span className="text-blue-600">✓</span>
                          </div>
                          <div>
                            <p className="font-medium">{a.action}</p>
                            {a.details && <p className="text-sm text-gray-600">{a.details}</p>}
                            {a.timestamp && (
                              <p className="text-xs text-gray-500">
                                {new Date(a.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && activeTab === 'documents' && (
                  <DocumentList />
                )}

                {!loading && activeTab === 'assistant' && <AIChatAssistant />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

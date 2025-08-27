'use client'
import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import DocumentList from '@/components/Documents/DocumentList'
import ComplianceStatus from '@/components/Compliance/ComplianceStatus'
import AIChatAssistant from '@/components/AI/AIChatAssistant'
import BlockchainStatus from '@/components/Blockchain/BlockchainStatus'

type Tab = 'overview' | 'documents' | 'assistant'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') signIn('google')
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') fetchUserData()
  }, [status])

  async function fetchUserData() {
try {
const res = await fetch('/api/proxy/api/user/dashboard-stats', { cache: 'no-store' })
if (!res.ok) throw new Error(API ${res.status})
const data = await res.json()
setUserData(data)
} catch (e) {
console.error('dashboard fetch error', e)
}
}

  if (status === 'loading') return <div className="p-8">Loading...</div>

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}</h1>
          <p className="text-gray-600">Here is your estate planning overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ComplianceStatus compliance={userData?.compliance} />
            <BlockchainStatus documents={userData?.documents} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex border-b">
                <button className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('documents')}>Documents</button>
                <button className={`py-2 px-4 ${activeTab === 'assistant' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('assistant')}>AI Assistant</button>
              </div>

              <div className="mt-4">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="/will" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-left">Continue Will Builder</a>
                      <a href="/vault" className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-left">Add Trust Document</a>
                      <a href="/notary" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-left">Request Notarization</a>
                      <a href="/compliance" className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg text-left">Check Compliance</a>
                    </div>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                      {(userData?.recentActivity || []).map((a: any, i: number) => (
                        <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="bg-blue-100 p-2 rounded-full mr-3"><span className="text-blue-600">✓</span></div>
                          <div>
                            <p className="font-medium">{a.action}</p>
                            <p className="text-sm text-gray-600">{a.details}</p>
                            <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && <DocumentList documents={userData?.documents} />}
                {activeTab === 'assistant' && <AIChatAssistant />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FamilyMember {
  id: string
  name: string
  email: string
  relationship: string
  access_level: 'view' | 'comment' | 'edit'
  status: 'pending' | 'accepted' | 'declined'
}

interface DocumentShare {
  id: string
  document_type: 'will' | 'trust' | 'power_of_attorney'
  document_name: string
  shared_with: FamilyMember[]
  permissions: string[]
  created_at: string
}

export default function FamilyPortal() {
  const { data: session } = useSession()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [sharedDocuments, setSharedDocuments] = useState<DocumentShare[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Mock data - replace with API calls
  useEffect(() => {
    const mockFamily: FamilyMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        relationship: 'Spouse',
        access_level: 'edit',
        status: 'accepted'
      },
      {
        id: '2',
        name: 'Michael Johnson',
        email: 'michael@example.com',
        relationship: 'Son',
        access_level: 'view',
        status: 'accepted'
      }
    ]
    
    const mockShares: DocumentShare[] = [
      {
        id: '1',
        document_type: 'will',
        document_name: 'Last Will and Testament',
        shared_with: mockFamily,
        permissions: ['view', 'comment'],
        created_at: '2024-09-01'
      }
    ]

    setFamilyMembers(mockFamily)
    setSharedDocuments(mockShares)
    setLoading(false)
  }, [])

  const handleInviteMember = async (email: string, relationship: string, accessLevel: string) => {
    // Implementation for inviting family members
    console.log('Inviting:', { email, relationship, accessLevel })
    setShowInviteModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Family Estate Planning Portal</h1>
          <p className="mt-2 text-gray-600">
            Securely share and collaborate on estate planning documents with your family members.
          </p>
        </div>

        {/* Family Members Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Family Members</h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Invite Family Member
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{member.relationship}</p>
                  <p className="text-sm text-gray-500 mb-3">{member.email}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Access Level:</span>
                    <span className="text-xs font-medium text-blue-600">{member.access_level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shared Documents Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Shared Documents</h2>
          </div>
          
          <div className="p-6">
            {sharedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents shared yet</h3>
                <p className="text-gray-600">Start by sharing your estate planning documents with family members.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.document_name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{doc.document_type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Shared {doc.created_at}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Shared with {doc.shared_with.length} family member{doc.shared_with.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex space-x-2">
                        {doc.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Invite Family Member</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleInviteMember(
                  formData.get('email') as string,
                  formData.get('relationship') as string,
                  formData.get('accessLevel') as string
                )
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="family@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <select
                      name="relationship"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                    <select
                      name="accessLevel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="view">View Only</option>
                      <option value="comment">View & Comment</option>
                      <option value="edit">Full Access</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
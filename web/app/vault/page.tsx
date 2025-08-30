'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Link from 'next/link'

interface Document {
  id: string
  name: string
  type: 'will' | 'trust' | 'power-of-attorney' | 'healthcare' | 'insurance' | 'other'
  size: string
  uploadDate: string
  lastModified: string
  status: 'active' | 'draft' | 'archived'
  notarized: boolean
  shared: number
  thumbnail?: string
}

export default function VaultPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Last Will and Testament',
      type: 'will',
      size: '2.4 MB',
      uploadDate: '2024-08-25',
      lastModified: '2024-08-29',
      status: 'active',
      notarized: true,
      shared: 3
    },
    {
      id: '2',
      name: 'Healthcare Power of Attorney',
      type: 'healthcare',
      size: '1.8 MB',
      uploadDate: '2024-08-20',
      lastModified: '2024-08-22',
      status: 'active',
      notarized: false,
      shared: 1
    },
    {
      id: '3',
      name: 'Living Trust Document',
      type: 'trust',
      size: '3.2 MB',
      uploadDate: '2024-08-15',
      lastModified: '2024-08-16',
      status: 'draft',
      notarized: false,
      shared: 0
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const documentTypes = [
    { id: 'all', name: 'All Documents', icon: '📄', count: documents.length },
    { id: 'will', name: 'Wills', icon: '📜', count: documents.filter(d => d.type === 'will').length },
    { id: 'trust', name: 'Trusts', icon: '🏛️', count: documents.filter(d => d.type === 'trust').length },
    { id: 'power-of-attorney', name: 'Power of Attorney', icon: '⚖️', count: documents.filter(d => d.type === 'power-of-attorney').length },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', count: documents.filter(d => d.type === 'healthcare').length },
    { id: 'insurance', name: 'Insurance', icon: '🛡️', count: documents.filter(d => d.type === 'insurance').length },
    { id: 'other', name: 'Other', icon: '📁', count: documents.filter(d => d.type === 'other').length }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'will': '📜',
      'trust': '🏛️',
      'power-of-attorney': '⚖️',
      'healthcare': '🏥',
      'insurance': '🛡️',
      'other': '📁'
    }
    return typeMap[type] || '📄'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Vault
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Securely store, manage, and share your estate planning documents
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/vault/upload"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            >
              + Upload Document
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📄</span>
              <span className="text-2xl font-bold">{documents.length}</span>
            </div>
            <p className="text-blue-100">Total Documents</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">✅</span>
              <span className="text-2xl font-bold">{documents.filter(d => d.notarized).length}</span>
            </div>
            <p className="text-green-100">Notarized</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👥</span>
              <span className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.shared, 0)}</span>
            </div>
            <p className="text-purple-100">Total Shares</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">💾</span>
              <span className="text-2xl font-bold">
                {(documents.reduce((sum, d) => sum + parseFloat(d.size), 0)).toFixed(1)} MB
              </span>
            </div>
            <p className="text-orange-100">Storage Used</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Document Types */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Document Types</h3>
              <div className="space-y-2">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      filterType === type.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-3">QUICK ACTIONS</h4>
                <div className="space-y-2">
                  <Link
                    href="/vault/upload"
                    className="block w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    📤 Upload Document
                  </Link>
                  <Link
                    href="/vault/shared"
                    className="block w-full text-left p-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    👥 Shared with Me
                  </Link>
                  <Link
                    href="/vault/archived"
                    className="block w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    📦 Archived
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  ☰
                </button>
              </div>
            </div>

            {/* Documents Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                          <p className="text-sm text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {doc.notarized && (
                          <span className="text-green-600 text-sm">🔗 Notarized</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <p>📅 Modified: {doc.lastModified}</p>
                      {doc.shared > 0 && (
                        <p>👥 Shared with {doc.shared} people</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        View
                      </button>
                      <button className="bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                        ⋯
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Document</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Modified</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                {doc.notarized && (
                                  <p className="text-sm text-green-600">🔗 Blockchain Notarized</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                            {doc.type.replace('-', ' ')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{doc.lastModified}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{doc.size}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                ⋯
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                </p>
                <Link
                  href="/vault/upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Upload Document
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
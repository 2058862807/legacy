'use client'
import { useState, useRef } from 'react'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import Link from 'next/link'

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  id: string
  type: string
  thumbnail?: string
}

export default function VaultUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('will')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const documentTypes = [
    { id: 'will', name: 'Last Will & Testament', icon: '📜', description: 'Your primary estate planning document' },
    { id: 'trust', name: 'Trust Document', icon: '🏛️', description: 'Living or testamentary trusts' },
    { id: 'power-of-attorney', name: 'Power of Attorney', icon: '⚖️', description: 'Financial and legal authority documents' },
    { id: 'healthcare', name: 'Healthcare Directive', icon: '🏥', description: 'Medical decisions and living will' },
    { id: 'insurance', name: 'Insurance Policy', icon: '🛡️', description: 'Life, disability, and other insurance' },
    { id: 'financial', name: 'Financial Document', icon: '💰', description: 'Bank statements, investment accounts' },
    { id: 'property', name: 'Property Deed', icon: '🏠', description: 'Real estate and property ownership' },
    { id: 'other', name: 'Other Document', icon: '📄', description: 'Additional estate planning documents' }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const id = Math.random().toString(36).substr(2, 9)
      
      newFiles.push({
        file,
        progress: 0,
        status: 'uploading',
        id,
        type: selectedCategory
      })
    }
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100)
          return {
            ...file,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'uploading'
          }
        }
        return file
      }))
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress: 100, status: 'completed' }
          : file
      ))
    }, 3000)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/vault" className="hover:text-blue-600">Document Vault</Link>
            <span>→</span>
            <span>Upload Document</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
          <p className="text-gray-600">
            Securely upload your estate planning documents with blockchain notarization
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document Type Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Document Type</h3>
              <div className="space-y-2">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCategory(type.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === type.id
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Security Features</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">🔒</span>
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🔗</span>
                    <span>Blockchain notarization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600">👥</span>
                    <span>Controlled sharing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="text-6xl text-gray-400">📁</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Drag & drop your files here
                  </h3>
                  <p className="text-gray-500 mb-4">
                    or click to browse from your device
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Choose Files
                  </button>
                </div>
                
                <div className="text-sm text-gray-400">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">
                            {documentTypes.find(t => t.id === file.type)?.icon || '📄'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {file.file.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {formatFileSize(file.file.size)}
                            </span>
                            {file.status === 'completed' && (
                              <span className="text-green-600">✅</span>
                            )}
                            {file.status === 'uploading' && (
                              <span className="text-blue-600">⏳</span>
                            )}
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                file.status === 'completed' ? 'bg-green-500' : 
                                file.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {files.filter(f => f.status === 'completed').length} of {files.length} files uploaded
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setFiles([])}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Clear All
                    </button>
                    
                    {files.every(f => f.status === 'completed') && (
                      <Link
                        href="/vault"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        View in Vault
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔗</span>
                    <div>
                      <h4 className="font-medium">Blockchain Notarization</h4>
                      <p className="text-sm text-gray-600">Create an immutable timestamp on Polygon blockchain</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-medium">Share with Beneficiaries</h4>
                      <p className="text-sm text-gray-600">Automatically share with designated heirs</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔔</span>
                    <div>
                      <h4 className="font-medium">Update Notifications</h4>
                      <p className="text-sm text-gray-600">Notify when documents are accessed or modified</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

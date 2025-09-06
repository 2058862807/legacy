'use client'
import React, { useState, useEffect } from 'react'

interface HealthStatus {
  status: string
  service?: string
  version?: string
  api_version?: string
  error?: string
}

interface ListResponse {
  documents: any[]
  error?: string
}

export default function DebugPage() {
  const [baseUrl, setBaseUrl] = useState<string>('')
  const [rootHealth, setRootHealth] = useState<HealthStatus | null>(null)
  const [v1Health, setV1Health] = useState<HealthStatus | null>(null)
  const [listEndpoints, setListEndpoints] = useState<{[key: string]: ListResponse | null}>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get base URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not set'
    setBaseUrl(apiUrl)

    // Test health endpoints
    const testHealthEndpoints = async () => {
      setLoading(true)

      try {
        // Test root health endpoint
        const rootResponse = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (rootResponse.ok) {
          const rootData = await rootResponse.json()
          setRootHealth(rootData)
        } else {
          setRootHealth({
            status: 'error',
            error: `HTTP ${rootResponse.status}: ${rootResponse.statusText}`
          })
        }
      } catch (error) {
        setRootHealth({
          status: 'error',
          error: error instanceof Error ? error.message : 'Network error'
        })
      }

      try {
        // Test v1 health endpoint
        const v1Response = await fetch(`${apiUrl}/v1/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (v1Response.ok) {
          const v1Data = await v1Response.json()
          setV1Health(v1Data)
        } else {
          setV1Health({
            status: 'error', 
            error: `HTTP ${v1Response.status}: ${v1Response.statusText}`
          })
        }
      } catch (error) {
        setV1Health({
          status: 'error',
          error: error instanceof Error ? error.message : 'Network error'
        })
      }

      // Test the critical list endpoints that were added to fix 502 errors
      const testUserEmail = 'test@example.com'
      const listEndpointsToTest = [
        '/list',
        '/v1/list', 
        '/api/list',
        '/api/v1/list'
      ]

      const listResults: {[key: string]: ListResponse | null} = {}
      
      for (const endpoint of listEndpointsToTest) {
        try {
          const listResponse = await fetch(`${apiUrl}${endpoint}?user_email=${encodeURIComponent(testUserEmail)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (listResponse.ok) {
            const listData = await listResponse.json()
            listResults[endpoint] = listData
          } else {
            listResults[endpoint] = {
              documents: [],
              error: `HTTP ${listResponse.status}: ${listResponse.statusText}`
            }
          }
        } catch (error) {
          listResults[endpoint] = {
            documents: [],
            error: error instanceof Error ? error.message : 'Network error'
          }
        }
      }
      
      setListEndpoints(listResults)
      setLoading(false)
    }

    testHealthEndpoints()
  }, [])

  const getStatusColor = (status: HealthStatus | null) => {
    if (!status) return 'text-gray-500'
    if (status.status === 'ok') return 'text-green-600'
    return 'text-red-600'
  }

  const getStatusBg = (status: HealthStatus | null) => {
    if (!status) return 'bg-gray-100'
    if (status.status === 'ok') return 'bg-green-50 border-green-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Debug Page</h1>
          <p className="text-xl text-gray-600">
            Debug information for NexteraEstate API connectivity
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Base API URL</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {baseUrl}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Environment Variables</label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">NEXT_PUBLIC_API_URL</span>
                  <span className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_API_URL || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">NODE_ENV</span>
                  <span className="text-sm text-gray-600">{process.env.NODE_ENV || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical List Endpoints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Critical List Endpoints (502 Fix)</h2>
          <p className="text-gray-600 mb-6">Testing the newly added endpoints that were causing 502 errors in production.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(listEndpoints).map(([endpoint, result]) => (
              <div key={endpoint} className={`p-4 border rounded-lg ${
                result?.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <h3 className="font-medium text-gray-900 mb-2">{endpoint}</h3>
                {loading ? (
                  <p className="text-gray-500">Testing...</p>
                ) : result?.error ? (
                  <p className="text-red-600 text-sm">{result.error}</p>
                ) : (
                  <div>
                    <p className="text-green-600 text-sm">✅ Working</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Documents: {result?.documents?.length || 0}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Health Check Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Root Health */}
          <div className={`rounded-xl shadow-sm border p-6 ${getStatusBg(rootHealth)}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Root Health Check
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Endpoint</span>
                <span className="font-mono text-sm">/health</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={`font-semibold ${getStatusColor(rootHealth)}`}>
                  {loading ? 'Testing...' : rootHealth?.status || 'No response'}
                </span>
              </div>

              {rootHealth && rootHealth.status === 'ok' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Service</span>
                    <span className="text-sm">{rootHealth.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Version</span>
                    <span className="text-sm">{rootHealth.version}</span>
                  </div>
                </>
              )}

              {rootHealth?.error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                  <p className="text-sm text-red-800">{rootHealth.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* V1 Health */}
          <div className={`rounded-xl shadow-sm border p-6 ${getStatusBg(v1Health)}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              V1 Health Check
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Endpoint</span>
                <span className="font-mono text-sm">/v1/health</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={`font-semibold ${getStatusColor(v1Health)}`}>
                  {loading ? 'Testing...' : v1Health?.status || 'No response'}
                </span>
              </div>

              {v1Health && v1Health.status === 'ok' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Service</span>
                    <span className="text-sm">{v1Health.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Version</span>
                    <span className="text-sm">{v1Health.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">API Version</span>
                    <span className="text-sm">{v1Health.api_version}</span>
                  </div>
                </>
              )}

              {v1Health?.error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                  <p className="text-sm text-red-800">{v1Health.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Raw Response Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Raw Response Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Root Health (/health)</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {rootHealth ? JSON.stringify(rootHealth, null, 2) : 'No data'}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">V1 Health (/v1/health)</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {v1Health ? JSON.stringify(v1Health, null, 2) : 'No data'}
              </pre>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">List Endpoints Test Results</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
              {Object.keys(listEndpoints).length > 0 ? JSON.stringify(listEndpoints, null, 2) : 'No data'}
            </pre>
          </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Tests
            </button>
            <a
              href={`${baseUrl}/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Open /health in Browser
            </a>
            <a
              href={`${baseUrl}/v1/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Open /v1/health in Browser
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
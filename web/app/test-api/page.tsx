'use client'
import React, { useState, useEffect } from 'react'

export default function TestAPIPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testAPIs()
  }, [])

  const testAPIs = async () => {
    const testResults: any[] = []
    
    // Test different backend URLs
    const urls = [
      'http://localhost:8001',
      'http://127.0.0.1:8001', 
      '/api', // Next.js API routes
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    ]

    for (const baseUrl of urls) {
      if (!baseUrl) continue
      
      try {
        const response = await fetch(`${baseUrl}/api/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        testResults.push({
          url: baseUrl,
          status: response.status,
          success: response.ok,
          data: response.ok ? await response.json() : await response.text()
        })
      } catch (error) {
        testResults.push({
          url: baseUrl,
          status: 'ERROR',
          success: false,
          data: (error as Error).message
        })
      }
    }

    setResults(testResults)
    setLoading(false)
  }

  const testWillCreation = async () => {
    try {
      // First create a user
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@preview.com',
          name: 'Test User',
          provider: 'google'
        })
      })

      if (!userResponse.ok) {
        throw new Error(`User creation failed: ${userResponse.status}`)
      }

      // Then try to create a will
      const willResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/wills?user_email=test@preview.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: 'CA',
          personal_info: {
            full_name: 'Test User',
            address: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zip: '12345'
          },
          assets: [{
            type: 'real_estate',
            description: 'Test property',
            value: 100000
          }],
          beneficiaries: [{
            name: 'Test Beneficiary',
            relationship: 'spouse',
            percentage: 100
          }],
          witnesses: [{
            name: 'Witness One',
            address: '123 Witness St'
          }]
        })
      })

      const willData = await willResponse.json()
      
      setResults(prev => [...prev, {
        url: 'WILL CREATION TEST',
        status: willResponse.status,
        success: willResponse.ok,
        data: willData
      }])

    } catch (error) {
      setResults(prev => [...prev, {
        url: 'WILL CREATION TEST',
        status: 'ERROR',
        success: false,
        data: (error as Error).message
      }])
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Backend URL: {process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'NOT SET'}</p>
        <button 
          onClick={testAPIs}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Retest APIs'}
        </button>
        <button 
          onClick={testWillCreation}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Will Creation
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{result.url}</h3>
              <span className={`px-2 py-1 rounded text-sm ${result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {result.status}
              </span>
            </div>
            <pre className="text-sm overflow-auto bg-gray-100 p-2 rounded">
              {typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
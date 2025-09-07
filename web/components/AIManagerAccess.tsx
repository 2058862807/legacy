import React, { useState } from 'react'
import { Settings, Brain, TrendingUp, Shield } from 'lucide-react'

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL || ""
const apiUrl = (path: string) => `${getApiBase()}/v1${path}`

export default function AIManagerAccess() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuery = async () => {
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch(apiUrl('/ai/senior-manager'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          user_email: 'admin@nexteraestate.com'
        }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: 'Failed to connect to Senior AI Manager' })
    }
    setIsLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Senior AI Manager"
      >
        <Brain className="w-5 h-5" />
        <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Senior AI Manager
        </div>
      </button>
    )
  }

  return (
    <div className="fixed top-6 right-6 bg-white rounded-lg shadow-2xl border z-50 w-96 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Senior AI Manager</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setQuery('System status overview')}
            className="p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            System Status
          </button>
          <button
            onClick={() => setQuery('Performance metrics')}
            className="p-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Performance
          </button>
        </div>

        {/* Query Input */}
        <div className="space-y-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your Senior AI Manager about system status, optimizations, or strategic recommendations..."
            className="w-full p-2 border rounded-lg resize-none h-20 text-sm"
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || isLoading}
            className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Analyzing...' : 'Ask AI Manager'}
          </button>
        </div>

        {/* Response */}
        {response && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">AI Manager Response:</h4>
            <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
              {response.error ? (
                <p className="text-red-600">{response.error}</p>
              ) : (
                <div className="space-y-2">
                  <p><strong>Analysis:</strong> {response.analysis}</p>
                  {response.system_status && (
                    <div className="mt-2">
                      <p><strong>System Overview:</strong></p>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Users: {response.system_status.users}</li>
                        <li>• Documents: {response.system_status.documents}</li>
                        <li>• Wills: {response.system_status.wills}</li>
                        <li>• Blockchain Transactions: {response.system_status.blockchain_transactions}</li>
                        <li>• Supported States: {response.system_status.compliance_states}</li>
                      </ul>
                      {response.system_status.recommendations && (
                        <div className="mt-2">
                          <p><strong>Recommendations:</strong></p>
                          <ul className="text-xs mt-1 space-y-1">
                            {response.system_status.recommendations.map((rec: string, i: number) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <p><strong>Your Senior AI Manager can help with:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>• System performance monitoring</li>
            <li>• Strategic recommendations</li>
            <li>• Resource optimization</li>
            <li>• Production readiness assessment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
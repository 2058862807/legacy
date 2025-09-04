'use client'

export default function DebugPage() {
  const runDiagnostics = async () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    console.log('🔍 DIAGNOSTICS STARTING')
    console.log('BASE URL:', base)
    
    try {
      console.log('🏥 Testing health endpoint...')
      const healthResponse = await fetch(`${base}/api/health`, { 
        credentials: 'include',
        mode: 'cors'
      })
      console.log('Health Status:', healthResponse.status)
      console.log('Health Response:', await healthResponse.text())
    } catch (e) { 
      console.error('❌ Health error:', e) 
    }
    
    try {
      console.log('📋 Testing wills endpoint...')
      const willsResponse = await fetch(`${base}/api/wills`, { 
        credentials: 'include',
        mode: 'cors'
      })
      console.log('Wills Status:', willsResponse.status)
    } catch (e) { 
      console.error('❌ Wills error:', e) 
    }
    
    try {
      console.log('👤 Testing users endpoint...')
      const usersResponse = await fetch(`${base}/api/users`, { 
        credentials: 'include',
        mode: 'cors'
      })
      console.log('Users Status:', usersResponse.status)
    } catch (e) { 
      console.error('❌ Users error:', e) 
    }
    
    try {
      console.log('🤖 Testing AI team endpoint...')
      const aiResponse = await fetch(`${base}/api/ai-team/communicate`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'ping',
          recipient: 'team',
          priority: 'normal'
        }),
        credentials: 'include',
        mode: 'cors'
      })
      console.log('AI Team Status:', aiResponse.status)
    } catch (e) { 
      console.error('❌ AI Team error:', e) 
    }
    
    console.log('🔍 DIAGNOSTICS COMPLETE - Check console for full results')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 NexteraEstate Debug Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>Backend Base URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'NOT SET'}</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Diagnostics</h2>
          <button 
            onClick={runDiagnostics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🚀 Run API Connection Tests
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Results will appear in browser console (F12 → Console)
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manual Test Commands</h2>
          <div className="space-y-2 text-sm font-mono bg-gray-100 p-4 rounded">
            <div>// Run this in browser console:</div>
            <div className="text-blue-600">
              {`(async () => {
  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  console.log('BASE', base)
  try {
    const r = await fetch(\`\${base}/api/health\`, { credentials: 'include' })
    console.log('health', r.status, await r.text())
  } catch (e) { console.error('health error', e) }
})() `}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
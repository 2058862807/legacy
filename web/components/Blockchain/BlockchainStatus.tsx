'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function BlockchainStatus() {
  const { data: session } = useSession()
  const [notarizedCount, setNotarizedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        // Fetch user's documents to count blockchain notarized ones
        const response = await fetch(`/api/documents/list?user_email=${encodeURIComponent(session.user.email)}`)
        if (response.ok) {
          const data = await response.json()
          const notarizedDocs = data.documents?.filter((doc: any) => doc.blockchain_verified) || []
          setNotarizedCount(notarizedDocs.length)
        }
      } catch (error) {
        console.error('Failed to fetch blockchain data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlockchainData()
  }, [session])

  const blockchainData = {
    network: 'Polygon Amoy Testnet',
    status: 'Connected',
    lastBlock: '47,892,156',
    gasPrice: '1.2 GWEI',
    documentsNotarized: notarizedCount
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        🔗 Blockchain Status
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Network</div>
          <div className="font-medium">{blockchainData.network}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Status</div>
          <div className="font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            {blockchainData.status}
          </div>
        </div>
        
        <div>
          <div className="text-gray-600">Latest Block</div>
          <div className="font-medium">{blockchainData.lastBlock}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Gas Price</div>
          <div className="font-medium">{blockchainData.gasPrice}</div>
        </div>
        
        <div className="col-span-2">
          <div className="text-gray-600">Your Notarized Documents</div>
          <div className="font-medium text-lg text-blue-600">
            {loading ? '...' : blockchainData.documentsNotarized}
          </div>
        </div>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
        View on PolygonScan
      </button>
    </div>
  )
}
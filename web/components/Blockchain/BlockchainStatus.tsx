export default function BlockchainStatus() {
  const blockchainData = {
    network: 'Polygon Amoy Testnet',
    status: 'Connected',
    lastBlock: '47,892,156',
    gasPrice: '1.2 GWEI',
    documentsNotarized: 7
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
            {blockchainData.documentsNotarized}
          </div>
        </div>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
        View on PolygonScan
      </button>
    </div>
  )
}
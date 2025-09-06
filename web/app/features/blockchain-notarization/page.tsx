import Link from 'next/link'

export const metadata = {
  title: 'Blockchain Notarization - NexteraEstate',
  description: 'Secure document timestamps on Blockchain for immutable proof of authenticity and legal validity with MetaMask integration.',
}

export default function BlockchainNotarizationPage() {
  return (
    <main className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-6">🔗</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Blockchain Notarization
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Secure document timestamps on Blockchain for immutable proof of authenticity and legal validity
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold mb-3">Immutable Timestamps</h3>
          <p className="text-gray-600 mb-4">
            Create cryptographic proofs of document existence at specific dates and times, permanently recorded on blockchain.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🦊</div>
          <h3 className="text-lg font-semibold mb-3">MetaMask Integration</h3>
          <p className="text-gray-600 mb-4">
            Connect your MetaMask wallet for seamless blockchain transactions with complete user control over private keys.
          </p>
          <Link href="/notary" className="text-blue-600 hover:text-blue-800 font-medium">
            Try Notarization →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold mb-3">Polygon Network</h3>
          <p className="text-gray-600 mb-4">
            Lightning-fast, low-cost transactions on Polygon blockchain with full Ethereum compatibility and security.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-3">Public Verification</h3>
          <p className="text-gray-600 mb-4">
            Anyone can verify document authenticity using transaction hash on Polygonscan blockchain explorer.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-3">Instant Processing</h3>
          <p className="text-gray-600 mb-4">
            Documents are hashed and notarized within seconds, providing immediate blockchain confirmation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">⚖️</div>
          <h3 className="text-lg font-semibold mb-3">Legal Validity</h3>
          <p className="text-gray-600 mb-4">
            Blockchain timestamps provide legally admissible evidence of document existence and integrity.
          </p>
        </div>
      </div>

      {/* Technical Standards */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Standards</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🔒 Cryptographic Security</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>SHA-256 cryptographic hashing algorithm</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Ethereum-compatible blockchain infrastructure</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Decentralized verification without intermediaries</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🌍 Network Benefits</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Low transaction fees (typically under $0.01)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Fast confirmation times (2-3 seconds)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Environmentally sustainable proof-of-stake</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Upload Document</h3>
            <p className="text-sm text-gray-600">Select your document file for blockchain notarization and timestamp creation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Generate Hash</h3>
            <p className="text-sm text-gray-600">Document is processed with SHA-256 algorithm to create unique cryptographic fingerprint</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Blockchain Recording</h3>
            <p className="text-sm text-gray-600">Hash is permanently recorded on Polygon blockchain via MetaMask transaction</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Verification Link</h3>
            <p className="text-sm text-gray-600">Receive Polygonscan link for permanent public verification of your document</p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Legal Documents</h3>
            <p className="text-gray-600 text-sm">Wills, contracts, agreements, and legal filings requiring timestamp proof</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Intellectual Property</h3>
            <p className="text-gray-600 text-sm">Patents, copyrights, trademarks, and creative work protection</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Business Records</h3>
            <p className="text-gray-600 text-sm">Financial statements, audit reports, and corporate governance documents</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Academic Credentials</h3>
            <p className="text-gray-600 text-sm">Diplomas, certificates, research papers, and educational achievements</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Medical Records</h3>
            <p className="text-gray-600 text-sm">Health documents, treatment records, and medical research data</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Digital Assets</h3>
            <p className="text-gray-600 text-sm">Software code, digital art, NFT metadata, and online content</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Documents?</h2>
        <p className="text-lg opacity-90 mb-6">
          Create immutable proof of your document's authenticity with blockchain technology
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/notary" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Start Notarization
          </Link>
          <Link href="/login" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </div>
    </main>
  )
}
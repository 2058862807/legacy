'use client'
import MetaMaskNotarization from '../../components/Blockchain/MetaMaskNotarization'
import WalletButton from '../../components/Wallet/WalletButton'

export default function NotaryPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Blockchain Notarization
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Secure your documents on the Polygon blockchain using your MetaMask wallet
        </p>
        <div className="flex justify-center">
          <WalletButton />
        </div>
      </div>

      {/* Main Notarization Component */}
      <MetaMaskNotarization />

      {/* Information Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6">How MetaMask Blockchain Notarization Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">1. Connect MetaMask</h3>
            <p className="text-gray-600">
              Connect your MetaMask wallet to sign transactions with your own private key. No server-side keys needed!
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">2. Hash & Sign</h3>
            <p className="text-gray-600">
              Your document is hashed locally, then you sign a blockchain transaction containing the hash using MetaMask.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">3. Blockchain Proof</h3>
            <p className="text-gray-600">
              Your document hash is permanently recorded on Polygon blockchain with a verifiable timestamp and your signature.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔐 Security Benefits</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span><strong>Your keys, your crypto:</strong> You maintain full control of your private keys</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span><strong>Decentralized:</strong> No reliance on centralized servers or third-party key storage</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span><strong>Transparent:</strong> All transactions are publicly verifiable on Polygonscan</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span><strong>Privacy:</strong> Only the hash is stored on blockchain, not your document content</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Powered by Polygon</h3>
            <p className="text-purple-100">
              Fast, low-cost transactions on the Polygon Amoy testnet. 
              Perfect for document notarization with minimal fees.
            </p>
          </div>
          <div className="text-6xl">⬟</div>
        </div>
      </div>
    </main>
  )
}
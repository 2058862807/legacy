'use client'
import React, { useState } from 'react'
import { useWallet } from '../Wallet/MetaMaskProvider'
import { ethers } from 'ethers'

interface NotarizationResult {
  txHash: string
  explorerUrl: string
  timestamp: string
}

export default function MetaMaskNotarization() {
  const { isConnected, account, signer, sendTransaction } = useWallet()
  const [content, setContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<NotarizationResult | null>(null)
  const [error, setError] = useState('')

  const generateHash = (text: string): string => {
    return ethers.keccak256(ethers.toUtf8Bytes(text))
  }

  const notarizeDocument = async () => {
    if (!isConnected || !signer || !content.trim()) return

    setIsProcessing(true)
    setError('')
    setResult(null)

    try {
      // Generate hash of the content
      const hash = generateHash(content.trim())
      console.log('Generated hash:', hash)

      // Prepare transaction data with the hash
      const data = ethers.hexlify(ethers.toUtf8Bytes(`NOTARY:${hash}`))

      // Send transaction to user's own address (self-transaction with data)
      const txHash = await sendTransaction(account!, data)

      // Create result
      const notarizationResult: NotarizationResult = {
        txHash,
        explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`,
        timestamp: new Date().toISOString()
      }

      setResult(notarizationResult)
      setContent('') // Clear form

    } catch (err: any) {
      console.error('Notarization failed:', err)
      setError(err.message || 'Failed to notarize document')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-800">MetaMask Required</h3>
            <p className="text-yellow-700">Please connect your MetaMask wallet to notarize documents on the blockchain.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Blockchain Notarization
        </h2>
        <p className="text-gray-600">
          Secure your document with an immutable timestamp on the Polygon blockchain using your MetaMask wallet.
        </p>
      </div>

      {/* Document Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Document Content to Notarize
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the text or document content you want to notarize..."
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={isProcessing}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{content.length} characters</span>
          <span>Hash will be stored on blockchain</span>
        </div>
      </div>

      {/* Preview Hash */}
      {content.trim() && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Document Hash Preview:</div>
          <div className="font-mono text-sm text-gray-600 break-all">
            {generateHash(content.trim())}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={notarizeDocument}
        disabled={!content.trim() || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Processing Transaction...</span>
          </div>
        ) : (
          'Notarize on Blockchain'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-red-500 text-xl">❌</div>
            <div>
              <h4 className="font-semibold text-red-800">Transaction Failed</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-green-500 text-2xl">✅</div>
            <div>
              <h4 className="font-semibold text-green-800">Document Successfully Notarized!</h4>
              <p className="text-green-700 text-sm">Your document has been timestamped on the Polygon blockchain.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700">Transaction Hash:</div>
              <div className="font-mono text-sm text-gray-600 break-all bg-white p-2 rounded border">
                {result.txHash}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">Timestamp:</div>
              <div className="text-sm text-gray-600">
                {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="pt-3">
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>View on Polygonscan</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          🔒 Your document content is hashed locally and only the hash is stored on the blockchain. 
          The original content remains private to you.
        </p>
      </div>
    </div>
  )
}
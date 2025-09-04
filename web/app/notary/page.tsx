'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ethers } from 'ethers'
import Navbar from '../../components/Layout/Navbar'
import Footer from '../../components/Footer'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function NotaryPage() {
  const { data: session } = useSession()
  const [account, setAccount] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [hash, setHash] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const NOTARY_ADDRESS = process.env.NEXT_PUBLIC_NOTARY_ADDRESS || ''
  const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '137'
  const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER || 'https://amoy.polygonscan.com'

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed')
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setAccount(accounts[0])
      setError('')
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet')
    }
  }

  const generateHash = async (content: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleTextHash = async () => {
    if (!text) return
    
    try {
      setLoading(true)
      const textHash = await generateHash(text)
      setHash(textHash)
      setError('')
    } catch (error: any) {
      setError(error.message || 'Failed to generate hash')
    } finally {
      setLoading(false)
    }
  }

  const handleFileHash = async () => {
    if (!file) return

    try {
      setLoading(true)
      const fileContent = await file.text()
      const fileHash = await generateHash(fileContent)
      setHash(fileHash)
      setError('')
    } catch (error: any) {
      setError(error.message || 'Failed to hash file')
    } finally {
      setLoading(false)
    }
  }

  const notarizeOnBlockchain = async () => {
    if (!hash || !account) return

    try {
      setLoading(true)
      setError('')

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Switch to correct network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(CHAIN_ID).toString(16)}` }]
      })

      // Simple transaction to store hash in transaction data
      const tx = await signer.sendTransaction({
        to: NOTARY_ADDRESS || signer.address,
        value: 0,
        data: `0x${hash}`
      })

      setTxHash(tx.hash)
      await tx.wait()
      
      setError('')
    } catch (error: any) {
      setError(error.message || 'Failed to notarize on blockchain')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blockchain Notarization
          </h1>
          <p className="text-xl text-gray-600">
            Secure your documents with immutable blockchain verification on Polygon
          </p>
        </div>

        <div className="space-y-8">
          {/* MetaMask Connection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet</h2>
            
            {!account ? (
              <button
                onClick={connectWallet}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Connect MetaMask
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
              </div>
            )}
          </div>

          {/* Hash Generation */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Document Hash</h2>
            
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter text to hash..."
                />
                <button
                  onClick={handleTextHash}
                  disabled={!text || loading}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hash Text
                </button>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFileHash}
                  disabled={!file || loading}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hash File
                </button>
              </div>

              {/* Generated Hash */}
              {hash && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Hash (SHA-256)
                  </label>
                  <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                    {hash}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Notarization */}
          {hash && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notarize on Blockchain</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  This will create an immutable record of your document hash on the Polygon blockchain.
                </p>
                
                <button
                  onClick={notarizeOnBlockchain}
                  disabled={!account || !hash || loading}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Notarizing...' : 'Notarize on Polygon'}
                </button>

                {txHash && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ Successfully Notarized!</h3>
                    <p className="text-green-700 mb-2">Transaction Hash:</p>
                    <div className="font-mono text-sm bg-white p-3 rounded border break-all mb-3">
                      {txHash}
                    </div>
                    <a
                      href={`${EXPLORER}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 inline-block"
                    >
                      View on Polygonscan →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❌</span>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Generate Hash</h3>
                <p className="text-sm text-gray-600">Create a unique SHA-256 hash of your document</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Connect Wallet</h3>
                <p className="text-sm text-gray-600">Use MetaMask to connect to Polygon network</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Blockchain Record</h3>
                <p className="text-sm text-gray-600">Create permanent, tamper-proof verification</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  network: ethers.Network | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToPolygon: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  sendTransaction: (to: string, data: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Polygon Mainnet configuration
const POLYGON_MAINNET = {
  chainId: '0x89', // 137 in hex (Polygon Mainnet)
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/']
}

interface MetaMaskProviderProps {
  children: ReactNode
}

export function MetaMaskProvider({ children }: MetaMaskProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [network, setNetwork] = useState<ethers.Network | null>(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Initialize connection on page load
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      checkConnection()
    }
  }, [])

  // Check existing connection
  const checkConnection = async () => {
    try {
      if (!isMetaMaskInstalled()) return

      const web3Provider = new ethers.BrowserProvider(window.ethereum as any)
      const accounts = await web3Provider.listAccounts()
      
      if (accounts.length > 0) {
        const currentSigner = await web3Provider.getSigner()
        const currentNetwork = await web3Provider.getNetwork()
        
        setAccount(accounts[0].address)
        setProvider(web3Provider)
        setSigner(currentSigner)
        setNetwork(currentNetwork)
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install MetaMask to continue.')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum as any)
      const currentSigner = await web3Provider.getSigner()
      const currentNetwork = await web3Provider.getNetwork()
      const address = await currentSigner.getAddress()

      setAccount(address)
      setProvider(web3Provider)
      setSigner(currentSigner)
      setNetwork(currentNetwork)
      setIsConnected(true)

      // Auto-switch to Polygon Amoy if not already connected
      if (currentNetwork.chainId !== BigInt(80002)) {
        await switchToPolygon()
      }

    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setNetwork(null)
    setIsConnected(false)
  }

  // Switch to Polygon Amoy network
  const switchToPolygon = async () => {
    if (!isMetaMaskInstalled()) return

    try {
      // Try to switch to Polygon Amoy
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_MAINNET.chainId }],
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_AMOY],
          })
        } catch (addError) {
          console.error('Error adding Polygon network:', addError)
          throw addError
        }
      } else {
        console.error('Error switching network:', switchError)
        throw switchError
      }
    }
  }

  // Sign message
  const signMessage = async (message: string): Promise<string> => {
    if (!signer) throw new Error('No signer available')
    return await signer.signMessage(message)
  }

  // Send transaction 
  const sendTransaction = async (to: string, data: string): Promise<string> => {
    if (!signer) throw new Error('No signer available')
    
    const tx = await signer.sendTransaction({
      to: to,
      data: data,
      value: 0
    })
    
    return tx.hash
  }

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== account) {
          checkConnection()
        }
      }

      const handleChainChanged = () => {
        checkConnection()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [account])

  const value: WalletContextType = {
    account,
    isConnected,
    isConnecting,
    provider,
    signer,
    network,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    signMessage,
    sendTransaction
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a MetaMaskProvider')
  }
  return context
}
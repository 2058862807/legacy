// Blockchain Integration for NextEra Estate
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import CryptoJS from 'crypto-js';

// Smart Contract ABI for Estate Will Contract
const ESTATE_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_documentHash", "type": "string"},
      {"internalType": "address[]", "name": "_beneficiaries", "type": "address[]"},
      {"internalType": "uint256[]", "name": "_percentages", "type": "uint256[]"}
    ],
    "name": "createWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
    "name": "notarizeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
    "name": "getDocumentTimestamp",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "executeWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "wills",
    "outputs": [
      {"internalType": "string", "name": "documentHash", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "executed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Demo contract address (for testing - would be deployed on mainnet/testnet)
const ESTATE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.connected = false;
  }

  // Initialize Web3 connection
  async connectWallet() {
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (!ethereumProvider) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      this.provider = new ethers.BrowserProvider(ethereumProvider);
      
      // Request account access
      await ethereumProvider.request({ method: 'eth_requestAccounts' });
      
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(ESTATE_CONTRACT_ADDRESS, ESTATE_CONTRACT_ABI, this.signer);
      
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      
      this.connected = true;
      
      return {
        success: true,
        address,
        network: network.name,
        chainId: network.chainId
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate document hash for blockchain notarization
  generateDocumentHash(document) {
    const documentString = JSON.stringify(document);
    return CryptoJS.SHA256(documentString).toString();
  }

  // Notarize document on blockchain
  async notarizeDocument(document) {
    try {
      if (!this.connected) {
        throw new Error('Wallet not connected');
      }

      const documentHash = this.generateDocumentHash(document);
      
      // For demo purposes, simulate the transaction
      const simulatedTx = {
        hash: `0x${CryptoJS.SHA256(Date.now().toString()).toString().substring(0, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        timestamp: Date.now(),
        gasUsed: "21000",
        status: "success"
      };

      return {
        success: true,
        transactionHash: simulatedTx.hash,
        blockNumber: simulatedTx.blockNumber,
        documentHash,
        timestamp: simulatedTx.timestamp,
        gasUsed: simulatedTx.gasUsed,
        status: 'notarized'
      };
    } catch (error) {
      console.error('Document notarization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create smart contract will
  async createSmartWill(willData, beneficiaries) {
    try {
      if (!this.connected) {
        throw new Error('Wallet not connected');
      }

      const willHash = this.generateDocumentHash(willData);
      
      // Simulate smart contract deployment
      const simulatedTx = {
        hash: `0x${CryptoJS.SHA256(Date.now().toString()).toString().substring(0, 64)}`,
        contractAddress: `0x${CryptoJS.SHA256(willHash).toString().substring(0, 40)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: "150000"
      };

      return {
        success: true,
        transactionHash: simulatedTx.hash,
        contractAddress: simulatedTx.contractAddress,
        blockNumber: simulatedTx.blockNumber,
        willHash,
        beneficiaries: beneficiaries.map(b => ({
          address: `0x${CryptoJS.SHA256(b.email).toString().substring(0, 40)}`,
          name: b.name,
          percentage: b.percentage
        })),
        gasUsed: simulatedTx.gasUsed,
        status: 'deployed'
      };
    } catch (error) {
      console.error('Smart will creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify document authenticity
  async verifyDocument(documentHash) {
    try {
      // Simulate blockchain verification
      const mockVerification = {
        isVerified: true,
        timestamp: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        transactionHash: `0x${CryptoJS.SHA256(documentHash).toString().substring(0, 64)}`,
        notarizedBy: await this.signer?.getAddress() || '0x1234...5678'
      };

      return {
        success: true,
        ...mockVerification
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get wallet info
  async getWalletInfo() {
    try {
      if (!this.connected || !this.signer) {
        return { connected: false };
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      return {
        connected: true,
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        chainId: network.chainId
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Manage cryptocurrency assets in estate
  async getCryptoAssets() {
    try {
      if (!this.connected) {
        return { assets: [] };
      }

      // Simulate crypto portfolio
      const mockAssets = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '2.45',
          usdValue: '5,890.25',
          address: await this.signer.getAddress()
        },
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          balance: '0.125',
          usdValue: '5,437.50',
          address: 'bc1q...' // Bitcoin address would be different
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '1,500.00',
          usdValue: '1,500.00',
          address: await this.signer.getAddress()
        }
      ];

      return {
        success: true,
        assets: mockAssets,
        totalValue: '12,827.75'
      };
    } catch (error) {
      return {
        success: false,
        assets: [],
        error: error.message
      };
    }
  }

  // Manage NFT assets
  async getNFTAssets() {
    try {
      // Simulate NFT collection
      const mockNFTs = [
        {
          id: '1',
          name: 'CryptoPunk #1234',
          collection: 'CryptoPunks',
          image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=NFT1',
          value: '15.5 ETH',
          contractAddress: '0x...1234'
        },
        {
          id: '2',
          name: 'Bored Ape #5678',
          collection: 'Bored Ape Yacht Club',
          image: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=NFT2',
          value: '12.2 ETH',
          contractAddress: '0x...5678'
        },
        {
          id: '3',
          name: 'Art Block #9999',
          collection: 'Art Blocks Curated',
          image: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=NFT3',
          value: '3.8 ETH',
          contractAddress: '0x...9999'
        }
      ];

      return {
        success: true,
        nfts: mockNFTs,
        totalCount: mockNFTs.length
      };
    } catch (error) {
      return {
        success: false,
        nfts: [],
        error: error.message
      };
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.connected = false;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Utility functions
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatBalance = (balance) => {
  if (!balance) return '0';
  return parseFloat(balance).toFixed(4);
};

export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai Testnet'
  };
  return networks[chainId] || `Chain ID: ${chainId}`;
};
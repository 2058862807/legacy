"""
NexteraEstate Gasless Notarization Service
Handles blockchain transactions on behalf of users using a master wallet
"""

import os
import asyncio
import logging
from typing import Dict, Any, Optional
from decimal import Decimal
from datetime import datetime, timezone
import json

logger = logging.getLogger(__name__)

# Guarded imports for optional blockchain dependencies  
try:
    from web3 import Web3
    from eth_account import Account
    WEB3_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Web3 dependencies not available: {e}")
    WEB3_AVAILABLE = False
    Web3 = None
    Account = None

class GaslessNotaryService:
    """Handles gasless blockchain notarization for users with enhanced security"""
    
    def __init__(self):
        # Polygon network configuration
        self.rpc_url = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com/")
        self.chain_id = 137  # Polygon Mainnet
        
        # Enhanced security for master wallet
        self.master_private_key = self._get_secure_private_key()
        self.min_balance_threshold = Decimal("0.1")  # Minimum MATIC balance
        self.max_daily_transactions = 1000  # Rate limiting
        self.daily_transaction_count = 0
        self.last_reset_date = datetime.now(timezone.utc).date()
        
        # Initialize Web3 with retry logic
        self.w3 = None
        self._initialize_web3_connection()
        
        if self.master_private_key:
            self.master_account = Account.from_key(self.master_private_key)
            self.master_address = self.master_account.address
            
            # Validate the private key matches expected address
            expected_address = os.getenv("POLYGON_MASTER_WALLET", "").lower()
            if expected_address and self.master_address.lower() != expected_address:
                logger.error(f"Private key mismatch! Expected: {expected_address}, Got: {self.master_address}")
                raise ValueError("Private key does not match expected master wallet address")
            
            logger.info(f"Master wallet initialized: {self.master_address}")
            
            # Security validation
            self._validate_wallet_security()
        else:
            logger.warning("Master wallet not configured - using mock mode")
            self.master_account = None
            self.master_address = None
    
    def _get_secure_private_key(self) -> Optional[str]:
        """Securely retrieve private key with multiple fallback methods"""
        # Method 1: Environment variable (current)
        private_key = os.getenv("MASTER_WALLET_PRIVATE_KEY")
        if private_key and private_key != "YOUR_ACTUAL_PRIVATE_KEY_GOES_HERE":
            return private_key
        
        # Method 2: Encrypted file (future implementation)
        # encrypted_key_path = os.getenv("ENCRYPTED_WALLET_PATH")
        # if encrypted_key_path and os.path.exists(encrypted_key_path):
        #     return self._decrypt_wallet_file(encrypted_key_path)
        
        # Method 3: HSM integration (future)
        # hsm_key_id = os.getenv("HSM_KEY_ID")
        # if hsm_key_id:
        #     return self._get_hsm_private_key(hsm_key_id)
        
        return None
    
    def _initialize_web3_connection(self):
        """Initialize Web3 with connection retry and fallback RPCs"""
        rpc_urls = [
            self.rpc_url,
            "https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",  # Fallback
            "https://polygon-rpc.com/",  # Another fallback
        ]
        
        for rpc_url in rpc_urls:
            try:
                self.w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={'timeout': 60}))
                if self.w3.is_connected():
                    logger.info(f"Connected to Polygon via {rpc_url}")
                    break
            except Exception as e:
                logger.warning(f"Failed to connect to {rpc_url}: {e}")
                continue
        
        if not self.w3 or not self.w3.is_connected():
            logger.error("Failed to connect to any Polygon RPC")
    
    def _validate_wallet_security(self):
        """Validate wallet security and log security metrics"""
        if not self.master_address:
            return
        
        try:
            # Check if wallet has been compromised (unusual transaction patterns)
            balance = self.w3.eth.get_balance(self.master_address)
            transaction_count = self.w3.eth.get_transaction_count(self.master_address)
            
            # Log security metrics (without sensitive data)
            logger.info(f"Wallet security check: Balance positive: {balance > 0}, Tx count: {transaction_count}")
            
            # Alert if suspicious activity
            if transaction_count > 10000:  # Arbitrary threshold
                logger.warning("High transaction count detected - monitor for suspicious activity")
            
        except Exception as e:
            logger.error(f"Wallet security validation failed: {e}")
    
    async def _check_daily_limits(self) -> bool:
        """Check and enforce daily transaction limits"""
        today = datetime.now(timezone.utc).date()
        
        # Reset counter if new day
        if today > self.last_reset_date:
            self.daily_transaction_count = 0
            self.last_reset_date = today
        
        # Check if within limits
        if self.daily_transaction_count >= self.max_daily_transactions:
            logger.error(f"Daily transaction limit reached: {self.daily_transaction_count}")
            return False
        
        return True
    
    async def get_notarization_price(self, document_type: str = "will") -> Dict[str, Any]:
        """Get pricing for notarization service"""
        
        # Base pricing structure
        pricing = {
            "will": {"base_fee": 9.99, "gas_estimate": 0.02},
            "trust": {"base_fee": 14.99, "gas_estimate": 0.03},
            "power_of_attorney": {"base_fee": 7.99, "gas_estimate": 0.02},
            "bulk": {"base_fee": 24.99, "gas_estimate": 0.05}
        }
        
        price_info = pricing.get(document_type, pricing["will"])
        
        return {
            "document_type": document_type,
            "service_fee_usd": price_info["base_fee"],
            "estimated_gas_cost_usd": price_info["gas_estimate"],
            "total_price_usd": price_info["base_fee"],
            "currency": "USD",
            "description": f"Blockchain notarization for {document_type} - gas fees included",
            "benefits": [
                "Immutable blockchain record",
                "Timestamped proof of existence", 
                "Polygonscan verification link",
                "No crypto wallet required",
                "Instant notarization"
            ]
        }
    
    async def get_wallet_status(self) -> Dict[str, Any]:
        """Get comprehensive wallet status information"""
        try:
            if not WEB3_AVAILABLE or not self.w3 or not self.master_address:
                return {
                    "master_address": None,
                    "balance_matic": None,
                    "daily_transaction_count": 0,
                    "max_daily_transactions": self.max_daily_transactions,
                    "status": "not_configured"
                }
            
            # Get current balance
            balance_wei = self.w3.eth.get_balance(self.master_address)
            balance_matic = self.w3.from_wei(balance_wei, 'ether')
            
            return {
                "master_address": self.master_address,
                "balance_matic": float(balance_matic),
                "daily_transaction_count": self.daily_transaction_count,
                "max_daily_transactions": self.max_daily_transactions,
                "min_balance_threshold": float(self.min_balance_threshold),
                "status": "active" if balance_matic >= self.min_balance_threshold else "low_balance"
            }
            
        except Exception as e:
            logger.error(f"Error getting wallet status: {e}")
            return {
                "master_address": self.master_address if hasattr(self, 'master_address') else None,
                "balance_matic": None,
                "daily_transaction_count": 0,
                "max_daily_transactions": self.max_daily_transactions,
                "status": "error",
                "error": str(e)
            }

    async def check_master_wallet_balance(self) -> Dict[str, Any]:
        """Check master wallet balance and status"""
        if not self.master_address:
            return {"status": "not_configured", "balance": 0}
        
        try:
            balance_wei = self.w3.eth.get_balance(self.master_address)
            balance_matic = Web3.from_wei(balance_wei, 'ether')
            
            status = "healthy" if balance_matic >= self.min_balance_threshold else "low_balance"
            
            return {
                "status": status,
                "balance_matic": float(balance_matic),
                "balance_usd_estimate": float(balance_matic * Decimal("0.50")),  # Rough MATIC price
                "transactions_remaining": int(balance_matic / Decimal("0.001")),  # ~0.001 MATIC per tx
                "needs_refill": balance_matic < self.min_balance_threshold,
                "master_address": self.master_address
            }
        except Exception as e:
            logger.error(f"Error checking master wallet balance: {e}")
            return {"status": "error", "error": str(e)}
    
    async def create_gasless_notarization(self, 
                                        document_hash: str, 
                                        user_email: str,
                                        document_type: str = "will",
                                        payment_confirmed: bool = False) -> Dict[str, Any]:
        """Create blockchain notarization on behalf of user"""
        
        if not payment_confirmed:
            raise ValueError("Payment must be confirmed before notarization")
        
        if not self.master_account:
            # Mock mode for development
            return await self._create_mock_notarization(document_hash, user_email, document_type)
        
        try:
            # Check master wallet has sufficient balance
            balance_check = await self.check_master_wallet_balance()
            if balance_check["status"] == "low_balance":
                logger.error("Master wallet balance too low for transaction")
                raise ValueError("Service temporarily unavailable - insufficient gas balance")
            
            # Create transaction for document notarization
            # This could be a simple transaction with document hash in data field
            # Or interaction with a custom smart contract
            
            nonce = self.w3.eth.get_transaction_count(self.master_address)
            
            # Simple approach: send minimal transaction with hash in data
            transaction = {
                'nonce': nonce,
                'to': self.master_address,  # Self-send with data
                'value': 0,  # No MATIC transfer, just data storage
                'gas': 21000 + 20000,  # Base gas + data gas
                'gasPrice': self.w3.eth.gas_price,
                'data': f"0x{document_hash}",  # Store document hash
                'chainId': self.chain_id
            }
            
            # Sign transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.master_private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            tx_hash_hex = tx_hash.hex()
            
            # Wait for confirmation (optional - can be done async)
            try:
                receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
                status = "confirmed" if receipt.status == 1 else "failed"
            except Exception:
                status = "pending"
                receipt = None
            
            return {
                "success": True,
                "transaction_hash": tx_hash_hex,
                "status": status,
                "polygonscan_url": f"https://polygonscan.com/tx/{tx_hash_hex}",
                "document_hash": document_hash,
                "user_email": user_email,
                "document_type": document_type,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "network": "Polygon Mainnet",
                "gas_paid_by": "NexteraEstate",
                "block_number": receipt.blockNumber if receipt else None
            }
            
        except Exception as e:
            logger.error(f"Gasless notarization failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "user_email": user_email,
                "document_hash": document_hash,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    async def _create_mock_notarization(self, document_hash: str, user_email: str, document_type: str) -> Dict[str, Any]:
        """Create mock notarization for development/testing"""
        import secrets
        
        mock_tx_hash = f"0x{secrets.token_hex(32)}"
        
        return {
            "success": True,
            "transaction_hash": mock_tx_hash,
            "status": "confirmed",
            "polygonscan_url": f"https://polygonscan.com/tx/{mock_tx_hash}",
            "document_hash": document_hash,
            "user_email": user_email,
            "document_type": document_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "network": "Polygon Mainnet (Mock)",
            "gas_paid_by": "NexteraEstate",
            "block_number": 12345678,
            "note": "This is a mock transaction for development"
        }
    
    async def get_notarization_status(self, transaction_hash: str) -> Dict[str, Any]:
        """Check status of a notarization transaction"""
        if not self.w3 or not transaction_hash.startswith('0x'):
            return {
                "transaction_hash": transaction_hash,
                "status": "mock",
                "confirmations": 12,
                "polygonscan_url": f"https://polygonscan.com/tx/{transaction_hash}"
            }
        
        try:
            receipt = self.w3.eth.get_transaction_receipt(transaction_hash)
            current_block = self.w3.eth.block_number
            confirmations = current_block - receipt.blockNumber
            
            return {
                "transaction_hash": transaction_hash,
                "status": "confirmed" if receipt.status == 1 else "failed",
                "confirmations": confirmations,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "polygonscan_url": f"https://polygonscan.com/tx/{transaction_hash}",
                "network": "Polygon Mainnet"
            }
        except Exception as e:
            return {
                "transaction_hash": transaction_hash,
                "status": "not_found",
                "error": str(e)
            }

# Global instance
gasless_notary = GaslessNotaryService()
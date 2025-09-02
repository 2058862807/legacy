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
from web3 import Web3
from eth_account import Account
import json

logger = logging.getLogger(__name__)

class GaslessNotaryService:
    """Handles gasless blockchain notarization for users"""
    
    def __init__(self):
        # Polygon network configuration
        self.rpc_url = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com/")
        self.chain_id = 137  # Polygon Mainnet (use 80001 for Mumbai testnet)
        
        # Master wallet configuration (NexteraEstate controlled)
        self.master_private_key = os.getenv("MASTER_WALLET_PRIVATE_KEY")
        self.min_balance_threshold = Decimal("0.1")  # Minimum MATIC balance
        
        # Initialize Web3
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        if self.master_private_key:
            self.master_account = Account.from_key(self.master_private_key)
            self.master_address = self.master_account.address
            logger.info(f"Master wallet initialized: {self.master_address}")
        else:
            logger.warning("Master wallet not configured - using mock mode")
            self.master_account = None
            self.master_address = None
    
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
#!/usr/bin/env python3
"""
Polygon Wallet & Price Monitoring System
Monitors master wallet balance and MATIC price for NexteraEstate gasless blockchain service
"""

import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, List
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from web3 import Web3
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WalletPriceMonitor:
    def __init__(self):
        # Polygon configuration
        self.polygon_rpc = "https://polygon-rpc.com"
        self.master_wallet = os.environ.get('POLYGON_MASTER_WALLET', '')
        self.web3 = Web3(Web3.HTTPProvider(self.polygon_rpc))
        
        # Alert thresholds
        self.min_wallet_balance = float(os.environ.get('MIN_WALLET_BALANCE', '5.0'))  # 5 MATIC minimum
        self.price_spike_threshold = float(os.environ.get('PRICE_SPIKE_THRESHOLD', '25.0'))  # 25% spike
        self.price_drop_threshold = float(os.environ.get('PRICE_DROP_THRESHOLD', '20.0'))  # 20% drop
        
        # Email configuration
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.email_user = os.environ.get('ALERT_EMAIL_USER', '')
        self.email_password = os.environ.get('ALERT_EMAIL_PASSWORD', '')
        self.alert_recipients = os.environ.get('ALERT_RECIPIENTS', '').split(',')
        
        # Price tracking
        self.last_price = None
        self.price_history = []
        self.last_balance_alert = None
        self.last_price_alert = None
        
    async def get_wallet_balance(self) -> Optional[float]:
        """Get current MATIC balance of master wallet"""
        try:
            if not self.master_wallet:
                logger.warning("Master wallet address not configured")
                return None
                
            balance_wei = self.web3.eth.get_balance(self.master_wallet)
            balance_matic = self.web3.from_wei(balance_wei, 'ether')
            return float(balance_matic)
            
        except Exception as e:
            logger.error(f"Error getting wallet balance: {str(e)}")
            return None
    
    async def get_matic_price(self) -> Optional[Dict]:
        """Get current MATIC price from CoinGecko API"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd&include_24hr_change=true"
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        price_data = data.get('matic-network', {})
                        return {
                            'price': price_data.get('usd', 0),
                            'change_24h': price_data.get('usd_24h_change', 0),
                            'timestamp': datetime.now()
                        }
        except Exception as e:
            logger.error(f"Error getting MATIC price: {str(e)}")
            return None
    
    def send_alert_email(self, subject: str, message: str, priority: str = "normal"):
        """Send alert email to configured recipients"""
        try:
            if not self.email_user or not self.alert_recipients:
                logger.warning("Email not configured for alerts")
                return False
                
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = ', '.join(self.alert_recipients)
            msg['Subject'] = f"🚨 NexteraEstate Alert: {subject}"
            
            # Add priority headers for urgent alerts
            if priority == "urgent":
                msg['X-Priority'] = '1'
                msg['X-MSMail-Priority'] = 'High'
            
            # Create HTML email body
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">NexteraEstate Monitoring Alert</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Gasless Blockchain Service Monitoring</p>
                        </div>
                        
                        <div style="background: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 5px;">
                            <h2 style="color: #dc3545; margin-top: 0;">{subject}</h2>
                            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">
                                {message}
                            </div>
                        </div>
                        
                        <div style="background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; margin-top: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #6c757d;">
                                Generated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}<br>
                                NexteraEstate Wallet & Price Monitoring System
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
                
            logger.info(f"Alert email sent: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending alert email: {str(e)}")
            return False
    
    async def check_wallet_balance(self):
        """Check wallet balance and send alert if low"""
        balance = await self.get_wallet_balance()
        
        if balance is None:
            return
            
        logger.info(f"Current wallet balance: {balance:.4f} MATIC")
        
        # Check if balance is below threshold
        if balance < self.min_wallet_balance:
            # Avoid spamming - only alert once per day for low balance
            now = datetime.now()
            if (self.last_balance_alert is None or 
                now - self.last_balance_alert > timedelta(hours=24)):
                
                subject = f"Low Wallet Balance Alert - {balance:.4f} MATIC"
                
                message = f"""
                <h3>⚠️ Master Wallet Balance is Running Low</h3>
                <ul>
                    <li><strong>Current Balance:</strong> {balance:.4f} MATIC</li>
                    <li><strong>Minimum Threshold:</strong> {self.min_wallet_balance} MATIC</li>
                    <li><strong>Wallet Address:</strong> {self.master_wallet}</li>
                    <li><strong>Estimated Transactions Remaining:</strong> ~{int(balance * 300)} notarizations</li>
                </ul>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h4 style="color: #856404; margin-top: 0;">Recommended Actions:</h4>
                    <ol style="color: #856404;">
                        <li>Add more MATIC to the master wallet immediately</li>
                        <li>Monitor usage patterns for unusual spikes</li>
                        <li>Consider increasing the minimum threshold if needed</li>
                    </ol>
                </div>
                
                <p><strong>Impact:</strong> If the wallet runs out of MATIC, gasless blockchain notarization will fail for all users.</p>
                """
                
                self.send_alert_email(subject, message, "urgent")
                self.last_balance_alert = now
    
    async def check_price_changes(self):
        """Check MATIC price and send alert for significant changes"""
        price_data = await self.get_matic_price()
        
        if not price_data:
            return
            
        current_price = price_data['price']
        change_24h = price_data['change_24h']
        
        logger.info(f"Current MATIC price: ${current_price:.4f} (24h: {change_24h:+.2f}%)")
        
        # Store price history
        self.price_history.append(price_data)
        # Keep only last 7 days
        if len(self.price_history) > 336:  # 7 days * 48 checks per day (30min intervals)
            self.price_history.pop(0)
        
        # Check for significant price changes
        alert_needed = False
        alert_type = ""
        
        if abs(change_24h) >= self.price_spike_threshold:
            alert_needed = True
            if change_24h > 0:
                alert_type = "SPIKE"
            else:
                alert_type = "DROP"
        
        if alert_needed:
            # Avoid spamming - only alert once per 6 hours for price changes
            now = datetime.now()
            if (self.last_price_alert is None or 
                now - self.last_price_alert > timedelta(hours=6)):
                
                if alert_type == "SPIKE":
                    subject = f"MATIC Price Spike Alert - ${current_price:.4f} (+{change_24h:.1f}%)"
                    color = "#28a745"
                    impact_msg = "Higher operational costs for gasless notarization"
                else:
                    subject = f"MATIC Price Drop Alert - ${current_price:.4f} ({change_24h:.1f}%)"
                    color = "#dc3545"
                    impact_msg = "Lower operational costs - good for margins"
                
                # Calculate cost impact
                avg_gas_cost = 0.005  # MATIC per transaction
                daily_txns = 100  # Estimate
                daily_cost_usd = daily_txns * avg_gas_cost * current_price
                
                message = f"""
                <h3 style="color: {color};">📈 Significant MATIC Price Movement Detected</h3>
                <ul>
                    <li><strong>Current Price:</strong> ${current_price:.4f}</li>
                    <li><strong>24h Change:</strong> {change_24h:+.2f}%</li>
                    <li><strong>Alert Threshold:</strong> ±{self.price_spike_threshold}%</li>
                </ul>
                
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h4>Cost Impact Analysis:</h4>
                    <ul>
                        <li><strong>Per Transaction Cost:</strong> ~${avg_gas_cost * current_price:.6f} USD</li>
                        <li><strong>Daily Cost (100 txns):</strong> ~${daily_cost_usd:.2f} USD</li>
                        <li><strong>Monthly Cost Estimate:</strong> ~${daily_cost_usd * 30:.2f} USD</li>
                    </ul>
                    <p style="margin-bottom: 0;"><strong>Business Impact:</strong> {impact_msg}</p>
                </div>
                
                <div style="background: #e9ecef; padding: 15px; border-radius: 5px;">
                    <h4>Recommended Actions:</h4>
                    <ul>
                        <li>Review pricing strategy if costs are significantly impacted</li>
                        <li>Consider adjusting wallet balance thresholds</li>
                        <li>Monitor customer usage patterns</li>
                        {'<li>Consider locking in current rates with larger wallet balance</li>' if alert_type == "DROP" else '<li>Monitor for potential service cost increases</li>'}
                    </ul>
                </div>
                """
                
                priority = "urgent" if abs(change_24h) >= 50 else "normal"
                self.send_alert_email(subject, message, priority)
                self.last_price_alert = now
    
    async def generate_status_report(self) -> Dict:
        """Generate current status report"""
        balance = await self.get_wallet_balance()
        price_data = await self.get_matic_price()
        
        estimated_txns = int(balance * 300) if balance else 0
        estimated_days = estimated_txns / 100 if estimated_txns > 0 else 0  # Assuming 100 txns/day
        
        return {
            'wallet': {
                'address': self.master_wallet,
                'balance_matic': balance,
                'balance_status': 'low' if balance and balance < self.min_wallet_balance else 'ok',
                'estimated_transactions': estimated_txns,
                'estimated_days_remaining': estimated_days
            },
            'price': {
                'current_usd': price_data['price'] if price_data else None,
                'change_24h': price_data['change_24h'] if price_data else None,
                'price_status': 'volatile' if price_data and abs(price_data['change_24h']) > 10 else 'stable'
            },
            'alerts': {
                'last_balance_alert': self.last_balance_alert.isoformat() if self.last_balance_alert else None,
                'last_price_alert': self.last_price_alert.isoformat() if self.last_price_alert else None
            },
            'timestamp': datetime.now().isoformat()
        }
    
    async def run_monitoring_cycle(self):
        """Run one complete monitoring cycle"""
        logger.info("Starting monitoring cycle...")
        
        try:
            # Check wallet balance
            await self.check_wallet_balance()
            
            # Check price changes
            await self.check_price_changes()
            
            logger.info("Monitoring cycle completed successfully")
            
        except Exception as e:
            logger.error(f"Error in monitoring cycle: {str(e)}")
            
            # Send error alert
            subject = "Monitoring System Error"
            message = f"""
            <h3>❌ Monitoring System Encountered an Error</h3>
            <p><strong>Error Details:</strong></p>
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">{str(e)}</pre>
            <p>The monitoring system may need attention to ensure continued service.</p>
            """
            self.send_alert_email(subject, message, "urgent")

async def main():
    """Main monitoring function - can be run as standalone script or imported"""
    monitor = WalletPriceMonitor()
    
    # Run continuous monitoring
    while True:
        await monitor.run_monitoring_cycle()
        
        # Wait 30 minutes between checks
        await asyncio.sleep(1800)

if __name__ == "__main__":
    asyncio.run(main())
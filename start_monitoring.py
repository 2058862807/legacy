#!/usr/bin/env python3
"""
Start the NexteraEstate Wallet & Price Monitoring Service
This script runs the monitoring system in the background as a separate process
"""

import asyncio
import logging
import signal
import sys
import os
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append('/app/backend')

# Import the monitoring system
from wallet_monitor import WalletPriceMonitor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/monitoring.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

class MonitoringService:
    def __init__(self):
        self.monitor = WalletPriceMonitor()
        self.running = False
        
    async def start(self):
        """Start the monitoring service"""
        self.running = True
        logger.info("🚀 NexteraEstate Monitoring Service starting...")
        
        try:
            # Initial status check
            logger.info("📊 Running initial status check...")
            status = await self.monitor.generate_status_report()
            logger.info(f"Initial status: Wallet={status['wallet']['balance_matic']:.4f} MATIC, Price=${status['price']['current_usd']:.4f}")
            
            # Main monitoring loop
            cycle_count = 0
            while self.running:
                try:
                    cycle_count += 1
                    logger.info(f"🔄 Starting monitoring cycle #{cycle_count}")
                    
                    await self.monitor.run_monitoring_cycle()
                    
                    # Log success
                    logger.info(f"✅ Monitoring cycle #{cycle_count} completed successfully")
                    
                    # Wait 30 minutes between cycles (1800 seconds)
                    for i in range(1800):
                        if not self.running:
                            break
                        await asyncio.sleep(1)
                        
                except Exception as e:
                    logger.error(f"❌ Error in monitoring cycle #{cycle_count}: {str(e)}")
                    # Wait 5 minutes before retrying on error
                    for i in range(300):
                        if not self.running:
                            break
                        await asyncio.sleep(1)
                    
        except Exception as e:
            logger.error(f"❌ Fatal error in monitoring service: {str(e)}")
        finally:
            logger.info("🛑 Monitoring service stopped")
    
    def stop(self):
        """Stop the monitoring service"""
        logger.info("🛑 Stopping monitoring service...")
        self.running = False

# Global service instance
monitoring_service = None

def signal_handler(signum, frame):
    """Handle shutdown signals"""
    global monitoring_service
    logger.info(f"📡 Received signal {signum}, shutting down gracefully...")
    if monitoring_service:
        monitoring_service.stop()

def main():
    """Main entry point"""
    global monitoring_service
    
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Create and start the monitoring service
    monitoring_service = MonitoringService()
    
    try:
        # Run the async monitoring service
        asyncio.run(monitoring_service.start())
    except KeyboardInterrupt:
        logger.info("👋 Monitoring service interrupted by user")
    except Exception as e:
        logger.error(f"❌ Monitoring service crashed: {str(e)}")
        sys.exit(1)
    
    logger.info("👋 Monitoring service shutdown complete")

if __name__ == "__main__":
    # Validate environment
    required_env_vars = ['POLYGON_MASTER_WALLET', 'POLYGON_RPC_URL']
    missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
    
    if missing_vars:
        logger.warning(f"⚠️ Missing environment variables: {missing_vars}")
        logger.warning("Monitoring will run in mock mode")
    
    # Check email configuration
    email_vars = ['ALERT_EMAIL_USER', 'ALERT_RECIPIENTS']
    missing_email = [var for var in email_vars if not os.environ.get(var)]
    
    if missing_email:
        logger.warning(f"⚠️ Email alerts not configured - missing: {missing_email}")
    
    logger.info("🎯 Starting NexteraEstate Blockchain Monitoring Service")
    logger.info(f"📅 Service started at: {datetime.now().isoformat()}")
    
    main()
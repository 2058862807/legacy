#!/bin/bash

echo "🚀 Setting up NexteraEstate Blockchain Monitoring System..."

# Install new Python dependencies
echo "📦 Installing monitoring dependencies..."
cd /app/backend
pip install aiohttp==3.10.0 web3==6.15.1

# Make monitoring scripts executable
echo "🔧 Setting up monitoring scripts..."
chmod +x /app/start_monitoring.py

# Create log directory
echo "📁 Creating log directory..."
mkdir -p /app/logs

# Test the monitoring system
echo "🧪 Testing monitoring system..."
cd /app
python3 -c "
import sys
sys.path.append('/app/backend')
from wallet_monitor import WalletPriceMonitor
monitor = WalletPriceMonitor()
print('✅ Monitoring system imported successfully')
print(f'📍 Master wallet: {monitor.master_wallet or \"Not configured\"}')
print(f'⚖️ Min balance threshold: {monitor.min_wallet_balance} MATIC')
print(f'📈 Price spike threshold: ±{monitor.price_spike_threshold}%')
print(f'📧 Email configured: {bool(monitor.email_user and monitor.alert_recipients)}')
"

echo ""
echo "✅ Monitoring system setup complete!"
echo ""
echo "📋 Quick Start Guide:"
echo "1. Configure environment variables in /app/backend/.env:"
echo "   - POLYGON_MASTER_WALLET=your_wallet_address"
echo "   - POLYGON_RPC_URL=https://polygon-rpc.com"
echo "   - ALERT_EMAIL_USER=your_email@gmail.com"
echo "   - ALERT_EMAIL_PASSWORD=your_app_password"
echo "   - ALERT_RECIPIENTS=admin@nexteraestate.com"
echo ""
echo "2. Start monitoring service:"
echo "   python3 /app/start_monitoring.py"
echo ""
echo "3. Or run in background:"
echo "   nohup python3 /app/start_monitoring.py > /app/logs/monitoring.log 2>&1 &"
echo ""
echo "4. View monitoring dashboard:"
echo "   http://localhost:3000/admin/monitoring"
echo ""
echo "5. API endpoints available:"
echo "   GET /api/monitoring/status"
echo "   GET /api/monitoring/wallet"
echo "   GET /api/monitoring/price"
echo "   POST /api/monitoring/run-check"
echo ""
echo "🎯 Monitor your gasless blockchain service costs and wallet balance!"
echo "⚠️ Recommended: Set up proper email credentials for alerts"
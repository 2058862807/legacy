'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface WalletStatus {
  wallet_address: string
  balance_matic: number
  balance_status: string
  min_threshold: number
  estimated_transactions: number
  estimated_days_remaining: number
  cost_per_transaction: number
  network: string
  chain_id: number
}

interface PriceData {
  price_usd: number
  change_24h: number
  price_status: string
  last_update: string
  business_impact: {
    cost_per_transaction_usd: number
    daily_cost_estimate_usd: number
    monthly_cost_estimate_usd: number
  }
  alert_thresholds: {
    spike_threshold: number
    drop_threshold: number
  }
}

interface MonitoringStatus {
  wallet: {
    address: string
    balance_matic: number
    balance_status: string
    estimated_transactions: number
    estimated_days_remaining: number
  }
  price: {
    current_usd: number
    change_24h: number
    price_status: string
  }
  alerts: {
    last_balance_alert: string | null
    last_price_alert: string | null
  }
  timestamp: string
}

export default function MonitoringDashboard() {
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null)
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [walletRes, priceRes, statusRes] = await Promise.all([
        api.get('/monitoring/wallet'),
        api.get('/monitoring/price'), 
        api.get('/monitoring/status')
      ])

      setWalletStatus(walletRes.data)
      setPriceData(priceRes.data)
      setMonitoringStatus(statusRes.data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMonitoringCheck = async () => {
    try {
      await api.post('/monitoring/run-check')
      await fetchData() // Refresh data after check
    } catch (error) {
      console.error('Error running monitoring check:', error)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'volatile':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'ok':
      case 'stable':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blockchain Monitoring Dashboard</h1>
              <p className="text-gray-600 mt-2">Master wallet balance and MATIC price monitoring for gasless service</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              <button
                onClick={runMonitoringCheck}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🚨 Run Alert Check
              </button>
            </div>
          </div>
          
          {lastUpdate && (
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleString()}
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {walletStatus?.balance_matic?.toFixed(4) || '0'} MATIC
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            
            <div className={`mt-3 px-3 py-1 rounded-full text-sm border ${getStatusColor(walletStatus?.balance_status || 'unknown')}`}>
              {walletStatus?.balance_status === 'low' ? '⚠️ Low Balance' : '✅ Sufficient'}
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>~{walletStatus?.estimated_transactions || 0} transactions remaining</p>
              <p>~{walletStatus?.estimated_days_remaining?.toFixed(1) || 0} days at 100 txns/day</p>
            </div>
          </div>

          {/* MATIC Price */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MATIC Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${priceData?.price_usd?.toFixed(4) || '0.0000'}
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
            
            <div className={`mt-3 px-3 py-1 rounded-full text-sm border ${getStatusColor(priceData?.price_status || 'unknown')}`}>
              {priceData?.change_24h ? (
                priceData.change_24h >= 0 ? 
                  `📈 +${priceData.change_24h.toFixed(2)}%` : 
                  `📉 ${priceData.change_24h.toFixed(2)}%`
              ) : '➖ No change data'}
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>24h change: {priceData?.change_24h?.toFixed(2) || '0'}%</p>
              <p>Status: {priceData?.price_status || 'Unknown'}</p>
            </div>
          </div>

          {/* Transaction Cost */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost per Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${priceData?.business_impact?.cost_per_transaction_usd?.toFixed(6) || '0.000000'}
                </p>
              </div>
              <div className="text-3xl">💸</div>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>Daily estimate: ${priceData?.business_impact?.daily_cost_estimate_usd?.toFixed(2) || '0.00'}</p>
              <p>Monthly estimate: ${priceData?.business_impact?.monthly_cost_estimate_usd?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {walletStatus?.balance_status === 'ok' ? 'Operational' : 'Attention Needed'}
                </p>
              </div>
              <div className="text-3xl">
                {walletStatus?.balance_status === 'ok' ? '✅' : '⚠️'}
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>Network: {walletStatus?.network}</p>
              <p>Chain ID: {walletStatus?.chain_id}</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Master Wallet Details</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded break-all">
                  {walletStatus?.wallet_address || 'Not configured'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Balance</label>
                  <p className="text-sm text-gray-900">{walletStatus?.balance_matic?.toFixed(4) || '0'} MATIC</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Minimum Threshold</label>
                  <p className="text-sm text-gray-900">{walletStatus?.min_threshold || '5'} MATIC</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Transactions</label>
                  <p className="text-sm text-gray-900">{walletStatus?.estimated_transactions || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Days Remaining</label>
                  <p className="text-sm text-gray-900">{walletStatus?.estimated_days_remaining?.toFixed(1) || '0'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Last Balance Alert</label>
                <p className="text-sm text-gray-900">
                  {monitoringStatus?.alerts?.last_balance_alert ? 
                    new Date(monitoringStatus.alerts.last_balance_alert).toLocaleString() : 
                    'No recent alerts'
                  }
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Price Alert</label>
                <p className="text-sm text-gray-900">
                  {monitoringStatus?.alerts?.last_price_alert ? 
                    new Date(monitoringStatus.alerts.last_price_alert).toLocaleString() : 
                    'No recent alerts'
                  }
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Alert Thresholds</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Balance alert: Below {walletStatus?.min_threshold || 5} MATIC</p>
                  <p>• Price spike alert: ±{priceData?.alert_thresholds?.spike_threshold || 25}%</p>
                  <p>• Price drop alert: ±{priceData?.alert_thresholds?.drop_threshold || 20}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        {walletStatus?.balance_status === 'low' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Action Required: Low Wallet Balance</h3>
                <p className="text-red-800 mb-4">
                  The master wallet balance is below the minimum threshold. Gasless blockchain notarization may fail if the wallet runs out of MATIC.
                </p>
                <div className="bg-white border border-red-200 rounded p-4">
                  <h4 className="font-medium text-red-900 mb-2">Recommended Actions:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Add more MATIC to the master wallet immediately</li>
                    <li>• Monitor usage patterns for unusual spikes</li>
                    <li>• Consider increasing the minimum threshold if needed</li>
                    <li>• Set up automatic top-up alerts or automation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>NexteraEstate Blockchain Monitoring System • Updates every 30 minutes</p>
          <p>For urgent issues, contact the development team immediately</p>
        </div>
      </div>
    </div>
  )
}
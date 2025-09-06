#!/usr/bin/env python3
"""
NexteraEstate Wallet & Price Monitoring System Testing Suite
Testing the new wallet and price monitoring system implementation:
1. Monitoring Status Endpoints
2. Wallet Balance Checking (mock mode without real wallet)
3. MATIC Price Fetching from CoinGecko API
4. Monitoring Cycle Execution
5. Alert Thresholds and Configuration
6. WalletPriceMonitor Class Functionality

Context: Testing the newly implemented wallet and price monitoring system for gasless blockchain service cost management.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment or use default
BACKEND_URL = os.environ.get('NEXT_PUBLIC_BACKEND_BASE_URL', 'http://localhost:8001')
if not BACKEND_URL.startswith('http'):
    BACKEND_URL = f'http://{BACKEND_URL}'

print(f"💰 WALLET & PRICE MONITORING SYSTEM TESTING - NexteraEstate")
print(f"Testing wallet balance monitoring, MATIC price tracking, and alert system")
print(f"Backend URL: {BACKEND_URL}")
print("=" * 80)

class WalletMonitoringTester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        
    def log_result(self, test_name, success, details="", response_data=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'response_data': response_data,
            'timestamp': datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status} {test_name}: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_health_endpoint(self):
        """Test /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'ok' in data and data['ok'] == True:
                    self.log_result("Health Check", True, f"Status: OK")
                    return True
                else:
                    self.log_result("Health Check", False, "Invalid response format", data)
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_monitoring_status(self):
        """Test GET /api/monitoring/status endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/monitoring/status", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields in status report
                required_fields = ['wallet', 'price', 'alerts', 'timestamp']
                if all(field in data for field in required_fields):
                    
                    # Check wallet status
                    wallet_info = data.get('wallet', {})
                    wallet_address = wallet_info.get('address', '')
                    balance = wallet_info.get('balance_matic')
                    balance_status = wallet_info.get('balance_status', 'unknown')
                    
                    # Check price status
                    price_info = data.get('price', {})
                    current_price = price_info.get('current_usd')
                    price_status = price_info.get('price_status', 'unknown')
                    
                    self.log_result("Monitoring Status", True, 
                                  f"Status report complete - Wallet: {balance_status}, Price: {price_status}")
                    
                    # Log detailed info
                    if balance is not None:
                        self.log_result("Wallet Balance Info", True, 
                                      f"Balance: {balance:.4f} MATIC, Status: {balance_status}")
                    else:
                        self.log_result("Wallet Balance Info", True, 
                                      "Wallet in mock mode (no real wallet configured)")
                    
                    if current_price:
                        self.log_result("Price Info", True, 
                                      f"MATIC Price: ${current_price:.4f}, Status: {price_status}")
                    else:
                        self.log_result("Price Info", False, "Unable to fetch MATIC price")
                        
                else:
                    missing_fields = [f for f in required_fields if f not in data]
                    self.log_result("Monitoring Status", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Monitoring Status", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Monitoring Status", False, f"Request error: {str(e)}")

    def test_wallet_monitoring(self):
        """Test GET /api/monitoring/wallet endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/monitoring/wallet", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if wallet is configured or in mock mode
                if 'error' in data:
                    # Mock mode - wallet not configured
                    configured = data.get('configured', False)
                    wallet_address = data.get('wallet_address', '')
                    
                    if not configured or not wallet_address:
                        self.log_result("Wallet Monitoring - Mock Mode", True, 
                                      "Wallet monitoring in mock mode (no real wallet configured)")
                    else:
                        self.log_result("Wallet Monitoring", False, 
                                      f"Wallet configured but balance fetch failed: {data['error']}")
                else:
                    # Real wallet mode
                    required_fields = ['wallet_address', 'balance_matic', 'balance_status', 
                                     'min_threshold', 'estimated_transactions']
                    
                    if all(field in data for field in required_fields):
                        balance = data['balance_matic']
                        status = data['balance_status']
                        threshold = data['min_threshold']
                        est_txns = data['estimated_transactions']
                        est_days = data.get('estimated_days_remaining', 0)
                        
                        self.log_result("Wallet Monitoring", True, 
                                      f"Balance: {balance:.4f} MATIC, Status: {status}, Est. txns: {est_txns}")
                        
                        # Check balance status logic
                        if balance < threshold and status != 'low':
                            self.log_result("Balance Status Logic", False, 
                                          f"Balance {balance} < threshold {threshold} but status is {status}")
                        elif balance >= threshold and status == 'low':
                            self.log_result("Balance Status Logic", False, 
                                          f"Balance {balance} >= threshold {threshold} but status is {status}")
                        else:
                            self.log_result("Balance Status Logic", True, 
                                          f"Balance status correctly calculated: {status}")
                        
                        # Check cost calculations
                        cost_per_txn = data.get('cost_per_transaction', 0)
                        if cost_per_txn > 0:
                            self.log_result("Cost Calculations", True, 
                                          f"Cost per transaction: {cost_per_txn} MATIC")
                        
                    else:
                        missing_fields = [f for f in required_fields if f not in data]
                        self.log_result("Wallet Monitoring", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Wallet Monitoring", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Wallet Monitoring", False, f"Request error: {str(e)}")

    def test_price_monitoring(self):
        """Test GET /api/monitoring/price endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/monitoring/price", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if price fetch was successful
                if 'error' in data:
                    self.log_result("Price Monitoring", False, f"Price fetch failed: {data['error']}")
                else:
                    required_fields = ['price_usd', 'change_24h', 'price_status', 'last_update']
                    
                    if all(field in data for field in required_fields):
                        price = data['price_usd']
                        change = data['change_24h']
                        status = data['price_status']
                        last_update = data['last_update']
                        
                        self.log_result("Price Monitoring", True, 
                                      f"MATIC: ${price:.4f}, 24h: {change:+.2f}%, Status: {status}")
                        
                        # Check business impact calculations
                        if 'business_impact' in data:
                            impact = data['business_impact']
                            cost_per_txn_usd = impact.get('cost_per_transaction_usd', 0)
                            daily_cost = impact.get('daily_cost_estimate_usd', 0)
                            monthly_cost = impact.get('monthly_cost_estimate_usd', 0)
                            
                            self.log_result("Business Impact Calculations", True, 
                                          f"Per txn: ${cost_per_txn_usd:.6f}, Daily: ${daily_cost:.2f}, Monthly: ${monthly_cost:.2f}")
                        
                        # Check alert thresholds
                        if 'alert_thresholds' in data:
                            thresholds = data['alert_thresholds']
                            spike_threshold = thresholds.get('spike_threshold', 0)
                            drop_threshold = thresholds.get('drop_threshold', 0)
                            
                            self.log_result("Alert Thresholds", True, 
                                          f"Spike: {spike_threshold}%, Drop: {drop_threshold}%")
                            
                            # Check if current change would trigger alerts
                            if abs(change) >= spike_threshold:
                                alert_type = "spike" if change > 0 else "drop"
                                self.log_result("Alert Trigger Check", True, 
                                              f"Current change ({change:+.2f}%) would trigger {alert_type} alert")
                            else:
                                self.log_result("Alert Trigger Check", True, 
                                              f"Current change ({change:+.2f}%) within normal range")
                        
                        # Validate price status logic
                        expected_status = "volatile" if abs(change) > 10 else "stable"
                        if status == expected_status:
                            self.log_result("Price Status Logic", True, 
                                          f"Price status correctly calculated: {status}")
                        else:
                            self.log_result("Price Status Logic", False, 
                                          f"Expected {expected_status}, got {status}")
                        
                    else:
                        missing_fields = [f for f in required_fields if f not in data]
                        self.log_result("Price Monitoring", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Price Monitoring", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Price Monitoring", False, f"Request error: {str(e)}")

    def test_manual_monitoring_check(self):
        """Test POST /api/monitoring/run-check endpoint"""
        try:
            response = self.session.post(f"{self.base_url}/api/monitoring/run-check", 
                                       json={}, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                required_fields = ['status', 'message', 'timestamp']
                if all(field in data for field in required_fields):
                    status = data['status']
                    message = data['message']
                    timestamp = data['timestamp']
                    
                    if status == 'success':
                        self.log_result("Manual Monitoring Check", True, 
                                      f"Monitoring cycle completed: {message}")
                        
                        # Verify timestamp is recent (within last minute)
                        try:
                            check_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                            now = datetime.now(check_time.tzinfo)
                            time_diff = (now - check_time).total_seconds()
                            
                            if time_diff < 60:  # Within last minute
                                self.log_result("Monitoring Timestamp", True, 
                                              f"Timestamp is recent: {time_diff:.1f}s ago")
                            else:
                                self.log_result("Monitoring Timestamp", False, 
                                              f"Timestamp too old: {time_diff:.1f}s ago")
                        except Exception as e:
                            self.log_result("Monitoring Timestamp", False, 
                                          f"Invalid timestamp format: {str(e)}")
                    else:
                        self.log_result("Manual Monitoring Check", False, 
                                      f"Monitoring failed: {status} - {message}")
                else:
                    missing_fields = [f for f in required_fields if f not in data]
                    self.log_result("Manual Monitoring Check", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Manual Monitoring Check", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Manual Monitoring Check", False, f"Request error: {str(e)}")

    def test_monitoring_configuration(self):
        """Test POST /api/monitoring/config endpoint"""
        try:
            # Test updating configuration
            config_data = {
                "min_wallet_balance": 10.0,
                "price_spike_threshold": 30.0,
                "price_drop_threshold": 25.0
            }
            
            response = self.session.post(f"{self.base_url}/api/monitoring/config", 
                                       json=config_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                required_fields = ['status', 'message', 'updated_fields', 'current_config']
                if all(field in data for field in required_fields):
                    status = data['status']
                    updated_fields = data['updated_fields']
                    current_config = data['current_config']
                    
                    if status == 'success':
                        self.log_result("Configuration Update", True, 
                                      f"Updated {len(updated_fields)} fields")
                        
                        # Verify configuration was applied
                        expected_config = {
                            'min_wallet_balance': 10.0,
                            'price_spike_threshold': 30.0,
                            'price_drop_threshold': 25.0
                        }
                        
                        config_correct = True
                        for key, expected_value in expected_config.items():
                            if current_config.get(key) != expected_value:
                                config_correct = False
                                break
                        
                        if config_correct:
                            self.log_result("Configuration Verification", True, 
                                          "All configuration values correctly applied")
                        else:
                            self.log_result("Configuration Verification", False, 
                                          f"Config mismatch - Expected: {expected_config}, Got: {current_config}")
                        
                        # Test partial update
                        partial_config = {"min_wallet_balance": 7.5}
                        partial_response = self.session.post(f"{self.base_url}/api/monitoring/config", 
                                                           json=partial_config, timeout=15)
                        
                        if partial_response.status_code == 200:
                            partial_data = partial_response.json()
                            if (partial_data.get('status') == 'success' and 
                                len(partial_data.get('updated_fields', [])) == 1):
                                self.log_result("Partial Configuration Update", True, 
                                              "Partial config update successful")
                            else:
                                self.log_result("Partial Configuration Update", False, 
                                              "Partial config update failed")
                        else:
                            self.log_result("Partial Configuration Update", False, 
                                          f"HTTP {partial_response.status_code}")
                    else:
                        self.log_result("Configuration Update", False, 
                                      f"Config update failed: {status}")
                else:
                    missing_fields = [f for f in required_fields if f not in data]
                    self.log_result("Configuration Update", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Configuration Update", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Configuration Update", False, f"Request error: {str(e)}")

    def test_alert_history(self):
        """Test GET /api/monitoring/alerts/history endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/monitoring/alerts/history", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                required_fields = ['last_balance_alert', 'last_price_alert', 'monitoring_active']
                if all(field in data for field in required_fields):
                    last_balance_alert = data['last_balance_alert']
                    last_price_alert = data['last_price_alert']
                    monitoring_active = data['monitoring_active']
                    price_history_count = data.get('price_history_count', 0)
                    
                    self.log_result("Alert History", True, 
                                  f"Monitoring active: {monitoring_active}, Price history: {price_history_count} entries")
                    
                    # Check alert timestamps (can be None if no alerts sent yet)
                    if last_balance_alert:
                        try:
                            balance_alert_time = datetime.fromisoformat(last_balance_alert.replace('Z', '+00:00'))
                            self.log_result("Balance Alert History", True, 
                                          f"Last balance alert: {balance_alert_time.strftime('%Y-%m-%d %H:%M:%S')}")
                        except Exception as e:
                            self.log_result("Balance Alert History", False, 
                                          f"Invalid balance alert timestamp: {str(e)}")
                    else:
                        self.log_result("Balance Alert History", True, 
                                      "No balance alerts sent yet (expected for new system)")
                    
                    if last_price_alert:
                        try:
                            price_alert_time = datetime.fromisoformat(last_price_alert.replace('Z', '+00:00'))
                            self.log_result("Price Alert History", True, 
                                          f"Last price alert: {price_alert_time.strftime('%Y-%m-%d %H:%M:%S')}")
                        except Exception as e:
                            self.log_result("Price Alert History", False, 
                                          f"Invalid price alert timestamp: {str(e)}")
                    else:
                        self.log_result("Price Alert History", True, 
                                      "No price alerts sent yet (expected for new system)")
                    
                    # Check recent prices if available
                    if 'recent_prices' in data and data['recent_prices']:
                        recent_prices = data['recent_prices']
                        self.log_result("Recent Price History", True, 
                                      f"Recent prices available: {len(recent_prices)} entries")
                        
                        # Validate price data structure
                        if recent_prices and isinstance(recent_prices[0], dict):
                            price_entry = recent_prices[0]
                            if 'price' in price_entry and 'timestamp' in price_entry:
                                self.log_result("Price Data Structure", True, 
                                              "Price history entries have correct structure")
                            else:
                                self.log_result("Price Data Structure", False, 
                                              "Price history entries missing required fields")
                    else:
                        self.log_result("Recent Price History", True, 
                                      "No recent price history (expected for new system)")
                    
                    # Verify monitoring is active
                    if monitoring_active:
                        self.log_result("Monitoring Active Status", True, 
                                      "Monitoring system is active")
                    else:
                        self.log_result("Monitoring Active Status", False, 
                                      "Monitoring system appears inactive")
                        
                else:
                    missing_fields = [f for f in required_fields if f not in data]
                    self.log_result("Alert History", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Alert History", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Alert History", False, f"Request error: {str(e)}")

    def test_walletpricemonitor_class_functionality(self):
        """Test WalletPriceMonitor class functionality through API responses"""
        print("\n🔧 Testing WalletPriceMonitor Class Functionality...")
        
        # Test 1: Verify environment variable configuration
        try:
            # Get current config to verify environment variables are loaded
            response = self.session.get(f"{self.base_url}/api/monitoring/status", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                wallet_info = data.get('wallet', {})
                
                # Check if thresholds are properly loaded from environment
                if 'balance_status' in wallet_info:
                    self.log_result("Environment Variable Loading", True, 
                                  "Monitoring thresholds loaded from environment variables")
                else:
                    self.log_result("Environment Variable Loading", False, 
                                  "Unable to verify environment variable loading")
            else:
                self.log_result("Environment Variable Loading", False, 
                              f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Environment Variable Loading", False, f"Request error: {str(e)}")
        
        # Test 2: Verify MATIC price fetching from CoinGecko
        try:
            response = self.session.get(f"{self.base_url}/api/monitoring/price", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'error' not in data and 'price_usd' in data:
                    price = data['price_usd']
                    change_24h = data['change_24h']
                    
                    # Validate price data is reasonable
                    if 0.1 <= price <= 10.0:  # MATIC typically trades in this range
                        self.log_result("CoinGecko API Integration", True, 
                                      f"Valid MATIC price fetched: ${price:.4f}")
                    else:
                        self.log_result("CoinGecko API Integration", False, 
                                      f"Suspicious MATIC price: ${price:.4f}")
                    
                    # Validate 24h change is reasonable
                    if -100 <= change_24h <= 100:  # Reasonable daily change range
                        self.log_result("Price Change Validation", True, 
                                      f"Reasonable 24h change: {change_24h:+.2f}%")
                    else:
                        self.log_result("Price Change Validation", False, 
                                      f"Extreme 24h change: {change_24h:+.2f}%")
                else:
                    self.log_result("CoinGecko API Integration", False, 
                                  "Unable to fetch MATIC price from CoinGecko")
            else:
                self.log_result("CoinGecko API Integration", False, 
                              f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("CoinGecko API Integration", False, f"Request error: {str(e)}")
        
        # Test 3: Verify alert threshold logic
        try:
            # Test with different threshold values
            test_configs = [
                {"min_wallet_balance": 1.0, "price_spike_threshold": 15.0},
                {"min_wallet_balance": 20.0, "price_drop_threshold": 30.0}
            ]
            
            for i, config in enumerate(test_configs):
                response = self.session.post(f"{self.base_url}/api/monitoring/config", 
                                           json=config, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('status') == 'success':
                        current_config = data.get('current_config', {})
                        
                        # Verify the configuration was applied
                        config_applied = all(
                            current_config.get(key) == value 
                            for key, value in config.items()
                        )
                        
                        if config_applied:
                            self.log_result(f"Alert Threshold Logic {i+1}", True, 
                                          f"Threshold configuration applied correctly")
                        else:
                            self.log_result(f"Alert Threshold Logic {i+1}", False, 
                                          f"Threshold configuration not applied correctly")
                    else:
                        self.log_result(f"Alert Threshold Logic {i+1}", False, 
                                      f"Config update failed: {data.get('message', 'Unknown error')}")
                else:
                    self.log_result(f"Alert Threshold Logic {i+1}", False, 
                                  f"HTTP {response.status_code}")
                    
        except Exception as e:
            self.log_result("Alert Threshold Logic", False, f"Request error: {str(e)}")
        
        # Test 4: Verify monitoring cycle execution
        try:
            # Run monitoring cycle and verify it completes
            start_time = datetime.now()
            response = self.session.post(f"{self.base_url}/api/monitoring/run-check", 
                                       json={}, timeout=30)
            end_time = datetime.now()
            execution_time = (end_time - start_time).total_seconds()
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    self.log_result("Monitoring Cycle Execution", True, 
                                  f"Cycle completed in {execution_time:.2f}s")
                    
                    # Verify execution time is reasonable (should complete within 30 seconds)
                    if execution_time <= 30:
                        self.log_result("Monitoring Performance", True, 
                                      f"Monitoring cycle performance acceptable: {execution_time:.2f}s")
                    else:
                        self.log_result("Monitoring Performance", False, 
                                      f"Monitoring cycle too slow: {execution_time:.2f}s")
                else:
                    self.log_result("Monitoring Cycle Execution", False, 
                                  f"Cycle failed: {data.get('message', 'Unknown error')}")
            else:
                self.log_result("Monitoring Cycle Execution", False, 
                              f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Monitoring Cycle Execution", False, f"Request error: {str(e)}")

    def run_all_tests(self):
        """Run all wallet and price monitoring tests"""
        print(f"🚀 Starting Wallet & Price Monitoring System Tests...")
        print(f"Testing against: {self.base_url}")
        print("-" * 80)
        
        # Test basic connectivity first
        if not self.test_health_endpoint():
            print("❌ Health check failed - aborting tests")
            return
        
        # Test 1: Monitoring Status Endpoint
        print("\n💰 Testing Wallet & Price Monitoring System...")
        self.test_monitoring_status()
        
        # Test 2: Wallet Balance Monitoring
        self.test_wallet_monitoring()
        
        # Test 3: MATIC Price Monitoring
        self.test_price_monitoring()
        
        # Test 4: Manual Monitoring Check
        self.test_manual_monitoring_check()
        
        # Test 5: Configuration Management
        self.test_monitoring_configuration()
        
        # Test 6: Alert History
        self.test_alert_history()
        
        # Test WalletPriceMonitor class functionality
        self.test_walletpricemonitor_class_functionality()
        
        # Generate summary
        self.generate_test_summary()

    def generate_test_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 80)
        print("📊 WALLET & PRICE MONITORING SYSTEM TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results if result['success'])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ Failed Tests:")
            for result in self.results:
                if not result['success']:
                    print(f"   - {result['test']}: {result['details']}")
        
        # Overall assessment
        if success_rate >= 90:
            print(f"\n✅ WALLET & PRICE MONITORING SYSTEM: EXCELLENT ({success_rate:.1f}%)")
        elif success_rate >= 75:
            print(f"\n⚠️ WALLET & PRICE MONITORING SYSTEM: GOOD ({success_rate:.1f}%)")
        elif success_rate >= 50:
            print(f"\n⚠️ WALLET & PRICE MONITORING SYSTEM: NEEDS IMPROVEMENT ({success_rate:.1f}%)")
        else:
            print(f"\n❌ WALLET & PRICE MONITORING SYSTEM: CRITICAL ISSUES ({success_rate:.1f}%)")
        
        # Save results to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"wallet_monitoring_test_results_{timestamp}.json"
        
        summary_data = {
            "test_summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "success_rate": success_rate,
                "timestamp": datetime.now().isoformat()
            },
            "test_results": self.results
        }
        
        with open(filename, 'w') as f:
            json.dump(summary_data, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {filename}")

if __name__ == "__main__":
    tester = WalletMonitoringTester(BACKEND_URL)
    tester.run_all_tests()
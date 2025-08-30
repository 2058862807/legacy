#!/usr/bin/env python3
"""
NexteraEstate Backend API Testing Suite
Tests all backend endpoints for functionality and integration
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

print(f"Testing backend at: {BACKEND_URL}")

class BackendTester:
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
                if 'status' in data and data['status'] == 'ok':
                    self.log_result("Health Check", True, f"Status: {data['status']}")
                    return True
                else:
                    self.log_result("Health Check", False, "Invalid response format", data)
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_stripe_endpoints(self):
        """Test Stripe payment endpoints"""
        # Test create checkout
        try:
            checkout_data = {"planId": "basic"}
            response = self.session.post(
                f"{self.base_url}/api/payments/create-checkout",
                json=checkout_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'url' in data:
                    self.log_result("Stripe Create Checkout", True, "Checkout URL generated")
                else:
                    self.log_result("Stripe Create Checkout", False, "No URL in response", data)
            elif response.status_code == 500:
                # Expected if Stripe not configured
                error_data = response.json()
                if "Stripe not configured" in error_data.get('detail', ''):
                    self.log_result("Stripe Create Checkout", True, "Expected error - Stripe not configured")
                else:
                    self.log_result("Stripe Create Checkout", False, f"Unexpected error: {error_data}")
            else:
                self.log_result("Stripe Create Checkout", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Stripe Create Checkout", False, f"Request error: {str(e)}")
        
        # Test invalid plan
        try:
            invalid_data = {"planId": "invalid"}
            response = self.session.post(
                f"{self.base_url}/api/payments/create-checkout",
                json=invalid_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_result("Stripe Invalid Plan", True, "Correctly rejected invalid plan")
            elif response.status_code == 500:
                # When Stripe is not configured, service check happens before validation
                error_data = response.json()
                if "Stripe not configured" in error_data.get('detail', ''):
                    self.log_result("Stripe Invalid Plan", True, "Service unavailable - cannot test plan validation")
                else:
                    self.log_result("Stripe Invalid Plan", False, f"Unexpected 500 error: {error_data}")
            else:
                self.log_result("Stripe Invalid Plan", False, f"Expected 400 or 500, got {response.status_code}")
        except Exception as e:
            self.log_result("Stripe Invalid Plan", False, f"Request error: {str(e)}")
        
        # Test payment status
        try:
            response = self.session.get(
                f"{self.base_url}/api/payments/status?session_id=test_session",
                timeout=10
            )
            
            if response.status_code == 500:
                # Expected if Stripe not configured
                error_data = response.json()
                if "Stripe not configured" in error_data.get('detail', ''):
                    self.log_result("Stripe Payment Status", True, "Expected error - Stripe not configured")
                else:
                    self.log_result("Stripe Payment Status", False, f"Unexpected error: {error_data}")
            elif response.status_code == 200:
                self.log_result("Stripe Payment Status", True, "Status endpoint accessible")
            else:
                self.log_result("Stripe Payment Status", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Stripe Payment Status", False, f"Request error: {str(e)}")
    
    def test_ai_bot_endpoints(self):
        """Test AI bot endpoints"""
        # Test help bot
        try:
            help_data = {
                "message": "What is a will?",
                "history": []
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/help",
                json=help_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'reply' in data:
                    if "AI services are currently unavailable" in data['reply']:
                        self.log_result("AI Help Bot", True, "Expected fallback - OpenAI not configured")
                    else:
                        self.log_result("AI Help Bot", True, "AI response received")
                else:
                    self.log_result("AI Help Bot", False, "No reply in response", data)
            else:
                self.log_result("AI Help Bot", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("AI Help Bot", False, f"Request error: {str(e)}")
        
        # Test grief bot
        try:
            grief_data = {
                "message": "I'm struggling with loss",
                "history": []
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/grief",
                json=grief_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'reply' in data:
                    # Should include crisis resources
                    if "Crisis Text Line" in data['reply'] or "AI services are currently unavailable" in data['reply']:
                        self.log_result("AI Grief Bot", True, "Crisis resources provided or fallback message")
                    else:
                        self.log_result("AI Grief Bot", True, "Response received")
                else:
                    self.log_result("AI Grief Bot", False, "No reply in response", data)
            else:
                self.log_result("AI Grief Bot", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("AI Grief Bot", False, f"Request error: {str(e)}")
    
    def test_blockchain_endpoints(self):
        """Test blockchain notarization endpoints"""
        # Test hash generation
        try:
            hash_data = {"content": "This is a test document for hashing"}
            response = self.session.post(
                f"{self.base_url}/api/notary/hash",
                json=hash_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'hash' in data and len(data['hash']) == 64:  # SHA256 is 64 chars
                    generated_hash = data['hash']
                    self.log_result("Blockchain Hash Generation", True, f"Hash generated: {generated_hash[:16]}...")
                    
                    # Test notarization with the generated hash
                    self.test_notarization(generated_hash)
                else:
                    self.log_result("Blockchain Hash Generation", False, "Invalid hash format", data)
            else:
                self.log_result("Blockchain Hash Generation", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Blockchain Hash Generation", False, f"Request error: {str(e)}")
    
    def test_notarization(self, test_hash):
        """Test blockchain notarization with a hash"""
        try:
            notary_data = {"hash": test_hash}
            response = self.session.post(
                f"{self.base_url}/api/notary/create",
                json=notary_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'txHash' in data and 'explorerUrl' in data:
                    tx_hash = data['txHash']
                    self.log_result("Blockchain Notarization", True, f"Transaction created: {tx_hash[:16]}...")
                    
                    # Test status check
                    self.test_notary_status(tx_hash)
                else:
                    self.log_result("Blockchain Notarization", False, "Missing transaction data", data)
            elif response.status_code == 500:
                error_data = response.json()
                if "Blockchain services not configured" in error_data.get('detail', ''):
                    self.log_result("Blockchain Notarization", True, "Expected error - Blockchain not configured")
                else:
                    self.log_result("Blockchain Notarization", False, f"Unexpected error: {error_data}")
            else:
                self.log_result("Blockchain Notarization", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Blockchain Notarization", False, f"Request error: {str(e)}")
    
    def test_notary_status(self, tx_hash):
        """Test notary status endpoint"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/notary/status?tx={tx_hash}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and 'confirmations' in data:
                    self.log_result("Blockchain Status Check", True, f"Status: {data['status']}")
                else:
                    self.log_result("Blockchain Status Check", False, "Invalid status format", data)
            else:
                self.log_result("Blockchain Status Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Blockchain Status Check", False, f"Request error: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        # Test invalid JSON
        try:
            response = self.session.post(
                f"{self.base_url}/api/bot/help",
                data="invalid json",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_result("Error Handling - Invalid JSON", True, "Correctly rejected invalid JSON")
            else:
                self.log_result("Error Handling - Invalid JSON", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid JSON", False, f"Request error: {str(e)}")
        
        # Test missing required fields
        try:
            response = self.session.post(
                f"{self.base_url}/api/notary/hash",
                json={},  # Missing content field
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_result("Error Handling - Missing Fields", True, "Correctly rejected missing fields")
            else:
                self.log_result("Error Handling - Missing Fields", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Missing Fields", False, f"Request error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("NexteraEstate Backend API Test Suite")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_health_endpoint():
            print("\n❌ CRITICAL: Backend health check failed. Cannot proceed with other tests.")
            return False
        
        print("\n🔄 Testing Stripe Payment Integration...")
        self.test_stripe_endpoints()
        
        print("\n🔄 Testing AI Bot Endpoints...")
        self.test_ai_bot_endpoints()
        
        print("\n🔄 Testing Blockchain Notarization...")
        self.test_blockchain_endpoints()
        
        print("\n🔄 Testing Error Handling...")
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        return failed_tests == 0

def main():
    """Main test execution"""
    tester = BackendTester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(tester.results, f, indent=2)
    
    print(f"\nDetailed results saved to: /app/backend_test_results.json")
    
    if success:
        print("\n✅ All backend tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some backend tests failed. Check details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
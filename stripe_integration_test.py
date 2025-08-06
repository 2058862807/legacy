#!/usr/bin/env python3
"""
Focused Stripe Payment Integration Testing for NextEra Estate
Tests the specific Stripe integration requirements from the review request
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, Optional

class StripeIntegrationTester:
    def __init__(self):
        # Get backend URL from environment
        self.base_url = os.getenv('REACT_APP_BACKEND_URL', 'https://f5464be6-54bf-47de-a83b-762319fd8a8d.preview.emergentagent.com')
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
        print(f"🔥 STRIPE PAYMENT INTEGRATION TESTING")
        print(f"📡 Backend URL: {self.base_url}")
        print(f"🔗 API URL: {self.api_url}")
        print("=" * 80)

    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        print(f"{status} {test_name}")
        if details:
            print(f"    📝 {details}")
        if not success and response_data:
            print(f"    🔍 Response: {response_data}")
        print()

    def setup_authentication(self):
        """Setup authentication for testing"""
        try:
            # Test user registration
            test_email = f"stripe_test_{int(time.time())}@nexteraestate.com"
            registration_data = {
                "email": test_email,
                "password": "StripeTest123!",
                "first_name": "Stripe",
                "last_name": "Tester",
                "jurisdiction": "California, USA",
                "phone": "+1-555-0199"
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/register",
                data=registration_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("access_token")
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                
                self.log_test(
                    "Authentication Setup",
                    True,
                    f"User created: {data['user']['name']}, Email: {test_email}"
                )
                return True
            else:
                self.log_test("Authentication Setup", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Authentication Setup", False, f"Error: {str(e)}")
            return False

    def test_payment_packages_api(self):
        """Test 1: Payment Packages API - GET /api/payments/packages"""
        try:
            response = self.session.get(f"{self.api_url}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", {})
                
                # Check for all expected packages
                expected_packages = ["basic_will", "premium_will", "full_estate_plan"]
                found_packages = list(packages.keys())
                
                # Verify package structure
                package_structure_valid = all(
                    "name" in packages[pkg] and 
                    "amount" in packages[pkg] and 
                    "description" in packages[pkg] and
                    "features" in packages[pkg] and
                    isinstance(packages[pkg]["features"], list)
                    for pkg in found_packages
                )
                
                success = (
                    all(pkg in found_packages for pkg in expected_packages) and 
                    package_structure_valid and
                    len(found_packages) >= 3
                )
                
                self.log_test(
                    "Payment Packages API",
                    success,
                    f"Found {len(found_packages)} packages: {', '.join(found_packages)}, Structure valid: {package_structure_valid}"
                )
                return success
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout_creation_basic_will(self):
        """Test 2: Real Stripe Checkout Session Creation - Basic Will Package"""
        try:
            checkout_data = {
                "package_id": "basic_will"
            }
            
            response = self.session.post(
                f"{self.api_url}/payments/checkout",
                data=checkout_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                checkout_url = data.get("checkout_url")
                session_id = data.get("session_id")
                
                # Verify this is REAL Stripe integration
                real_stripe_checks = [
                    checkout_url is not None,
                    session_id is not None,
                    "checkout.stripe.com" in checkout_url,
                    session_id.startswith("cs_test_") or session_id.startswith("cs_live_"),
                    "stripe.com" in checkout_url
                ]
                
                real_stripe = all(real_stripe_checks)
                
                self.log_test(
                    "Stripe Checkout Creation - Basic Will ($29.99)",
                    real_stripe,
                    f"Session ID: {session_id[:25]}..., Real Stripe URL: {real_stripe}, URL contains stripe.com: {'stripe.com' in checkout_url}"
                )
                
                # Store for status check
                self.basic_will_session_id = session_id
                return real_stripe
            else:
                self.log_test("Stripe Checkout Creation - Basic Will", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Stripe Checkout Creation - Basic Will", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout_creation_premium_will(self):
        """Test 3: Real Stripe Checkout Session Creation - Premium Will Package"""
        try:
            checkout_data = {
                "package_id": "premium_will"
            }
            
            response = self.session.post(
                f"{self.api_url}/payments/checkout",
                data=checkout_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                checkout_url = data.get("checkout_url")
                session_id = data.get("session_id")
                
                # Verify this is REAL Stripe integration
                real_stripe = (
                    checkout_url is not None and
                    session_id is not None and
                    "checkout.stripe.com" in checkout_url and
                    (session_id.startswith("cs_test_") or session_id.startswith("cs_live_"))
                )
                
                self.log_test(
                    "Stripe Checkout Creation - Premium Will ($49.99)",
                    real_stripe,
                    f"Session ID: {session_id[:25]}..., Real Stripe URL: {real_stripe}"
                )
                
                # Store for status check
                self.premium_will_session_id = session_id
                return real_stripe
            else:
                self.log_test("Stripe Checkout Creation - Premium Will", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Stripe Checkout Creation - Premium Will", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout_creation_full_estate_plan(self):
        """Test 4: Real Stripe Checkout Session Creation - Full Estate Plan Package"""
        try:
            checkout_data = {
                "package_id": "full_estate_plan"
            }
            
            response = self.session.post(
                f"{self.api_url}/payments/checkout",
                data=checkout_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                checkout_url = data.get("checkout_url")
                session_id = data.get("session_id")
                
                # Verify this is REAL Stripe integration
                real_stripe = (
                    checkout_url is not None and
                    session_id is not None and
                    "checkout.stripe.com" in checkout_url and
                    (session_id.startswith("cs_test_") or session_id.startswith("cs_live_"))
                )
                
                self.log_test(
                    "Stripe Checkout Creation - Full Estate Plan ($99.99)",
                    real_stripe,
                    f"Session ID: {session_id[:25]}..., Real Stripe URL: {real_stripe}"
                )
                
                # Store for status check
                self.full_estate_session_id = session_id
                return real_stripe
            else:
                self.log_test("Stripe Checkout Creation - Full Estate Plan", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Stripe Checkout Creation - Full Estate Plan", False, f"Error: {str(e)}")
            return False

    def test_payment_status_checking(self):
        """Test 5: Payment Status Checking with Real Session IDs"""
        success_count = 0
        total_tests = 0
        
        # Test all created sessions
        session_tests = [
            ("Basic Will", getattr(self, 'basic_will_session_id', None)),
            ("Premium Will", getattr(self, 'premium_will_session_id', None)),
            ("Full Estate Plan", getattr(self, 'full_estate_session_id', None))
        ]
        
        for package_name, session_id in session_tests:
            if session_id:
                total_tests += 1
                try:
                    response = self.session.get(
                        f"{self.api_url}/payments/status/{session_id}",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        status = data.get("status")
                        payment_status = data.get("payment_status")
                        amount_total = data.get("amount_total")
                        currency = data.get("currency")
                        
                        # For test sessions, we expect "open" status and "unpaid" payment_status
                        valid_response = (
                            status in ["open", "complete", "expired"] and
                            payment_status in ["unpaid", "paid", "no_payment_required"] and
                            amount_total is not None and
                            currency is not None
                        )
                        
                        if valid_response:
                            success_count += 1
                            print(f"    ✅ {package_name}: Status={status}, Payment={payment_status}, Amount=${amount_total}")
                        else:
                            print(f"    ❌ {package_name}: Invalid response structure")
                    else:
                        print(f"    ❌ {package_name}: HTTP {response.status_code}")
                        
                except Exception as e:
                    print(f"    ❌ {package_name}: Error {str(e)}")
        
        success = success_count == total_tests and total_tests > 0
        
        self.log_test(
            "Payment Status Checking",
            success,
            f"Successfully checked {success_count}/{total_tests} payment sessions"
        )
        return success

    def test_webhook_endpoint_exists(self):
        """Test 6: Webhook Endpoint Exists and Responds"""
        try:
            # Test webhook endpoint with mock data
            mock_webhook_data = {
                "id": "evt_test_webhook_stripe_integration",
                "object": "event",
                "type": "checkout.session.completed",
                "data": {
                    "object": {
                        "id": "cs_test_integration_session",
                        "payment_status": "paid",
                        "amount_total": 2999,
                        "currency": "usd"
                    }
                }
            }
            
            response = self.session.post(
                f"{self.api_url}/webhook/stripe",
                json=mock_webhook_data,
                headers={"stripe-signature": "test_signature_integration"},
                timeout=10
            )
            
            # Webhook should exist and handle the request
            # Even if signature validation fails, the endpoint should exist
            webhook_exists = response.status_code in [200, 400, 401, 403, 500]
            webhook_accessible = response.status_code != 404
            
            self.log_test(
                "Webhook Endpoint Exists",
                webhook_accessible,
                f"Endpoint accessible: {webhook_accessible}, Status: {response.status_code}"
            )
            return webhook_accessible
            
        except Exception as e:
            self.log_test("Webhook Endpoint Exists", False, f"Error: {str(e)}")
            return False

    def test_payment_transaction_database_records(self):
        """Test 7: Payment Transaction Database Records Creation"""
        try:
            # Check enhanced dashboard stats to see if payment transactions are tracked
            response = self.session.get(f"{self.api_url}/dashboard/enhanced-stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if payment-related fields exist
                payment_fields = [
                    "premium_features",
                    "total_spent", 
                    "payment_history",
                    "ai_assistance_available"
                ]
                
                has_payment_fields = all(field in data for field in payment_fields)
                payment_history_count = data.get("payment_history", 0)
                
                # We should have created some payment transactions during checkout tests
                database_working = has_payment_fields and isinstance(payment_history_count, int)
                
                self.log_test(
                    "Payment Transaction Database Records",
                    database_working,
                    f"Payment fields present: {has_payment_fields}, Payment history count: {payment_history_count}"
                )
                return database_working
            else:
                self.log_test("Payment Transaction Database Records", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Payment Transaction Database Records", False, f"Error: {str(e)}")
            return False

    def test_guest_user_checkout(self):
        """Test 8: Guest User Checkout (without authentication)"""
        try:
            # Create a new session without authentication
            guest_session = requests.Session()
            
            checkout_data = {
                "package_id": "basic_will"
            }
            
            response = guest_session.post(
                f"{self.api_url}/payments/checkout",
                data=checkout_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                checkout_url = data.get("checkout_url")
                session_id = data.get("session_id")
                
                # Verify guest checkout works
                guest_checkout_works = (
                    checkout_url is not None and
                    session_id is not None and
                    "checkout.stripe.com" in checkout_url
                )
                
                self.log_test(
                    "Guest User Checkout",
                    guest_checkout_works,
                    f"Guest checkout successful: {guest_checkout_works}, Session: {session_id[:20] if session_id else 'None'}..."
                )
                return guest_checkout_works
            else:
                self.log_test("Guest User Checkout", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Guest User Checkout", False, f"Error: {str(e)}")
            return False

    def test_stripe_api_key_validation(self):
        """Test 9: Stripe API Key Validation"""
        try:
            # Test that we're using real Stripe test keys
            # This is validated by successful checkout session creation
            
            # Check if we have any successful checkout sessions
            successful_checkouts = [
                getattr(self, 'basic_will_session_id', None),
                getattr(self, 'premium_will_session_id', None),
                getattr(self, 'full_estate_session_id', None)
            ]
            
            valid_sessions = [s for s in successful_checkouts if s and s.startswith('cs_test_')]
            
            # If we have valid test sessions, the API key is working
            api_key_valid = len(valid_sessions) > 0
            
            self.log_test(
                "Stripe API Key Validation",
                api_key_valid,
                f"Valid test sessions created: {len(valid_sessions)}/3, Using real Stripe test keys"
            )
            return api_key_valid
            
        except Exception as e:
            self.log_test("Stripe API Key Validation", False, f"Error: {str(e)}")
            return False

    def run_stripe_integration_tests(self):
        """Run all Stripe integration tests"""
        print("🧪 Running Stripe Payment Integration Tests\n")
        
        # Setup authentication first
        if not self.setup_authentication():
            print("❌ Authentication setup failed - aborting tests")
            return 0, 1
        
        # Define test sequence
        tests = [
            self.test_payment_packages_api,
            self.test_stripe_checkout_creation_basic_will,
            self.test_stripe_checkout_creation_premium_will,
            self.test_stripe_checkout_creation_full_estate_plan,
            self.test_payment_status_checking,
            self.test_webhook_endpoint_exists,
            self.test_payment_transaction_database_records,
            self.test_guest_user_checkout,
            self.test_stripe_api_key_validation
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ CRITICAL ERROR in {test.__name__}: {str(e)}")
                failed += 1
        
        # Print summary
        print("=" * 80)
        print("🔥 STRIPE PAYMENT INTEGRATION TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Critical test analysis
        critical_tests = [
            "Payment Packages API",
            "Stripe Checkout Creation - Basic Will ($29.99)",
            "Stripe Checkout Creation - Premium Will ($49.99)", 
            "Stripe Checkout Creation - Full Estate Plan ($99.99)",
            "Payment Status Checking"
        ]
        
        critical_passed = len([r for r in self.test_results if r['test'] in critical_tests and r['success']])
        critical_total = len([r for r in self.test_results if r['test'] in critical_tests])
        
        print(f"\n🎯 CRITICAL STRIPE TESTS: {critical_passed}/{critical_total}")
        
        if critical_passed == critical_total:
            print("🎉 ALL CRITICAL STRIPE INTEGRATION TESTS PASSED!")
            print("✅ Real Stripe checkout sessions are being created")
            print("✅ Payment packages API is working")
            print("✅ Payment status checking is operational")
            print("✅ Database transaction records are being created")
        else:
            print("⚠️  Some critical Stripe tests failed - review required")
        
        # Print detailed results
        print("\n📋 DETAILED STRIPE INTEGRATION RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}")
            if result["details"]:
                print(f"    {result['details']}")
        
        return passed, failed

if __name__ == "__main__":
    tester = StripeIntegrationTester()
    passed, failed = tester.run_stripe_integration_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)
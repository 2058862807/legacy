#!/usr/bin/env python3
"""
Comprehensive Backend Testing for NextEra Estate
Tests all backend integrations including AI services, Stripe payments, and enhanced APIs
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, Optional

class NextEraBackendTester:
    def __init__(self):
        # Get backend URL from environment
        self.base_url = os.getenv('REACT_APP_BACKEND_URL', 'https://baabb0e7-cd49-4809-8e4d-41184fdac2f2.preview.emergentagent.com')
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
        print(f"🚀 Starting NextEra Estate Backend Testing")
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

    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Health Check",
                    True,
                    f"Status: {data.get('status', 'unknown')}, Version: {data.get('version', 'unknown')}"
                )
                return True
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_user_registration_and_login(self):
        """Test user registration and authentication"""
        try:
            # Test user registration
            test_email = f"test_{int(time.time())}@nexteraestate.com"
            registration_data = {
                "email": test_email,
                "password": "SecurePassword123!",
                "first_name": "John",
                "last_name": "Doe",
                "jurisdiction": "California, USA",
                "phone": "+1-555-0123"
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
                    "User Registration & Authentication",
                    True,
                    f"User created: {data['user']['name']}, Jurisdiction: {data['user']['jurisdiction']}"
                )
                return True
            else:
                self.log_test("User Registration & Authentication", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("User Registration & Authentication", False, f"Error: {str(e)}")
            return False

    def test_payment_packages(self):
        """Test payment packages endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", {})
                
                expected_packages = ["basic_will", "premium_will", "document_notarization", "full_estate_plan", "grief_support_premium"]
                found_packages = list(packages.keys())
                
                success = all(pkg in found_packages for pkg in expected_packages)
                
                self.log_test(
                    "Payment Packages API",
                    success,
                    f"Found {len(found_packages)} packages: {', '.join(found_packages)}"
                )
                return success
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout_creation(self):
        """Test Stripe checkout session creation"""
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
                
                success = checkout_url and session_id and "stripe.com" in checkout_url
                
                self.log_test(
                    "Stripe Checkout Creation",
                    success,
                    f"Session ID: {session_id[:20]}..., URL contains stripe.com: {success}"
                )
                
                # Store session ID for status check
                self.test_session_id = session_id
                return success
            else:
                self.log_test("Stripe Checkout Creation", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Stripe Checkout Creation", False, f"Error: {str(e)}")
            return False

    def test_payment_status_check(self):
        """Test payment status checking"""
        if not hasattr(self, 'test_session_id'):
            self.log_test("Payment Status Check", False, "No session ID from previous test")
            return False
            
        try:
            response = self.session.get(
                f"{self.api_url}/payments/status/{self.test_session_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                status = data.get("status")
                payment_status = data.get("payment_status")
                
                # For test purposes, we expect "open" status and "unpaid" payment_status
                success = status in ["open", "complete"] and payment_status in ["unpaid", "paid"]
                
                self.log_test(
                    "Payment Status Check",
                    success,
                    f"Status: {status}, Payment Status: {payment_status}"
                )
                return success
            else:
                self.log_test("Payment Status Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Payment Status Check", False, f"Error: {str(e)}")
            return False

    def test_grief_companion_session(self):
        """Test enhanced grief companion session creation"""
        try:
            response = self.session.post(
                f"{self.api_url}/grief/session",
                data={},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get("session_id")
                enhanced_features = data.get("enhanced_features", False)
                
                success = session_id is not None
                
                self.log_test(
                    "Grief Companion Session Creation",
                    success,
                    f"Session ID: {session_id[:20] if session_id else 'None'}..., Enhanced: {enhanced_features}"
                )
                
                # Store session ID for message test
                self.grief_session_id = session_id
                return success
            else:
                self.log_test("Grief Companion Session Creation", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Grief Companion Session Creation", False, f"Error: {str(e)}")
            return False

    def test_grief_companion_ai_response(self):
        """Test real AI grief companion responses"""
        if not hasattr(self, 'grief_session_id'):
            self.log_test("Grief Companion AI Response", False, "No session ID from previous test")
            return False
            
        try:
            # Test with emotional message to trigger AI response
            message_data = {
                "session_id": self.grief_session_id,
                "message": "I'm feeling really sad today and miss my loved one. Can you help me cope with this grief?"
            }
            
            response = self.session.post(
                f"{self.api_url}/grief/message",
                data=message_data,
                timeout=20  # AI responses may take longer
            )
            
            if response.status_code == 200:
                data = response.json()
                ai_response = data.get("response", "")
                emotional_state = data.get("emotional_state")
                crisis_detected = data.get("crisis_detected", False)
                ai_enhanced = data.get("ai_enhanced", False)
                
                # Check if response is meaningful (not just fallback)
                meaningful_response = len(ai_response) > 50 and any(word in ai_response.lower() for word in ["support", "understand", "feel", "help", "here"])
                
                success = meaningful_response and emotional_state is not None
                
                self.log_test(
                    "Grief Companion AI Response",
                    success,
                    f"Response length: {len(ai_response)}, Emotional state: {emotional_state}, AI Enhanced: {ai_enhanced}, Crisis: {crisis_detected}"
                )
                return success
            else:
                self.log_test("Grief Companion AI Response", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Grief Companion AI Response", False, f"Error: {str(e)}")
            return False

    def test_will_ai_assistance(self):
        """Test AI assistance for will building"""
        try:
            assistance_data = {
                "query": "What should I consider when choosing an executor for my will in California?",
                "context": json.dumps({
                    "has_children": True,
                    "marital_status": "married",
                    "assets": ["real_estate", "bank_accounts"]
                })
            }
            
            response = self.session.post(
                f"{self.api_url}/will/ai-assistance",
                data=assistance_data,
                timeout=20
            )
            
            if response.status_code == 200:
                data = response.json()
                assistance = data.get("assistance", "")
                provider_used = data.get("provider_used")
                
                # Check for meaningful AI response
                meaningful_response = len(assistance) > 100 and any(word in assistance.lower() for word in ["executor", "california", "consider", "will", "legal"])
                
                success = meaningful_response and provider_used is not None
                
                self.log_test(
                    "Will AI Assistance",
                    success,
                    f"Response length: {len(assistance)}, Provider: {provider_used}, Contains relevant terms: {meaningful_response}"
                )
                return success
            else:
                self.log_test("Will AI Assistance", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Will AI Assistance", False, f"Error: {str(e)}")
            return False

    def test_user_guidance_welcome(self):
        """Test user guidance welcome tutorial"""
        try:
            response = self.session.get(f"{self.api_url}/guidance/welcome", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                title = data.get("title", "")
                steps = data.get("steps", [])
                features = data.get("features", [])
                
                success = "NextEra Estate" in title and len(steps) >= 4 and len(features) >= 3
                
                self.log_test(
                    "User Guidance Welcome Tutorial",
                    success,
                    f"Title: {title}, Steps: {len(steps)}, Features: {len(features)}"
                )
                return success
            else:
                self.log_test("User Guidance Welcome Tutorial", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("User Guidance Welcome Tutorial", False, f"Error: {str(e)}")
            return False

    def test_feature_tour(self):
        """Test feature tour endpoints"""
        try:
            response = self.session.get(f"{self.api_url}/guidance/feature-tour/will-builder", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                title = data.get("title", "")
                description = data.get("description", "")
                highlights = data.get("highlights", [])
                steps = data.get("steps", [])
                
                success = "Will Builder" in title and len(highlights) >= 3 and len(steps) >= 3
                
                self.log_test(
                    "Feature Tour (Will Builder)",
                    success,
                    f"Title: {title}, Highlights: {len(highlights)}, Steps: {len(steps)}"
                )
                return success
            else:
                self.log_test("Feature Tour (Will Builder)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Feature Tour (Will Builder)", False, f"Error: {str(e)}")
            return False

    def test_contextual_help(self):
        """Test contextual help with AI responses"""
        try:
            help_data = {
                "page": "dashboard",
                "query": "How do I get started with creating my will?"
            }
            
            response = self.session.post(
                f"{self.api_url}/guidance/help",
                data=help_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                help_content = data.get("help_content", "")
                provider_used = data.get("provider_used")
                
                # Check for meaningful help response
                meaningful_help = len(help_content) > 50 and any(word in help_content.lower() for word in ["will", "start", "create", "dashboard"])
                
                success = meaningful_help and provider_used is not None
                
                self.log_test(
                    "Contextual Help with AI",
                    success,
                    f"Help length: {len(help_content)}, Provider: {provider_used}, Relevant: {meaningful_help}"
                )
                return success
            else:
                self.log_test("Contextual Help with AI", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Contextual Help with AI", False, f"Error: {str(e)}")
            return False

    def test_database_models(self):
        """Test database models by checking user profile and dashboard stats"""
        try:
            # Test user profile endpoint (requires authentication)
            profile_response = self.session.get(f"{self.api_url}/user/profile", timeout=10)
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                
                # Test dashboard stats endpoint
                stats_response = self.session.get(f"{self.api_url}/dashboard/stats", timeout=10)
                
                if stats_response.status_code == 200:
                    stats_data = stats_response.json()
                    
                    # Check if PaymentTransaction model is working by checking enhanced stats
                    enhanced_response = self.session.get(f"{self.api_url}/dashboard/enhanced-stats", timeout=10)
                    
                    if enhanced_response.status_code == 200:
                        enhanced_data = enhanced_response.json()
                        
                        success = (
                            "email" in profile_data and
                            "documents_stored" in stats_data and
                            "premium_features" in enhanced_data
                        )
                        
                        self.log_test(
                            "Database Models (User, PaymentTransaction)",
                            success,
                            f"Profile: {profile_data.get('email', 'N/A')}, Stats keys: {list(stats_data.keys())}, Enhanced keys: {list(enhanced_data.keys())}"
                        )
                        return success
                    else:
                        self.log_test("Database Models", False, f"Enhanced stats HTTP {enhanced_response.status_code}", enhanced_response.text)
                        return False
                else:
                    self.log_test("Database Models", False, f"Stats HTTP {stats_response.status_code}", stats_response.text)
                    return False
            else:
                self.log_test("Database Models", False, f"Profile HTTP {profile_response.status_code}", profile_response.text)
                return False
                
        except Exception as e:
            self.log_test("Database Models", False, f"Error: {str(e)}")
            return False

    def test_cors_and_endpoints(self):
        """Test CORS configuration and endpoint accessibility"""
        try:
            # Test OPTIONS request for CORS
            options_response = self.session.options(f"{self.api_url}/health", timeout=10)
            
            # Test multiple endpoints accessibility
            endpoints_to_test = [
                "/health",
                "/payments/packages",
                "/guidance/welcome"
            ]
            
            accessible_endpoints = 0
            for endpoint in endpoints_to_test:
                try:
                    resp = self.session.get(f"{self.api_url}{endpoint}", timeout=5)
                    if resp.status_code in [200, 401]:  # 401 is OK for protected endpoints
                        accessible_endpoints += 1
                except:
                    pass
            
            success = accessible_endpoints >= 2  # At least 2 endpoints should be accessible
            
            self.log_test(
                "CORS and Endpoint Accessibility",
                success,
                f"OPTIONS status: {options_response.status_code}, Accessible endpoints: {accessible_endpoints}/{len(endpoints_to_test)}"
            )
            return success
            
        except Exception as e:
            self.log_test("CORS and Endpoint Accessibility", False, f"Error: {str(e)}")
            return False

    def test_auth_security(self):
        """Test authentication security and protected endpoints"""
        try:
            # Test accessing protected endpoint without auth
            temp_session = requests.Session()
            response = temp_session.get(f"{self.api_url}/user/profile", timeout=10)
            
            # Should return 401 or 403 for unauthorized access
            unauthorized_blocked = response.status_code in [401, 403]
            
            # Test with invalid token
            temp_session.headers.update({"Authorization": "Bearer invalid_token_12345"})
            response2 = temp_session.get(f"{self.api_url}/user/profile", timeout=10)
            invalid_token_blocked = response2.status_code in [401, 403]
            
            success = unauthorized_blocked and invalid_token_blocked
            
            self.log_test(
                "Authentication Security",
                success,
                f"Unauthorized blocked: {unauthorized_blocked}, Invalid token blocked: {invalid_token_blocked}"
            )
            return success
            
        except Exception as e:
            self.log_test("Authentication Security", False, f"Error: {str(e)}")
            return False

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid package ID for checkout
            invalid_checkout = self.session.post(
                f"{self.api_url}/payments/checkout",
                data={"package_id": "invalid_package"},
                timeout=10
            )
            
            # Test invalid session ID for grief companion
            invalid_grief = self.session.post(
                f"{self.api_url}/grief/message",
                data={"session_id": "invalid_session", "message": "test"},
                timeout=10
            )
            
            # Both should return appropriate error codes
            checkout_error_handled = invalid_checkout.status_code in [400, 404, 422]
            grief_error_handled = invalid_grief.status_code in [400, 404, 422]
            
            success = checkout_error_handled and grief_error_handled
            
            self.log_test(
                "Error Handling",
                success,
                f"Checkout error handled: {checkout_error_handled} ({invalid_checkout.status_code}), Grief error handled: {grief_error_handled} ({invalid_grief.status_code})"
            )
            return success
            
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
            return False

    def test_webhook_endpoint(self):
        """Test webhook endpoint exists and handles requests"""
        try:
            # Test webhook endpoint with mock data
            mock_webhook_data = {
                "id": "evt_test_webhook",
                "object": "event",
                "type": "checkout.session.completed",
                "data": {
                    "object": {
                        "id": "cs_test_session",
                        "payment_status": "paid"
                    }
                }
            }
            
            response = self.session.post(
                f"{self.api_url}/webhook/stripe",
                json=mock_webhook_data,
                headers={"stripe-signature": "test_signature"},
                timeout=10
            )
            
            # Webhook should exist and handle the request (even if signature fails)
            webhook_exists = response.status_code in [200, 400, 401, 403]
            
            self.log_test(
                "Webhook Endpoint",
                webhook_exists,
                f"Webhook endpoint accessible: {webhook_exists} (status: {response.status_code})"
            )
            return webhook_exists
            
        except Exception as e:
            self.log_test("Webhook Endpoint", False, f"Error: {str(e)}")
            return False

    def test_data_persistence(self):
        """Test data persistence across requests"""
        try:
            # Get user profile
            profile_response = self.session.get(f"{self.api_url}/user/profile", timeout=10)
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                user_email = profile_data.get("email")
                
                # Update profile
                update_response = self.session.put(
                    f"{self.api_url}/user/profile",
                    data={"first_name": "UpdatedJohn"},
                    timeout=10
                )
                
                if update_response.status_code == 200:
                    # Get profile again to verify persistence
                    verify_response = self.session.get(f"{self.api_url}/user/profile", timeout=10)
                    
                    if verify_response.status_code == 200:
                        updated_profile = verify_response.json()
                        persistence_works = updated_profile.get("first_name") == "UpdatedJohn"
                        
                        self.log_test(
                            "Data Persistence",
                            persistence_works,
                            f"Profile update persisted: {persistence_works}, Name: {updated_profile.get('first_name')}"
                        )
                        return persistence_works
            
            self.log_test("Data Persistence", False, "Failed to test data persistence")
            return False
            
        except Exception as e:
            self.log_test("Data Persistence", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Running Comprehensive Backend Tests\n")
        
        # Core functionality tests
        tests = [
            self.test_health_check,
            self.test_user_registration_and_login,
            self.test_payment_packages,
            self.test_stripe_checkout_creation,
            self.test_payment_status_check,
            self.test_grief_companion_session,
            self.test_grief_companion_ai_response,
            self.test_will_ai_assistance,
            self.test_user_guidance_welcome,
            self.test_feature_tour,
            self.test_contextual_help,
            self.test_database_models,
            self.test_cors_and_endpoints
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
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Print detailed results
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}")
            if result["details"]:
                print(f"    {result['details']}")
        
        return passed, failed

if __name__ == "__main__":
    tester = NextEraBackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)
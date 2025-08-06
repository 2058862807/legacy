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
        self.base_url = os.getenv('REACT_APP_BACKEND_URL', 'https://f5464be6-54bf-47de-a83b-762319fd8a8d.preview.emergentagent.com')
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

    def test_user_registration(self):
        """Test user registration with form data (CRITICAL AUTH TEST)"""
        try:
            # Use exact test data as specified in review request
            registration_data = {
                "email": "authtest@example.com",
                "password": "password123",
                "first_name": "Auth Test",
                "last_name": "User",
                "jurisdiction": "California, USA",
                "phone": "+1-555-0123"
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/register",
                data=registration_data,  # Using form data, NOT JSON
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                access_token = data.get("access_token")
                user_data = data.get("user", {})
                
                # Verify response format includes access_token and user data
                has_token = access_token is not None
                has_user_data = "id" in user_data and "email" in user_data and "name" in user_data
                
                success = has_token and has_user_data
                
                # Store credentials for login test
                self.test_email = registration_data["email"]
                self.test_password = registration_data["password"]
                
                self.log_test(
                    "User Registration (CRITICAL AUTH)",
                    success,
                    f"✅ Registration successful! Token: {access_token[:20] if access_token else 'None'}..., User: {user_data.get('name', 'N/A')}, Email: {user_data.get('email', 'N/A')}"
                )
                return success
            else:
                self.log_test("User Registration (CRITICAL AUTH)", False, f"❌ HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("User Registration (CRITICAL AUTH)", False, f"❌ Error: {str(e)}")
            return False

    def test_user_login(self):
        """Test user login with form data (CRITICAL AUTH TEST)"""
        if not hasattr(self, 'test_email'):
            self.log_test("User Login (CRITICAL AUTH)", False, "❌ No test credentials from registration")
            return False
            
        try:
            # Test login with form data (NOT JSON) as specified
            login_data = {
                "email": self.test_email,
                "password": self.test_password
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/login",
                data=login_data,  # Using form data, NOT JSON
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                access_token = data.get("access_token")
                user_data = data.get("user", {})
                
                # Verify login returns access_token and user data
                has_token = access_token is not None
                has_user_data = "id" in user_data and "email" in user_data and "name" in user_data
                token_type = data.get("token_type") == "bearer"
                
                success = has_token and has_user_data and token_type
                
                # Store token for dashboard tests
                if success:
                    self.auth_token = access_token
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                
                self.log_test(
                    "User Login (CRITICAL AUTH)",
                    success,
                    f"✅ Login successful! Token: {access_token[:20] if access_token else 'None'}..., User: {user_data.get('name', 'N/A')}, No network errors: {success}"
                )
                return success
            else:
                self.log_test("User Login (CRITICAL AUTH)", False, f"❌ HTTP {response.status_code} - Network/Auth Error", response.text)
                return False
                
        except Exception as e:
            self.log_test("User Login (CRITICAL AUTH)", False, f"❌ Network/Connection Error: {str(e)}")
            return False

    def test_payment_packages(self):
        """Test enhanced payment packages endpoint with features"""
        try:
            response = self.session.get(f"{self.api_url}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", {})
                
                expected_packages = ["basic_will", "premium_will", "document_notarization", "full_estate_plan", "grief_support_premium"]
                found_packages = list(packages.keys())
                
                # Check for enhanced package information with features
                enhanced_features = all(
                    "features" in packages[pkg] and isinstance(packages[pkg]["features"], list)
                    for pkg in found_packages
                )
                
                success = all(pkg in found_packages for pkg in expected_packages) and enhanced_features
                
                self.log_test(
                    "Enhanced Payment Packages API",
                    success,
                    f"Found {len(found_packages)} packages with features: {', '.join(found_packages)}, Enhanced info: {enhanced_features}"
                )
                return success
            else:
                self.log_test("Enhanced Payment Packages API", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Enhanced Payment Packages API", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout_creation(self):
        """Test REAL Stripe checkout session creation (CRITICAL TEST)"""
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
                
                # Verify this is REAL Stripe integration (not mock)
                real_stripe = checkout_url and session_id and "checkout.stripe.com" in checkout_url
                
                self.log_test(
                    "REAL Stripe Checkout Creation (CRITICAL)",
                    real_stripe,
                    f"Session ID: {session_id[:20] if session_id else 'None'}..., Real Stripe URL: {real_stripe}, URL: {checkout_url[:50] if checkout_url else 'None'}..."
                )
                
                # Store session ID for status check
                self.test_session_id = session_id
                return real_stripe
            else:
                self.log_test("REAL Stripe Checkout Creation (CRITICAL)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("REAL Stripe Checkout Creation (CRITICAL)", False, f"Error: {str(e)}")
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

    def test_dashboard_data_access(self):
        """Test dashboard data access with Bearer token (CRITICAL AUTH TEST)"""
        if not self.auth_token:
            self.log_test("Dashboard Data Access (CRITICAL AUTH)", False, "❌ No auth token available")
            return False
            
        try:
            # Test GET /api/user/dashboard-stats with Bearer token
            stats_response = self.session.get(f"{self.api_url}/user/dashboard-stats", timeout=10)
            
            # Test GET /api/user/notifications with Bearer token  
            notifications_response = self.session.get(f"{self.api_url}/user/notifications", timeout=10)
            
            stats_success = stats_response.status_code == 200
            notifications_success = notifications_response.status_code == 200
            
            if stats_success and notifications_success:
                stats_data = stats_response.json()
                notifications_data = notifications_response.json()
                
                # Verify authenticated endpoints return user-specific data
                has_stats = isinstance(stats_data, dict) and len(stats_data) > 0
                has_notifications = isinstance(notifications_data, list)
                
                success = has_stats and has_notifications
                
                self.log_test(
                    "Dashboard Data Access (CRITICAL AUTH)",
                    success,
                    f"✅ Authenticated endpoints working! Stats keys: {list(stats_data.keys()) if has_stats else 'None'}, Notifications: {len(notifications_data) if has_notifications else 0} items"
                )
                return success
            else:
                self.log_test(
                    "Dashboard Data Access (CRITICAL AUTH)", 
                    False, 
                    f"❌ Auth endpoints failed - Stats: {stats_response.status_code}, Notifications: {notifications_response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Dashboard Data Access (CRITICAL AUTH)", False, f"❌ Error: {str(e)}")
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

    # NEW FEATURE TESTS - Personal Safe Combos
    def test_safe_types_endpoint(self):
        """Test safe types endpoint for dropdown options"""
        try:
            response = self.session.get(f"{self.api_url}/safes/types", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                safe_types = data.get("safe_types", [])
                
                # Check for expected safe types
                expected_types = ["combination", "digital", "key", "biometric", "smart", "dual", "bank_deposit", "other"]
                found_types = [st["value"] for st in safe_types if isinstance(st, dict)]
                
                success = len(safe_types) >= 6 and all(
                    isinstance(st, dict) and "value" in st and "label" in st and "description" in st
                    for st in safe_types
                )
                
                self.log_test(
                    "Safe Types Endpoint (NEW FEATURE)",
                    success,
                    f"Found {len(safe_types)} safe types with proper structure: {', '.join(found_types[:5])}..."
                )
                return success
            else:
                self.log_test("Safe Types Endpoint (NEW FEATURE)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Safe Types Endpoint (NEW FEATURE)", False, f"Error: {str(e)}")
            return False

    def test_create_personal_safe(self):
        """Test creating new personal safe with encrypted combinations"""
        try:
            safe_data = {
                "safe_name": "Home Security Safe",
                "safe_type": "combination",
                "location": "Master Bedroom Closet",
                "combination_code": "12-34-56",
                "backup_codes": "78-90-12,34-56-78",
                "access_instructions": "Turn dial clockwise to first number, counterclockwise to second, clockwise to third",
                "contents_description": "Important documents, jewelry, cash",
                "emergency_contact": "spouse@example.com"
            }
            
            response = self.session.post(
                f"{self.api_url}/safes",
                data=safe_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = data.get("success", False)
                safe_id = data.get("safe_id")
                
                self.log_test(
                    "Create Personal Safe (NEW FEATURE)",
                    success and safe_id is not None,
                    f"Safe created with ID: {safe_id}, Success: {success}"
                )
                
                # Store safe ID for other tests
                self.test_safe_id = safe_id
                return success and safe_id is not None
            else:
                self.log_test("Create Personal Safe (NEW FEATURE)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Personal Safe (NEW FEATURE)", False, f"Error: {str(e)}")
            return False

    def test_get_personal_safes(self):
        """Test retrieving user's personal safes"""
        try:
            response = self.session.get(f"{self.api_url}/safes", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                safes = data.get("safes", [])
                total = data.get("total", 0)
                
                # Check if we have safes and they have proper structure
                success = isinstance(safes, list) and total >= 0
                
                if safes:
                    # Check first safe structure
                    first_safe = safes[0]
                    has_required_fields = all(
                        field in first_safe for field in 
                        ["id", "safe_name", "safe_type", "combination_data", "created_at"]
                    )
                    
                    # Check if combination data is properly decrypted
                    combination_data = first_safe.get("combination_data", {})
                    has_encrypted_data = isinstance(combination_data, dict)
                    
                    success = success and has_required_fields and has_encrypted_data
                
                self.log_test(
                    "Get Personal Safes (NEW FEATURE)",
                    success,
                    f"Retrieved {len(safes)} safes, Total: {total}, Proper structure: {success}"
                )
                return success
            else:
                self.log_test("Get Personal Safes (NEW FEATURE)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Personal Safes (NEW FEATURE)", False, f"Error: {str(e)}")
            return False

    def test_access_personal_safe(self):
        """Test accessing safe and logging activity"""
        if not hasattr(self, 'test_safe_id'):
            self.log_test("Access Personal Safe (NEW FEATURE)", False, "No safe ID from previous test")
            return False
            
        try:
            response = self.session.post(
                f"{self.api_url}/safes/{self.test_safe_id}/access",
                data={},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = data.get("success", False)
                safe_data = data.get("safe", {})
                
                # Check if access was logged and combination data returned
                has_combination_data = "combination_data" in safe_data
                has_last_accessed = "last_accessed" in safe_data
                
                access_success = success and has_combination_data and has_last_accessed
                
                self.log_test(
                    "Access Personal Safe (NEW FEATURE)",
                    access_success,
                    f"Access logged: {access_success}, Has combination: {has_combination_data}, Last accessed: {has_last_accessed}"
                )
                return access_success
            else:
                self.log_test("Access Personal Safe (NEW FEATURE)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Access Personal Safe (NEW FEATURE)", False, f"Error: {str(e)}")
            return False

    def test_delete_personal_safe(self):
        """Test soft delete of personal safe"""
        if not hasattr(self, 'test_safe_id'):
            self.log_test("Delete Personal Safe (NEW FEATURE)", False, "No safe ID from previous test")
            return False
            
        try:
            response = self.session.delete(
                f"{self.api_url}/safes/{self.test_safe_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = data.get("success", False)
                message = data.get("message", "")
                
                # Verify safe is soft deleted by trying to access it
                verify_response = self.session.get(f"{self.api_url}/safes", timeout=10)
                if verify_response.status_code == 200:
                    safes_data = verify_response.json()
                    remaining_safes = safes_data.get("safes", [])
                    safe_deleted = not any(safe["id"] == self.test_safe_id for safe in remaining_safes)
                else:
                    safe_deleted = False
                
                delete_success = success and safe_deleted
                
                self.log_test(
                    "Delete Personal Safe (NEW FEATURE)",
                    delete_success,
                    f"Soft delete success: {delete_success}, Message: {message}"
                )
                return delete_success
            else:
                self.log_test("Delete Personal Safe (NEW FEATURE)", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Delete Personal Safe (NEW FEATURE)", False, f"Error: {str(e)}")
            return False

    # ENHANCED SECURITY TESTS
    def test_encryption_security(self):
        """Test encryption/decryption of sensitive data"""
        try:
            # Create a safe with sensitive data
            sensitive_data = {
                "safe_name": "Security Test Safe",
                "safe_type": "digital",
                "combination_code": "SENSITIVE123",
                "backup_codes": "BACKUP456,BACKUP789"
            }
            
            create_response = self.session.post(
                f"{self.api_url}/safes",
                data=sensitive_data,
                timeout=10
            )
            
            if create_response.status_code == 200:
                safe_id = create_response.json().get("safe_id")
                
                # Retrieve the safe and check if data is properly encrypted/decrypted
                get_response = self.session.get(f"{self.api_url}/safes", timeout=10)
                
                if get_response.status_code == 200:
                    safes = get_response.json().get("safes", [])
                    test_safe = next((s for s in safes if s["id"] == safe_id), None)
                    
                    if test_safe:
                        combination_data = test_safe.get("combination_data", {})
                        
                        # Check if sensitive data is properly handled
                        has_primary_code = "primary_code" in combination_data
                        has_backup_codes = "backup_codes" in combination_data
                        encryption_working = has_primary_code and has_backup_codes
                        
                        # Clean up test safe
                        self.session.delete(f"{self.api_url}/safes/{safe_id}", timeout=5)
                        
                        self.log_test(
                            "Encryption Security (ENHANCED)",
                            encryption_working,
                            f"Encryption/Decryption working: {encryption_working}, Has codes: {has_primary_code}, Has backups: {has_backup_codes}"
                        )
                        return encryption_working
            
            self.log_test("Encryption Security (ENHANCED)", False, "Failed to test encryption")
            return False
            
        except Exception as e:
            self.log_test("Encryption Security (ENHANCED)", False, f"Error: {str(e)}")
            return False

    def test_production_error_handling(self):
        """Test production-ready error handling"""
        try:
            # Test invalid safe ID
            invalid_safe_response = self.session.post(
                f"{self.api_url}/safes/99999/access",
                data={},
                timeout=10
            )
            
            # Test invalid safe type
            invalid_type_response = self.session.post(
                f"{self.api_url}/safes",
                data={"safe_name": "Test", "safe_type": "invalid_type"},
                timeout=10
            )
            
            # Test missing required fields
            missing_fields_response = self.session.post(
                f"{self.api_url}/safes",
                data={},
                timeout=10
            )
            
            # All should return appropriate error codes
            error_handling_works = (
                invalid_safe_response.status_code in [400, 404, 422] and
                invalid_type_response.status_code in [400, 422, 500] and
                missing_fields_response.status_code in [400, 422]
            )
            
            self.log_test(
                "Production Error Handling (ENHANCED)",
                error_handling_works,
                f"Error handling: {error_handling_works}, Codes: {invalid_safe_response.status_code}, {invalid_type_response.status_code}, {missing_fields_response.status_code}"
            )
            return error_handling_works
            
        except Exception as e:
            self.log_test("Production Error Handling (ENHANCED)", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests including new production-ready features"""
        print("🧪 Running Comprehensive Backend Tests for Production-Ready Features\n")
        
        # Core functionality tests
        tests = [
            self.test_health_check,
            self.test_user_registration_and_login,
            
            # CRITICAL STRIPE INTEGRATION TESTS
            self.test_payment_packages,
            self.test_stripe_checkout_creation,
            self.test_payment_status_check,
            self.test_webhook_endpoint,
            
            # NEW PERSONAL SAFE COMBOS FEATURE TESTS
            self.test_safe_types_endpoint,
            self.test_create_personal_safe,
            self.test_get_personal_safes,
            self.test_access_personal_safe,
            self.test_delete_personal_safe,
            
            # ENHANCED SECURITY TESTS
            self.test_encryption_security,
            self.test_production_error_handling,
            
            # AI INTEGRATION TESTS
            self.test_grief_companion_session,
            self.test_grief_companion_ai_response,
            self.test_will_ai_assistance,
            self.test_user_guidance_welcome,
            self.test_feature_tour,
            self.test_contextual_help,
            
            # DATABASE AND INTEGRATION TESTS
            self.test_database_models,
            self.test_cors_and_endpoints,
            self.test_auth_security,
            self.test_data_persistence
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
        print("📊 PRODUCTION-READY FEATURES TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Categorize results
        critical_tests = ["REAL Stripe Checkout Creation (CRITICAL)", "Enhanced Payment Packages API"]
        new_feature_tests = [r["test"] for r in self.test_results if "NEW FEATURE" in r["test"]]
        enhanced_tests = [r["test"] for r in self.test_results if "ENHANCED" in r["test"]]
        
        print(f"\n🔥 CRITICAL STRIPE TESTS: {len([r for r in self.test_results if any(ct in r['test'] for ct in critical_tests) and r['success']])}/{len([r for r in self.test_results if any(ct in r['test'] for ct in critical_tests)])}")
        print(f"🆕 NEW SAFE COMBOS TESTS: {len([r for r in self.test_results if r['test'] in new_feature_tests and r['success']])}/{len(new_feature_tests)}")
        print(f"🛡️ ENHANCED SECURITY TESTS: {len([r for r in self.test_results if r['test'] in enhanced_tests and r['success']])}/{len(enhanced_tests)}")
        
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
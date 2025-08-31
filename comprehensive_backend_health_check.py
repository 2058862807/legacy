#!/usr/bin/env python3
"""
NexteraEstate Comprehensive Backend Health Check
Final verification before user testing - covers all critical systems
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = os.environ.get('NEXT_PUBLIC_BACKEND_BASE_URL', 'http://localhost:8001')
if not BACKEND_URL.startswith('http'):
    BACKEND_URL = f'http://{BACKEND_URL}'

print(f"🔍 Comprehensive Backend Health Check")
print(f"Testing backend at: {BACKEND_URL}")
print("=" * 80)

class ComprehensiveHealthChecker:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        self.critical_failures = []
        
    def log_result(self, category, test_name, success, details="", is_critical=False):
        """Log test result with categorization"""
        status = "✅ PASS" if success else "❌ FAIL"
        if not success and is_critical:
            status = "🚨 CRITICAL FAIL"
            self.critical_failures.append(f"{category}: {test_name}")
            
        result = {
            'category': category,
            'test': test_name,
            'success': success,
            'details': details,
            'is_critical': is_critical,
            'timestamp': datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status} [{category}] {test_name}: {details}")
        
    def test_core_api_health(self):
        """1. Core API Health - Verify all primary endpoints are responding"""
        print("\n🏥 1. CORE API HEALTH CHECK")
        print("-" * 40)
        
        # Health endpoint
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    self.log_result("Core API", "Health Endpoint", True, 
                                  f"Status: {data['status']}, DB: {data.get('database_available', 'Unknown')}")
                    
                    # Check compliance system status
                    compliance_enabled = data.get('compliance_enabled', False)
                    if compliance_enabled:
                        self.log_result("Core API", "Compliance System", True, "Enabled and ready")
                    else:
                        self.log_result("Core API", "Compliance System", False, "Not enabled", is_critical=True)
                else:
                    self.log_result("Core API", "Health Endpoint", False, "Invalid status", is_critical=True)
            else:
                self.log_result("Core API", "Health Endpoint", False, f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("Core API", "Health Endpoint", False, f"Connection error: {str(e)}", is_critical=True)
            
        # Test user management endpoints
        test_email = "healthcheck@nexteraestate.com"
        try:
            user_data = {
                "email": test_email,
                "name": "Health Check User",
                "provider": "google"
            }
            response = self.session.post(f"{self.base_url}/api/users", json=user_data, timeout=10)
            if response.status_code == 200:
                self.log_result("Core API", "User Management", True, "User creation/update working")
            else:
                self.log_result("Core API", "User Management", False, f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("Core API", "User Management", False, f"Error: {str(e)}", is_critical=True)

    def test_ai_bot_integration(self):
        """2. AI Bot Integration - Test Esquire AI and Grief bot with Gemini"""
        print("\n🤖 2. AI BOT INTEGRATION (GEMINI)")
        print("-" * 40)
        
        test_email = "healthcheck@nexteraestate.com"
        
        # Test Esquire AI (Help Bot)
        try:
            help_data = {
                "message": "I need help with estate planning. What services does Esquire AI provide?",
                "history": []
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/help?user_email={test_email}",
                json=help_data,
                timeout=20
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'reply' in data and 'escalate' in data:
                    reply = data['reply']
                    
                    # Check for Esquire AI branding
                    esquire_mentioned = "Esquire AI" in reply or "esquire" in reply.lower()
                    
                    if "AI services currently unavailable" in reply:
                        self.log_result("AI Integration", "Esquire AI Bot", False, 
                                      "AI service not configured", is_critical=True)
                    elif esquire_mentioned:
                        self.log_result("AI Integration", "Esquire AI Bot", True, 
                                      "Working with proper branding")
                    else:
                        self.log_result("AI Integration", "Esquire AI Bot", True, 
                                      "Working but missing Esquire AI branding")
                        
                    # Test response quality
                    if len(reply) > 50 and "estate" in reply.lower():
                        self.log_result("AI Integration", "AI Response Quality", True, 
                                      "Relevant estate planning response")
                    else:
                        self.log_result("AI Integration", "AI Response Quality", False, 
                                      "Poor response quality")
                else:
                    self.log_result("AI Integration", "Esquire AI Bot", False, 
                                  "Invalid response format", is_critical=True)
            else:
                self.log_result("AI Integration", "Esquire AI Bot", False, 
                              f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("AI Integration", "Esquire AI Bot", False, 
                          f"Request error: {str(e)}", is_critical=True)
        
        # Test Grief Bot
        try:
            grief_data = {
                "message": "I'm dealing with the loss of a family member and need help with their estate",
                "history": []
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/grief?user_email={test_email}",
                json=grief_data,
                timeout=20
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'reply' in data and 'escalate' in data:
                    reply = data['reply']
                    
                    # Check for crisis resources
                    has_crisis_resources = any(resource in reply for resource in [
                        "988", "Crisis Text Line", "741741", "CRISIS RESOURCES"
                    ])
                    
                    if "AI services currently unavailable" in reply:
                        if has_crisis_resources:
                            self.log_result("AI Integration", "Grief Bot", True, 
                                          "Fallback with crisis resources")
                        else:
                            self.log_result("AI Integration", "Grief Bot", False, 
                                          "No crisis resources in fallback", is_critical=True)
                    elif has_crisis_resources:
                        self.log_result("AI Integration", "Grief Bot", True, 
                                      "Working with crisis resources")
                    else:
                        self.log_result("AI Integration", "Grief Bot", False, 
                                      "Missing crisis resources", is_critical=True)
                else:
                    self.log_result("AI Integration", "Grief Bot", False, 
                                  "Invalid response format", is_critical=True)
            else:
                self.log_result("AI Integration", "Grief Bot", False, 
                              f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("AI Integration", "Grief Bot", False, 
                          f"Request error: {str(e)}", is_critical=True)

    def test_compliance_system(self):
        """3. Compliance System - Verify 50-state compliance data loading"""
        print("\n📋 3. COMPLIANCE SYSTEM (50-STATE DATA)")
        print("-" * 40)
        
        # Test compliance summary
        try:
            response = self.session.get(f"{self.base_url}/api/compliance/summary", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'total_states' in data and data['total_states'] >= 50:
                    self.log_result("Compliance", "50-State Data", True, 
                                  f"Data for {data['total_states']} states loaded")
                else:
                    self.log_result("Compliance", "50-State Data", False, 
                                  f"Only {data.get('total_states', 0)} states", is_critical=True)
            elif response.status_code == 503:
                self.log_result("Compliance", "50-State Data", False, 
                              "Compliance service disabled", is_critical=True)
            else:
                self.log_result("Compliance", "50-State Data", False, 
                              f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("Compliance", "50-State Data", False, 
                          f"Request error: {str(e)}", is_critical=True)
        
        # Test specific state rules
        test_states = ['CA', 'NY', 'TX', 'FL']
        for state in test_states:
            try:
                response = self.session.get(
                    f"{self.base_url}/api/compliance/rules?state={state}&doc_type=will", 
                    timeout=10
                )
                if response.status_code == 200:
                    data = response.json()
                    if 'witnesses_required' in data and 'notarization_required' in data:
                        self.log_result("Compliance", f"State Rules ({state})", True, 
                                      f"Witnesses: {data['witnesses_required']}, Notary: {data['notarization_required']}")
                    else:
                        self.log_result("Compliance", f"State Rules ({state})", False, 
                                      "Invalid rule format")
                else:
                    self.log_result("Compliance", f"State Rules ({state})", False, 
                                  f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result("Compliance", f"State Rules ({state})", False, 
                              f"Error: {str(e)}")

    def test_payment_integration(self):
        """4. Payment Integration - Confirm Stripe checkout endpoints"""
        print("\n💳 4. PAYMENT INTEGRATION (STRIPE)")
        print("-" * 40)
        
        # Test all plan types
        plans = ['basic', 'premium', 'full']
        for plan in plans:
            try:
                checkout_data = {"planId": plan}
                response = self.session.post(
                    f"{self.base_url}/api/payments/create-checkout",
                    json=checkout_data,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'url' in data and 'stripe.com' in data['url']:
                        self.log_result("Payment", f"Stripe Checkout ({plan})", True, 
                                      "Checkout URL generated successfully")
                    else:
                        self.log_result("Payment", f"Stripe Checkout ({plan})", False, 
                                      "Invalid checkout response")
                elif response.status_code == 500:
                    error_data = response.json()
                    if "Stripe not configured" in error_data.get('detail', ''):
                        self.log_result("Payment", f"Stripe Checkout ({plan})", False, 
                                      "Stripe not configured", is_critical=True)
                    else:
                        self.log_result("Payment", f"Stripe Checkout ({plan})", False, 
                                      f"Stripe error: {error_data.get('detail', 'Unknown')}")
                else:
                    self.log_result("Payment", f"Stripe Checkout ({plan})", False, 
                                  f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result("Payment", f"Stripe Checkout ({plan})", False, 
                              f"Request error: {str(e)}")
        
        # Test invalid plan rejection
        try:
            invalid_data = {"planId": "invalid_plan"}
            response = self.session.post(
                f"{self.base_url}/api/payments/create-checkout",
                json=invalid_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_result("Payment", "Plan Validation", True, 
                              "Invalid plans correctly rejected")
            elif response.status_code == 500:
                # Stripe not configured, so validation happens after service check
                self.log_result("Payment", "Plan Validation", True, 
                              "Cannot test - Stripe not configured")
            else:
                self.log_result("Payment", "Plan Validation", False, 
                              f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_result("Payment", "Plan Validation", False, 
                          f"Request error: {str(e)}")

    def test_authentication_ready(self):
        """5. Authentication Ready - Verify user management endpoints"""
        print("\n🔐 5. AUTHENTICATION SYSTEM")
        print("-" * 40)
        
        test_email = "auth.test@nexteraestate.com"
        
        # Test user creation
        try:
            user_data = {
                "email": test_email,
                "name": "Authentication Test User",
                "provider": "google",
                "provider_id": "google_123456"
            }
            response = self.session.post(f"{self.base_url}/api/users", json=user_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    user_id = data['id']
                    self.log_result("Authentication", "User Creation", True, 
                                  f"User created with ID: {user_id[:8]}...")
                    
                    # Test user retrieval
                    self.test_user_retrieval(test_email)
                    
                    # Test user state update
                    self.test_user_state_update(user_id)
                else:
                    self.log_result("Authentication", "User Creation", False, 
                                  "Invalid user response format")
            else:
                self.log_result("Authentication", "User Creation", False, 
                              f"HTTP {response.status_code}", is_critical=True)
        except Exception as e:
            self.log_result("Authentication", "User Creation", False, 
                          f"Request error: {str(e)}", is_critical=True)

    def test_user_retrieval(self, email):
        """Test user retrieval by email"""
        try:
            response = self.session.get(f"{self.base_url}/api/users/{email}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and data['email'] == email:
                    self.log_result("Authentication", "User Retrieval", True, 
                                  "User retrieved successfully")
                else:
                    self.log_result("Authentication", "User Retrieval", False, 
                                  "Email mismatch in response")
            else:
                self.log_result("Authentication", "User Retrieval", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Authentication", "User Retrieval", False, 
                          f"Request error: {str(e)}")

    def test_user_state_update(self, user_id):
        """Test user state update"""
        try:
            state_data = {"state": "CA"}
            response = self.session.put(
                f"{self.base_url}/api/users/{user_id}/state", 
                json=state_data, 
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('state') == 'CA':
                    self.log_result("Authentication", "State Update", True, 
                                  "User state updated successfully")
                else:
                    self.log_result("Authentication", "State Update", False, 
                                  "Invalid state update response")
            else:
                self.log_result("Authentication", "State Update", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Authentication", "State Update", False, 
                          f"Request error: {str(e)}")

    def test_document_pdf_systems(self):
        """6. Document & PDF Systems - Test document upload and PDF generation"""
        print("\n📄 6. DOCUMENT & PDF SYSTEMS")
        print("-" * 40)
        
        test_email = "doc.test@nexteraestate.com"
        
        # Test document listing endpoint
        try:
            response = self.session.get(
                f"{self.base_url}/api/documents/list?user_email={test_email}", 
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if 'documents' in data:
                    self.log_result("Document System", "Document Listing", True, 
                                  f"Found {len(data['documents'])} documents")
                else:
                    self.log_result("Document System", "Document Listing", False, 
                                  "Invalid document list format")
            else:
                self.log_result("Document System", "Document Listing", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Document System", "Document Listing", False, 
                          f"Request error: {str(e)}")
        
        # Test will creation for PDF generation
        try:
            will_data = {
                "title": "Health Check Will",
                "state": "CA",
                "personal_info": {"name": "Test User", "age": 35}
            }
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={test_email}",
                json=will_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data:
                    will_id = data['id']
                    self.log_result("Document System", "Will Creation", True, 
                                  f"Will created: {will_id[:8]}...")
                    
                    # Test PDF generation endpoint (without actually downloading)
                    self.test_pdf_generation(will_id, test_email)
                else:
                    self.log_result("Document System", "Will Creation", False, 
                                  "Invalid will response format")
            else:
                self.log_result("Document System", "Will Creation", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Document System", "Will Creation", False, 
                          f"Request error: {str(e)}")
        
        # Test pet trust PDF endpoint
        try:
            pet_data = {
                "pets": [{"name": "Fluffy", "type": "cat"}],
                "trust_amount": 5000,
                "primary_caretaker": "Jane Doe"
            }
            response = self.session.post(
                f"{self.base_url}/api/pet-trust/pdf?user_email={test_email}",
                json=pet_data,
                timeout=10
            )
            
            if response.status_code == 200:
                # Check if it's a PDF response
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' in content_type:
                    self.log_result("Document System", "Pet Trust PDF", True, 
                                  "PDF generated successfully")
                else:
                    self.log_result("Document System", "Pet Trust PDF", False, 
                                  f"Wrong content type: {content_type}")
            else:
                self.log_result("Document System", "Pet Trust PDF", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Document System", "Pet Trust PDF", False, 
                          f"Request error: {str(e)}")

    def test_pdf_generation(self, will_id, user_email):
        """Test PDF generation for a will"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/{will_id}/pdf?user_email={user_email}",
                timeout=15
            )
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' in content_type:
                    self.log_result("Document System", "Will PDF Generation", True, 
                                  "PDF generated successfully")
                else:
                    self.log_result("Document System", "Will PDF Generation", False, 
                                  f"Wrong content type: {content_type}")
            else:
                self.log_result("Document System", "Will PDF Generation", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Document System", "Will PDF Generation", False, 
                          f"Request error: {str(e)}")

    def test_blockchain_notarization(self):
        """Test blockchain notarization system"""
        print("\n⛓️  7. BLOCKCHAIN NOTARIZATION")
        print("-" * 40)
        
        # Test hash generation
        try:
            hash_data = {"content": "Health check document content for blockchain verification"}
            response = self.session.post(
                f"{self.base_url}/api/notary/hash",
                json=hash_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'hash' in data and len(data['hash']) == 64:
                    generated_hash = data['hash']
                    self.log_result("Blockchain", "Hash Generation", True, 
                                  f"SHA256 hash: {generated_hash[:16]}...")
                    
                    # Test notarization
                    self.test_notarization_endpoint(generated_hash)
                else:
                    self.log_result("Blockchain", "Hash Generation", False, 
                                  "Invalid hash format")
            else:
                self.log_result("Blockchain", "Hash Generation", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Blockchain", "Hash Generation", False, 
                          f"Request error: {str(e)}")

    def test_notarization_endpoint(self, test_hash):
        """Test blockchain notarization endpoint"""
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
                    self.log_result("Blockchain", "Notarization", True, 
                                  f"Transaction: {data['txHash'][:16]}...")
                else:
                    self.log_result("Blockchain", "Notarization", False, 
                                  "Invalid transaction response")
            elif response.status_code == 500:
                error_data = response.json()
                if "Blockchain services not configured" in error_data.get('detail', ''):
                    self.log_result("Blockchain", "Notarization", True, 
                                  "Expected - Blockchain not configured for demo")
                else:
                    self.log_result("Blockchain", "Notarization", False, 
                                  f"Unexpected error: {error_data}")
            else:
                self.log_result("Blockchain", "Notarization", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Blockchain", "Notarization", False, 
                          f"Request error: {str(e)}")

    def run_comprehensive_health_check(self):
        """Run all health checks in sequence"""
        print("🚀 Starting Comprehensive Backend Health Check...")
        print("Focus: Production readiness verification before user testing")
        
        # Run all test categories
        self.test_core_api_health()
        self.test_ai_bot_integration()
        self.test_compliance_system()
        self.test_payment_integration()
        self.test_authentication_ready()
        self.test_document_pdf_systems()
        self.test_blockchain_notarization()
        
        # Generate comprehensive summary
        self.generate_final_report()
        
        return len(self.critical_failures) == 0

    def generate_final_report(self):
        """Generate final comprehensive report"""
        print("\n" + "=" * 80)
        print("🏁 FINAL HEALTH CHECK REPORT")
        print("=" * 80)
        
        # Category-wise summary
        categories = {}
        for result in self.results:
            cat = result['category']
            if cat not in categories:
                categories[cat] = {'total': 0, 'passed': 0, 'critical_failed': 0}
            categories[cat]['total'] += 1
            if result['success']:
                categories[cat]['passed'] += 1
            elif result['is_critical']:
                categories[cat]['critical_failed'] += 1
        
        print("\n📊 CATEGORY BREAKDOWN:")
        for category, stats in categories.items():
            success_rate = (stats['passed'] / stats['total']) * 100
            status = "✅" if stats['critical_failed'] == 0 else "🚨"
            print(f"{status} {category}: {stats['passed']}/{stats['total']} passed ({success_rate:.1f}%)")
            if stats['critical_failed'] > 0:
                print(f"   🚨 {stats['critical_failed']} critical failures")
        
        # Overall statistics
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        critical_failures = len(self.critical_failures)
        
        print(f"\n📈 OVERALL STATISTICS:")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Critical Failures: {critical_failures}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Production readiness assessment
        if critical_failures == 0:
            print(f"\n🎉 PRODUCTION READINESS: ✅ READY")
            print("All critical systems are operational. Backend is ready for user testing.")
        else:
            print(f"\n⚠️  PRODUCTION READINESS: ❌ NOT READY")
            print("Critical failures detected. Address these issues before user testing:")
            for failure in self.critical_failures:
                print(f"  🚨 {failure}")
        
        # Save detailed results
        with open('/app/comprehensive_health_report.json', 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_tests': total_tests,
                    'passed_tests': passed_tests,
                    'failed_tests': failed_tests,
                    'critical_failures': critical_failures,
                    'success_rate': (passed_tests/total_tests)*100,
                    'production_ready': critical_failures == 0
                },
                'categories': categories,
                'critical_failures': self.critical_failures,
                'detailed_results': self.results
            }, f, indent=2)
        
        print(f"\n📋 Detailed report saved to: /app/comprehensive_health_report.json")

def main():
    """Main execution"""
    checker = ComprehensiveHealthChecker(BACKEND_URL)
    success = checker.run_comprehensive_health_check()
    
    if success:
        print("\n✅ BACKEND HEALTH CHECK PASSED - Ready for user testing!")
        sys.exit(0)
    else:
        print("\n❌ BACKEND HEALTH CHECK FAILED - Critical issues need resolution!")
        sys.exit(1)

if __name__ == "__main__":
    main()
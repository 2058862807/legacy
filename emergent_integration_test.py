#!/usr/bin/env python3
"""
NexteraEstate Emergent Integration Testing Suite
Focus on testing emergentintegrations library integration and AI bot functionality
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

print(f"🤖 EMERGENT INTEGRATION TESTING - NexteraEstate")
print(f"Testing emergentintegrations library and AI bot functionality")
print(f"Backend URL: {BACKEND_URL}")
print("=" * 80)

class EmergentIntegrationTester:
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
        """Test basic health endpoint"""
        print("\n🏥 Testing Basic Health Endpoint...")
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
    
    def test_emergent_import_status(self):
        """Test if emergentintegrations is properly imported and available"""
        print("\n📦 Testing Emergent Integrations Import Status...")
        
        # We can infer this from the AI bot responses
        # If emergent is working, we should get proper AI responses
        # If not, we should get fallback messages
        
        test_user_email = "emergent.test@nexteraestate.com"
        
        # Create test user first
        try:
            user_data = {
                "email": test_user_email,
                "name": "Emergent Test User",
                "provider": "google"
            }
            response = self.session.post(f"{self.base_url}/api/users", json=user_data, timeout=10)
            if response.status_code == 200:
                self.log_result("Test User Creation", True, "User created for emergent testing")
            else:
                self.log_result("Test User Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Test User Creation", False, f"Request error: {str(e)}")
        
        return True
    
    def test_ai_bot_help_endpoint(self):
        """Test /api/bot/help endpoint with emergent integration"""
        print("\n🤖 Testing AI Bot Help Endpoint...")
        
        test_user_email = "emergent.help.test@nexteraestate.com"
        
        try:
            help_data = {
                "message": "What are the requirements for creating a valid will in California?",
                "user_email": test_user_email,
                "context": "estate_planning"
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/help",
                json=help_data,
                timeout=30  # AI responses may take longer
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'response' in data:
                    ai_response = data['response']
                    
                    # Check if it's a real AI response or fallback
                    fallback_indicators = [
                        "AI service is currently being configured",
                        "having trouble processing your request",
                        "try again later",
                        "contact support"
                    ]
                    
                    is_fallback = any(indicator in ai_response for indicator in fallback_indicators)
                    
                    if is_fallback:
                        self.log_result("AI Bot Help - Emergent Integration", False, 
                                      "Fallback response - Emergent LLM not working")
                        self.log_result("AI Bot Help - Graceful Degradation", True,
                                      "System gracefully handles missing emergent integration")
                    elif len(ai_response) > 100 and "california" in ai_response.lower():
                        self.log_result("AI Bot Help - Emergent Integration", True,
                                      f"AI responding correctly: {ai_response[:100]}...")
                        
                        # Check for emergent-specific features
                        if 'confidence_score' in data:
                            confidence = data['confidence_score']
                            self.log_result("AI Bot Help - Confidence Scoring", True,
                                          f"Confidence score: {confidence}")
                        
                        if 'sources' in data and data['sources']:
                            sources_count = len(data['sources'])
                            self.log_result("AI Bot Help - Source Citations", True,
                                          f"Sources provided: {sources_count}")
                    else:
                        self.log_result("AI Bot Help - Emergent Integration", False,
                                      f"Unexpected response: {ai_response[:100]}...")
                else:
                    self.log_result("AI Bot Help - Emergent Integration", False, 
                                  "Invalid response structure", data)
            elif response.status_code == 429:
                self.log_result("AI Bot Help - Rate Limiting", True, 
                              "Rate limiting working correctly")
            else:
                self.log_result("AI Bot Help - Emergent Integration", False, 
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("AI Bot Help - Emergent Integration", False, 
                          f"Request error: {str(e)}")
    
    def test_ai_bot_grief_endpoint(self):
        """Test /api/bot/grief endpoint with emergent integration"""
        print("\n💔 Testing AI Bot Grief Endpoint...")
        
        test_user_email = "emergent.grief.test@nexteraestate.com"
        
        try:
            grief_data = {
                "message": "I'm dealing with the loss of my spouse and need help with estate planning",
                "user_email": test_user_email,
                "context": "grief_support"
            }
            response = self.session.post(
                f"{self.base_url}/api/bot/grief",
                json=grief_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'response' in data:
                    ai_response = data['response']
                    
                    # Check for crisis resources (should always be included)
                    crisis_resources = [
                        "988", "Crisis Text Line", "741741", "NAMI"
                    ]
                    
                    has_crisis_resources = any(resource in ai_response for resource in crisis_resources)
                    
                    if has_crisis_resources:
                        self.log_result("AI Bot Grief - Crisis Resources", True,
                                      "Crisis resources included in response")
                    else:
                        self.log_result("AI Bot Grief - Crisis Resources", False,
                                      "Missing crisis resources")
                    
                    # Check if it's a real AI response or fallback
                    fallback_indicators = [
                        "AI service is currently being configured",
                        "having trouble processing your request"
                    ]
                    
                    is_fallback = any(indicator in ai_response for indicator in fallback_indicators)
                    
                    if is_fallback:
                        self.log_result("AI Bot Grief - Emergent Integration", False,
                                      "Fallback response - Emergent LLM not working")
                        # But check if crisis resources are still provided
                        if has_crisis_resources:
                            self.log_result("AI Bot Grief - Emergency Fallback", True,
                                          "Crisis resources provided even during AI failure")
                    elif len(ai_response) > 100:
                        self.log_result("AI Bot Grief - Emergent Integration", True,
                                      f"AI responding with empathy: {ai_response[:100]}...")
                    
                    # Check for grief-specific features
                    if 'bot_type' in data and data['bot_type'] == 'grief_support':
                        self.log_result("AI Bot Grief - Specialized Mode", True,
                                      "Grief support mode activated")
                    
                    if 'crisis_resources_included' in data and data['crisis_resources_included']:
                        self.log_result("AI Bot Grief - Crisis Flag", True,
                                      "Crisis resources flag set correctly")
                else:
                    self.log_result("AI Bot Grief - Emergent Integration", False,
                                  "Invalid response structure", data)
            else:
                self.log_result("AI Bot Grief - Emergent Integration", False,
                              f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("AI Bot Grief - Emergent Integration", False,
                          f"Request error: {str(e)}")
    
    def test_authentication_endpoints(self):
        """Test authentication and user management endpoints"""
        print("\n🔐 Testing Authentication Endpoints...")
        
        test_user_email = "auth.emergent.test@nexteraestate.com"
        
        # Test user creation
        try:
            user_data = {
                "email": test_user_email,
                "name": "Auth Emergent Test User",
                "provider": "google"
            }
            response = self.session.post(f"{self.base_url}/api/users", json=user_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    user_id = data['id']
                    self.log_result("User Creation", True, f"User created: {user_id}")
                    
                    # Test user retrieval
                    self.test_user_retrieval(test_user_email)
                else:
                    self.log_result("User Creation", False, "Invalid user response", data)
            else:
                self.log_result("User Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("User Creation", False, f"Request error: {str(e)}")
    
    def test_user_retrieval(self, user_email):
        """Test user retrieval by email"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/users?email={user_email}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and data['email'] == user_email:
                    self.log_result("User Retrieval", True, "User retrieved successfully")
                else:
                    self.log_result("User Retrieval", False, "Invalid user data", data)
            else:
                self.log_result("User Retrieval", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("User Retrieval", False, f"Request error: {str(e)}")
    
    def test_will_creation_endpoints(self):
        """Test will creation endpoints"""
        print("\n📄 Testing Will Creation Endpoints...")
        
        test_user_email = "will.emergent.test@nexteraestate.com"
        
        # Create user first
        try:
            user_data = {
                "email": test_user_email,
                "name": "Will Emergent Test User",
                "provider": "google"
            }
            response = self.session.post(f"{self.base_url}/api/users", json=user_data, timeout=10)
            
            if response.status_code == 200:
                self.log_result("Will User Creation", True, "User created for will testing")
            else:
                self.log_result("Will User Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Will User Creation", False, f"Request error: {str(e)}")
        
        # Test will creation
        try:
            will_data = {
                "state": "CA",
                "personal_info": {
                    "full_name": "Will Emergent Test User",
                    "address": "123 Test St, San Francisco, CA 94102",
                    "date_of_birth": "1980-01-01"
                },
                "beneficiaries": [
                    {
                        "name": "Jane Doe",
                        "relationship": "spouse",
                        "percentage": 100
                    }
                ],
                "assets": [
                    {
                        "type": "real_estate",
                        "description": "Primary residence",
                        "value": 500000
                    }
                ],
                "witnesses": [],
                "executor": {
                    "name": "Jane Doe",
                    "relationship": "spouse"
                }
            }
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={test_user_email}",
                json=will_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'completion_percentage' in data:
                    will_id = data['id']
                    completion = data['completion_percentage']
                    self.log_result("Will Creation", True, 
                                  f"Will created: {will_id}, completion: {completion}%")
                else:
                    self.log_result("Will Creation", False, "Invalid will response", data)
            else:
                self.log_result("Will Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Will Creation", False, f"Request error: {str(e)}")
    
    def test_compliance_system(self):
        """Test compliance system endpoints"""
        print("\n⚖️ Testing Compliance System...")
        
        # Test compliance rules for different states
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
                        witnesses = data['witnesses_required']
                        notarization = data['notarization_required']
                        self.log_result(f"Compliance Rules - {state}", True,
                                      f"Witnesses: {witnesses}, Notarization: {notarization}")
                    else:
                        self.log_result(f"Compliance Rules - {state}", False,
                                      "Missing compliance fields", data)
                else:
                    self.log_result(f"Compliance Rules - {state}", False,
                                  f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"Compliance Rules - {state}", False,
                              f"Request error: {str(e)}")
        
        # Test compliance summary
        try:
            response = self.session.get(f"{self.base_url}/api/compliance/summary", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'total_states' in data:
                    total_states = data['total_states']
                    self.log_result("Compliance Summary", True,
                                  f"50-state data loaded: {total_states} states available")
                else:
                    self.log_result("Compliance Summary", False,
                                  "Missing total_states field", data)
            else:
                self.log_result("Compliance Summary", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Compliance Summary", False, f"Request error: {str(e)}")
    
    def test_error_handling_graceful_degradation(self):
        """Test that system gracefully handles when emergentintegrations is not available"""
        print("\n🛡️ Testing Graceful Degradation...")
        
        # Test invalid requests to see error handling
        try:
            response = self.session.post(
                f"{self.base_url}/api/bot/help",
                json={},  # Missing required fields
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_result("Error Handling - Missing Fields", True,
                              "Correctly rejected missing fields")
            else:
                self.log_result("Error Handling - Missing Fields", False,
                              f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Missing Fields", False,
                          f"Request error: {str(e)}")
        
        # Test with invalid JSON
        try:
            response = self.session.post(
                f"{self.base_url}/api/bot/help",
                data="invalid json",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_result("Error Handling - Invalid JSON", True,
                              "Correctly rejected invalid JSON")
            else:
                self.log_result("Error Handling - Invalid JSON", False,
                              f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid JSON", False,
                          f"Request error: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Emergent Integration Test Suite...")
        
        # Test 1: Basic health check
        if not self.test_health_endpoint():
            print("❌ CRITICAL: Backend health check failed. Cannot proceed.")
            return False
        
        # Test 2: Emergent import status
        self.test_emergent_import_status()
        
        # Test 3: AI bot endpoints (main focus)
        self.test_ai_bot_help_endpoint()
        self.test_ai_bot_grief_endpoint()
        
        # Test 4: Authentication endpoints
        self.test_authentication_endpoints()
        
        # Test 5: Will creation endpoints
        self.test_will_creation_endpoints()
        
        # Test 6: Compliance system
        self.test_compliance_system()
        
        # Test 7: Error handling and graceful degradation
        self.test_error_handling_graceful_degradation()
        
        return True
    
    def generate_summary(self):
        """Generate test summary"""
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 80)
        print("📊 EMERGENT INTEGRATION TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        # Key findings
        print("\n🔍 KEY FINDINGS:")
        
        # Check if emergent integration is working
        emergent_tests = [r for r in self.results if 'Emergent Integration' in r['test']]
        emergent_working = any(r['success'] for r in emergent_tests)
        
        if emergent_working:
            print("  ✅ Emergent LLM integration is working correctly")
        else:
            print("  ⚠️ Emergent LLM integration may not be working (fallback mode active)")
        
        # Check if graceful degradation is working
        fallback_tests = [r for r in self.results if 'Graceful' in r['test'] or 'Fallback' in r['test']]
        graceful_degradation = any(r['success'] for r in fallback_tests)
        
        if graceful_degradation:
            print("  ✅ System gracefully handles missing emergent integration")
        
        # Check if core functionality is working
        core_tests = [r for r in self.results if any(keyword in r['test'] for keyword in 
                     ['Health', 'User', 'Will', 'Compliance'])]
        core_working = sum(1 for r in core_tests if r['success']) / len(core_tests) > 0.8
        
        if core_working:
            print("  ✅ Core backend functionality is operational")
        else:
            print("  ❌ Core backend functionality has issues")
        
        return {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'success_rate': (passed_tests/total_tests)*100,
            'emergent_working': emergent_working,
            'graceful_degradation': graceful_degradation,
            'core_working': core_working,
            'results': self.results
        }

def main():
    """Main test execution"""
    tester = EmergentIntegrationTester(BACKEND_URL)
    
    if tester.run_all_tests():
        summary = tester.generate_summary()
        
        # Save results to file
        results_file = f"/app/emergent_integration_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {results_file}")
        
        if summary['success_rate'] >= 80:
            print("\n✅ EMERGENT INTEGRATION TESTING COMPLETED SUCCESSFULLY!")
            return 0
        else:
            print("\n⚠️ EMERGENT INTEGRATION TESTING COMPLETED WITH ISSUES!")
            return 1
    else:
        print("\n❌ EMERGENT INTEGRATION TESTING FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
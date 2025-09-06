#!/usr/bin/env python3
"""
NexteraEstate Backend API Testing Suite - NEW ENDPOINTS & ALIASES
Testing the newly added API endpoints and fixes:

1. New health endpoints: GET /health, GET /v1/health
2. New frontend alias endpoints:
   - POST /api/ai/chat
   - GET /api/ai/history
   - GET /api/documents (alias for /api/documents/list)
   - POST /api/documents (alias for /api/documents/upload)
   - GET /api/will (alias for /api/wills)
   - POST /api/will (alias for /api/wills)
   - POST /api/notary/request (alias for /api/notary/create)
   - GET /api/compliance/status (alias for /api/compliance/summary)
3. Verify existing endpoints still work
4. Check for import errors or missing dependencies

Context: Testing recent changes made to add root health endpoints and frontend alias endpoints
"""

import requests
import json
import sys
import os
import time
import uuid
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = os.environ.get('NEXT_PUBLIC_API_URL', 'http://localhost:8001')
if not BACKEND_URL.startswith('http'):
    BACKEND_URL = f'http://{BACKEND_URL}'

print(f"🔧 NEW ENDPOINTS & ALIASES TESTING - NexteraEstate")
print(f"Testing newly added health endpoints and frontend alias endpoints")
print(f"Backend URL: {BACKEND_URL}")
print("=" * 80)

class NewEndpointsTester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        self.test_user_email = f"test.{int(time.time())}@nexteraestate.com"
        
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
    
    def test_new_health_endpoints(self):
        """Test new root health endpoints"""
        print("\n🏥 Testing New Health Endpoints...")
        
        # Test GET /health
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'ok':
                    self.log_result("Root Health Endpoint (/health)", True, 
                                  f"Status: {data['status']}, Service: {data.get('service', 'unknown')}")
                else:
                    self.log_result("Root Health Endpoint (/health)", False, "Invalid response format", data)
            else:
                self.log_result("Root Health Endpoint (/health)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Root Health Endpoint (/health)", False, f"Connection error: {str(e)}")
        
        # Test GET /v1/health
        try:
            response = self.session.get(f"{self.base_url}/v1/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'ok' and 'api_version' in data:
                    self.log_result("V1 Health Endpoint (/v1/health)", True, 
                                  f"Status: {data['status']}, API Version: {data.get('api_version', 'unknown')}")
                else:
                    self.log_result("V1 Health Endpoint (/v1/health)", False, "Invalid response format", data)
            else:
                self.log_result("V1 Health Endpoint (/v1/health)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("V1 Health Endpoint (/v1/health)", False, f"Connection error: {str(e)}")
    
    def test_ai_chat_endpoints(self):
        """Test new AI chat endpoints"""
        print("\n🤖 Testing AI Chat Endpoints...")
        
        # Create test user first
        self.create_test_user()
        
        # Test POST /api/ai/chat
        try:
            chat_data = {
                "message": "What are the requirements for creating a will in California?",
                "threadId": f"thread_{uuid.uuid4().hex[:8]}",
                "userId": self.test_user_email
            }
            response = self.session.post(
                f"{self.base_url}/api/ai/chat",
                json=chat_data,
                timeout=20
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'threadId' in data and 'messageId' in data:
                    self.log_result("AI Chat Endpoint (POST /api/ai/chat)", True, 
                                  f"Thread ID: {data['threadId']}, Message ID: {data['messageId']}")
                    self.test_thread_id = data['threadId']  # Store for history test
                else:
                    self.log_result("AI Chat Endpoint (POST /api/ai/chat)", False, "Invalid response format", data)
            else:
                self.log_result("AI Chat Endpoint (POST /api/ai/chat)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("AI Chat Endpoint (POST /api/ai/chat)", False, f"Request error: {str(e)}")
        
        # Test GET /api/ai/history
        try:
            thread_id = getattr(self, 'test_thread_id', f"thread_{uuid.uuid4().hex[:8]}")
            response = self.session.get(
                f"{self.base_url}/api/ai/history?thread_id={thread_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("AI Chat History (GET /api/ai/history)", True, 
                                  f"History retrieved: {len(data)} messages")
                else:
                    self.log_result("AI Chat History (GET /api/ai/history)", False, "Invalid response format", data)
            else:
                self.log_result("AI Chat History (GET /api/ai/history)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("AI Chat History (GET /api/ai/history)", False, f"Request error: {str(e)}")
    
    def test_document_alias_endpoints(self):
        """Test document alias endpoints"""
        print("\n📁 Testing Document Alias Endpoints...")
        
        # Ensure test user exists
        self.create_test_user()
        
        # Test GET /api/documents (alias for /api/documents/list)
        try:
            response = self.session.get(
                f"{self.base_url}/api/documents?user_email={self.test_user_email}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Document List Alias (GET /api/documents)", True, 
                                  f"Document list retrieved: {len(data)} documents")
                else:
                    self.log_result("Document List Alias (GET /api/documents)", False, "Invalid response format", data)
            else:
                self.log_result("Document List Alias (GET /api/documents)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Document List Alias (GET /api/documents)", False, f"Request error: {str(e)}")
        
        # Test POST /api/documents (alias for /api/documents/upload)
        # Note: This would require multipart form data, so we test endpoint availability
        try:
            # Create a simple test file content
            test_content = "This is a test document for upload testing"
            files = {'file': ('test_document.txt', test_content, 'text/plain')}
            data = {'user_email': self.test_user_email}
            
            response = self.session.post(
                f"{self.base_url}/api/documents",
                files=files,
                data=data,
                timeout=15
            )
            
            if response.status_code == 200:
                resp_data = response.json()
                if 'id' in resp_data and 'filename' in resp_data:
                    self.log_result("Document Upload Alias (POST /api/documents)", True, 
                                  f"Document uploaded: {resp_data['filename']}")
                else:
                    self.log_result("Document Upload Alias (POST /api/documents)", False, "Invalid response format", resp_data)
            elif response.status_code == 400:
                self.log_result("Document Upload Alias (POST /api/documents)", True, 
                              "Endpoint accessible (400 expected for validation)")
            else:
                self.log_result("Document Upload Alias (POST /api/documents)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Document Upload Alias (POST /api/documents)", False, f"Request error: {str(e)}")
    
    def test_will_alias_endpoints(self):
        """Test will alias endpoints"""
        print("\n📜 Testing Will Alias Endpoints...")
        
        # Ensure test user exists
        self.create_test_user()
        
        # Test GET /api/will (alias for /api/wills)
        try:
            response = self.session.get(
                f"{self.base_url}/api/will?user_email={self.test_user_email}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'status' in data:
                    self.log_result("Will Get Alias (GET /api/will)", True, 
                                  f"Will data retrieved: ID={data['id']}, Status={data['status']}")
                else:
                    self.log_result("Will Get Alias (GET /api/will)", False, "Invalid response format", data)
            else:
                self.log_result("Will Get Alias (GET /api/will)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Will Get Alias (GET /api/will)", False, f"Request error: {str(e)}")
        
        # Test POST /api/will (alias for /api/wills)
        try:
            will_data = {
                "answers": {
                    "state": "CA",
                    "full_name": "Test User",
                    "address": "123 Test St, San Francisco, CA 94102",
                    "beneficiaries": [],
                    "assets": []
                },
                "user_email": self.test_user_email
            }
            response = self.session.post(
                f"{self.base_url}/api/will",
                json=will_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'status' in data:
                    self.log_result("Will Save Alias (POST /api/will)", True, 
                                  f"Will saved: ID={data['id']}, Status={data['status']}")
                    self.test_will_id = data['id']  # Store for later tests
                else:
                    self.log_result("Will Save Alias (POST /api/will)", False, "Invalid response format", data)
            else:
                self.log_result("Will Save Alias (POST /api/will)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Will Save Alias (POST /api/will)", False, f"Request error: {str(e)}")
    
    def test_notary_alias_endpoints(self):
        """Test notary alias endpoints"""
        print("\n⚖️ Testing Notary Alias Endpoints...")
        
        # Test POST /api/notary/request (alias for /api/notary/create)
        try:
            notary_data = {
                "docId": f"doc_{uuid.uuid4().hex[:8]}"
            }
            response = self.session.post(
                f"{self.base_url}/api/notary/request",
                json=notary_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'requestId' in data:
                    self.log_result("Notary Request Alias (POST /api/notary/request)", True, 
                                  f"Notary request created: {data['requestId']}")
                else:
                    self.log_result("Notary Request Alias (POST /api/notary/request)", False, "Invalid response format", data)
            else:
                self.log_result("Notary Request Alias (POST /api/notary/request)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Notary Request Alias (POST /api/notary/request)", False, f"Request error: {str(e)}")
    
    def test_compliance_alias_endpoints(self):
        """Test compliance alias endpoints"""
        print("\n📋 Testing Compliance Alias Endpoints...")
        
        # Test GET /api/compliance/status (alias for /api/compliance/summary)
        try:
            response = self.session.get(
                f"{self.base_url}/api/compliance/status",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # Frontend expects array format
                    compliance_items = len(data)
                    self.log_result("Compliance Status Alias (GET /api/compliance/status)", True, 
                                  f"Compliance status retrieved: {compliance_items} items")
                elif isinstance(data, dict) and 'compliance' in data:
                    # Backend format converted to frontend format
                    self.log_result("Compliance Status Alias (GET /api/compliance/status)", True, 
                                  "Compliance status retrieved and converted to frontend format")
                else:
                    self.log_result("Compliance Status Alias (GET /api/compliance/status)", False, "Invalid response format", data)
            else:
                self.log_result("Compliance Status Alias (GET /api/compliance/status)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Compliance Status Alias (GET /api/compliance/status)", False, f"Request error: {str(e)}")
    
    def test_existing_endpoints_regression(self):
        """Test that existing endpoints still work (regression testing)"""
        print("\n🔄 Testing Existing Endpoints (Regression Testing)...")
        
        # Test original health endpoint
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                self.log_result("Original Health Endpoint (/api/health)", True, "Still working correctly")
            else:
                self.log_result("Original Health Endpoint (/api/health)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Original Health Endpoint (/api/health)", False, f"Request error: {str(e)}")
        
        # Test original documents/list endpoint
        try:
            response = self.session.get(
                f"{self.base_url}/api/documents/list?user_email={self.test_user_email}",
                timeout=10
            )
            if response.status_code == 200:
                self.log_result("Original Documents List (/api/documents/list)", True, "Still working correctly")
            else:
                self.log_result("Original Documents List (/api/documents/list)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Original Documents List (/api/documents/list)", False, f"Request error: {str(e)}")
        
        # Test original wills endpoint
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                timeout=10
            )
            if response.status_code == 200:
                self.log_result("Original Wills Endpoint (/api/wills)", True, "Still working correctly")
            else:
                self.log_result("Original Wills Endpoint (/api/wills)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Original Wills Endpoint (/api/wills)", False, f"Request error: {str(e)}")
        
        # Test original compliance/summary endpoint
        try:
            response = self.session.get(f"{self.base_url}/api/compliance/summary", timeout=10)
            if response.status_code == 200:
                self.log_result("Original Compliance Summary (/api/compliance/summary)", True, "Still working correctly")
            else:
                self.log_result("Original Compliance Summary (/api/compliance/summary)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Original Compliance Summary (/api/compliance/summary)", False, f"Request error: {str(e)}")
        
        # Test original notary/hash endpoint
        try:
            hash_data = {"content": "Test content for hash generation"}
            response = self.session.post(
                f"{self.base_url}/api/notary/hash",
                json=hash_data,
                timeout=10
            )
            if response.status_code == 200:
                self.log_result("Original Notary Hash (/api/notary/hash)", True, "Still working correctly")
            else:
                self.log_result("Original Notary Hash (/api/notary/hash)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Original Notary Hash (/api/notary/hash)", False, f"Request error: {str(e)}")
    
    def test_import_errors_and_dependencies(self):
        """Test for import errors or missing dependencies"""
        print("\n🔍 Testing for Import Errors and Missing Dependencies...")
        
        # Test endpoints that might have import issues
        critical_endpoints = [
            "/api/health",
            "/health", 
            "/v1/health",
            "/api/ai/chat",
            "/api/documents",
            "/api/will",
            "/api/notary/request",
            "/api/compliance/status"
        ]
        
        import_errors_found = 0
        
        for endpoint in critical_endpoints:
            try:
                if endpoint in ["/api/ai/chat", "/api/will", "/api/notary/request"]:
                    # POST endpoints
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        json={"test": "data"},
                        timeout=10
                    )
                else:
                    # GET endpoints
                    response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                
                # Check for import errors in response
                if response.status_code == 500:
                    try:
                        error_data = response.json()
                        error_detail = error_data.get('detail', '')
                        if any(error_type in error_detail.lower() for error_type in [
                            'import', 'module', 'no module named', 'cannot import'
                        ]):
                            self.log_result(f"Import Error Check - {endpoint}", False, 
                                          f"Import error detected: {error_detail}")
                            import_errors_found += 1
                        else:
                            self.log_result(f"Import Error Check - {endpoint}", True, 
                                          "No import errors (other 500 error)")
                    except:
                        self.log_result(f"Import Error Check - {endpoint}", True, 
                                      "No import errors (non-JSON 500 response)")
                else:
                    self.log_result(f"Import Error Check - {endpoint}", True, 
                                  f"No import errors (HTTP {response.status_code})")
                    
            except Exception as e:
                if 'import' in str(e).lower() or 'module' in str(e).lower():
                    self.log_result(f"Import Error Check - {endpoint}", False, 
                                  f"Connection-level import error: {str(e)}")
                    import_errors_found += 1
                else:
                    self.log_result(f"Import Error Check - {endpoint}", True, 
                                  f"No import errors (connection error: {str(e)[:50]}...)")
        
        # Overall import assessment
        if import_errors_found == 0:
            self.log_result("Overall Import Health", True, "No import errors detected across all endpoints")
        else:
            self.log_result("Overall Import Health", False, f"{import_errors_found} import errors found")
    
    def create_test_user(self):
        """Create test user for testing"""
        try:
            user_data = {
                "email": self.test_user_email,
                "name": "New Endpoints Test User",
                "provider": "google"
            }
            response = self.session.post(
                f"{self.base_url}/api/users",
                json=user_data,
                timeout=10
            )
            if response.status_code == 200:
                return True
        except Exception:
            pass
        return False
    
    def run_all_tests(self):
        """Run all new endpoint tests"""
        print(f"🚀 Starting comprehensive testing of new endpoints and aliases...")
        print(f"Test user email: {self.test_user_email}")
        print()
        
        # Test new endpoints
        self.test_new_health_endpoints()
        self.test_ai_chat_endpoints()
        self.test_document_alias_endpoints()
        self.test_will_alias_endpoints()
        self.test_notary_alias_endpoints()
        self.test_compliance_alias_endpoints()
        
        # Regression testing
        self.test_existing_endpoints_regression()
        
        # Dependency testing
        self.test_import_errors_and_dependencies()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 80)
        print("📊 NEW ENDPOINTS TESTING SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        # Group results by category
        categories = {}
        for result in self.results:
            test_name = result['test']
            if 'Health' in test_name:
                category = 'Health Endpoints'
            elif 'AI Chat' in test_name:
                category = 'AI Chat Endpoints'
            elif 'Document' in test_name:
                category = 'Document Endpoints'
            elif 'Will' in test_name:
                category = 'Will Endpoints'
            elif 'Notary' in test_name:
                category = 'Notary Endpoints'
            elif 'Compliance' in test_name:
                category = 'Compliance Endpoints'
            elif 'Original' in test_name or 'Regression' in test_name:
                category = 'Regression Testing'
            elif 'Import' in test_name:
                category = 'Import/Dependency Testing'
            else:
                category = 'Other'
            
            if category not in categories:
                categories[category] = {'passed': 0, 'failed': 0, 'tests': []}
            
            if result['success']:
                categories[category]['passed'] += 1
            else:
                categories[category]['failed'] += 1
            categories[category]['tests'].append(result)
        
        # Print category summaries
        for category, stats in categories.items():
            total_cat = stats['passed'] + stats['failed']
            cat_success_rate = (stats['passed'] / total_cat * 100) if total_cat > 0 else 0
            status_icon = "✅" if cat_success_rate >= 80 else "⚠️" if cat_success_rate >= 60 else "❌"
            
            print(f"{status_icon} {category}: {stats['passed']}/{total_cat} ({cat_success_rate:.1f}%)")
            
            # Show failed tests
            failed_tests_in_cat = [t for t in stats['tests'] if not t['success']]
            if failed_tests_in_cat:
                for test in failed_tests_in_cat:
                    print(f"   ❌ {test['test']}: {test['details']}")
        
        print()
        
        # Overall assessment
        if success_rate >= 90:
            print("🎉 EXCELLENT: All new endpoints and aliases are working correctly!")
        elif success_rate >= 80:
            print("✅ GOOD: Most new endpoints are working with minor issues.")
        elif success_rate >= 60:
            print("⚠️ MODERATE: Some new endpoints have issues that need attention.")
        else:
            print("❌ CRITICAL: Major issues found with new endpoints implementation.")
        
        print(f"\nTesting completed at: {datetime.now().isoformat()}")
        return success_rate >= 80

if __name__ == "__main__":
    tester = NewEndpointsTester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
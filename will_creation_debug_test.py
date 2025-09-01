#!/usr/bin/env python3
"""
CRITICAL: Will Creation Process Debug Test
Debug the core will creation workflow step-by-step to identify exactly where it's failing.

This test focuses specifically on the will creation API and related functionality
as requested in the review to identify blocking issues.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Backend URL from environment configuration
BACKEND_URL = "http://localhost:8001"

print(f"🔍 CRITICAL WILL CREATION DEBUG TEST")
print(f"Testing backend at: {BACKEND_URL}")
print("=" * 80)

class WillCreationDebugger:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        self.test_user_email = "will.debug.test@nexteraestate.com"
        self.test_user_id = None
        
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
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_1_api_endpoint_reachability(self):
        """Test 1: Is the API endpoint reachable?"""
        print("\n🔍 TEST 1: API Endpoint Reachability")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Health Check", True, f"Backend is reachable - Status: {data.get('status', 'unknown')}")
                return True
            else:
                self.log_result("API Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_2_user_creation_and_lookup(self):
        """Test 2: Is the user lookup working?"""
        print("\n🔍 TEST 2: User Creation and Lookup")
        
        # Step 2a: Create test user
        try:
            user_data = {
                "email": self.test_user_email,
                "name": "Will Debug Test User",
                "provider": "google"
            }
            response = self.session.post(
                f"{self.base_url}/api/users",
                json=user_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    self.test_user_id = data['id']
                    self.log_result("User Creation", True, f"User created with ID: {self.test_user_id}")
                else:
                    self.log_result("User Creation", False, "Invalid user response structure", data)
                    return False
            else:
                self.log_result("User Creation", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User Creation", False, f"Request error: {str(e)}")
            return False
        
        # Step 2b: Verify user lookup
        try:
            response = self.session.get(
                f"{self.base_url}/api/users?email={self.test_user_email}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and data['email'] == self.test_user_email:
                    self.log_result("User Lookup", True, f"User lookup successful - ID: {data.get('id', 'unknown')}")
                    return True
                else:
                    self.log_result("User Lookup", False, "User data mismatch", data)
                    return False
            else:
                self.log_result("User Lookup", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User Lookup", False, f"Request error: {str(e)}")
            return False
    
    def test_3_minimal_will_creation(self):
        """Test 3: Test with minimal will data (just basic info)"""
        print("\n🔍 TEST 3: Minimal Will Creation")
        
        minimal_will_data = {
            "state": "CA",
            "personal_info": {
                "full_name": "Will Debug Test User",
                "address": "123 Test St, San Francisco, CA 94102",
                "date_of_birth": "1990-01-01"
            },
            "beneficiaries": [],
            "assets": [],
            "witnesses": [],
            "executor": {}
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=minimal_will_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'completion_percentage' in data:
                    will_id = data['id']
                    completion = data['completion_percentage']
                    self.log_result("Minimal Will Creation", True, 
                                  f"Will created - ID: {will_id}, Completion: {completion}%")
                    return will_id
                else:
                    self.log_result("Minimal Will Creation", False, "Invalid will response structure", data)
                    return None
            else:
                self.log_result("Minimal Will Creation", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_result("Minimal Will Creation", False, f"Request error: {str(e)}")
            return None
    
    def test_4_complete_will_creation(self):
        """Test 4: Test with complete will data"""
        print("\n🔍 TEST 4: Complete Will Creation")
        
        complete_will_data = {
            "state": "CA",
            "personal_info": {
                "full_name": "John Test User",
                "address": "123 Test St, San Francisco, CA 94102",
                "date_of_birth": "1990-01-01",
                "phone": "555-123-4567",
                "email": self.test_user_email
            },
            "beneficiaries": [
                {
                    "name": "Jane Doe",
                    "relationship": "spouse",
                    "percentage": 100,
                    "address": "123 Test St, San Francisco, CA 94102"
                }
            ],
            "assets": [
                {
                    "type": "bank_account",
                    "description": "Checking Account at Bank of America",
                    "value": 10000,
                    "account_number": "****1234"
                },
                {
                    "type": "real_estate",
                    "description": "Primary Residence",
                    "value": 500000,
                    "address": "123 Test St, San Francisco, CA 94102"
                }
            ],
            "witnesses": [
                {
                    "name": "Witness One",
                    "address": "456 Witness St, San Francisco, CA 94103",
                    "phone": "555-111-2222"
                },
                {
                    "name": "Witness Two", 
                    "address": "789 Witness Ave, San Francisco, CA 94104",
                    "phone": "555-333-4444"
                }
            ],
            "executor": {
                "name": "Jane Doe",
                "address": "123 Test St, San Francisco, CA 94102",
                "phone": "555-555-5555",
                "relationship": "spouse"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=complete_will_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'completion_percentage' in data:
                    will_id = data['id']
                    completion = data['completion_percentage']
                    self.log_result("Complete Will Creation", True, 
                                  f"Will created - ID: {will_id}, Completion: {completion}%")
                    return will_id
                else:
                    self.log_result("Complete Will Creation", False, "Invalid will response structure", data)
                    return None
            else:
                self.log_result("Complete Will Creation", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_result("Complete Will Creation", False, f"Request error: {str(e)}")
            return None
    
    def test_5_database_persistence(self, will_id):
        """Test 5: Check if basic will structure is being saved"""
        print("\n🔍 TEST 5: Database Persistence Check")
        
        if not will_id:
            self.log_result("Database Persistence", False, "No will ID available for testing")
            return False
        
        try:
            # Test will retrieval by ID
            response = self.session.get(
                f"{self.base_url}/api/wills/{will_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['id'] == will_id:
                    self.log_result("Will Retrieval by ID", True, 
                                  f"Will retrieved successfully - State: {data.get('state', 'unknown')}")
                else:
                    self.log_result("Will Retrieval by ID", False, "Will ID mismatch", data)
                    return False
            else:
                self.log_result("Will Retrieval by ID", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Will Retrieval by ID", False, f"Request error: {str(e)}")
            return False
        
        try:
            # Test will retrieval by user email
            response = self.session.get(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    found_will = any(will['id'] == will_id for will in data)
                    if found_will:
                        self.log_result("Will Retrieval by User", True, 
                                      f"Will found in user's will list - Total wills: {len(data)}")
                        return True
                    else:
                        self.log_result("Will Retrieval by User", False, 
                                      f"Will not found in user's list - Total wills: {len(data)}")
                        return False
                else:
                    self.log_result("Will Retrieval by User", False, "No wills found for user", data)
                    return False
            else:
                self.log_result("Will Retrieval by User", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Will Retrieval by User", False, f"Request error: {str(e)}")
            return False
    
    def test_6_json_field_handling(self):
        """Test 6: Check JSON field handling in database"""
        print("\n🔍 TEST 6: JSON Field Handling")
        
        # Test with complex nested JSON data
        complex_will_data = {
            "state": "NY",
            "personal_info": {
                "full_name": "Complex JSON Test User",
                "address": "456 Complex St, New York, NY 10001",
                "date_of_birth": "1985-05-15",
                "additional_info": {
                    "middle_name": "JSON",
                    "suffix": "Jr.",
                    "occupation": "Software Developer",
                    "marital_status": "married"
                }
            },
            "beneficiaries": [
                {
                    "name": "Primary Beneficiary",
                    "relationship": "spouse",
                    "percentage": 60,
                    "contingent_beneficiaries": [
                        {"name": "Child 1", "percentage": 50},
                        {"name": "Child 2", "percentage": 50}
                    ]
                },
                {
                    "name": "Secondary Beneficiary",
                    "relationship": "sibling",
                    "percentage": 40,
                    "special_instructions": "Only if primary beneficiary is unavailable"
                }
            ],
            "assets": [
                {
                    "type": "investment_portfolio",
                    "description": "Stock Portfolio",
                    "value": 250000,
                    "details": {
                        "broker": "E*TRADE",
                        "account_type": "Individual",
                        "holdings": ["AAPL", "GOOGL", "MSFT"]
                    }
                }
            ],
            "witnesses": [],
            "executor": {}
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=complex_will_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data:
                    will_id = data['id']
                    
                    # Verify the complex data was stored correctly
                    verify_response = self.session.get(
                        f"{self.base_url}/api/wills/{will_id}",
                        timeout=10
                    )
                    
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        
                        # Check if nested JSON was preserved
                        personal_info = verify_data.get('personal_info', {})
                        beneficiaries = verify_data.get('beneficiaries', [])
                        
                        if (personal_info.get('additional_info', {}).get('middle_name') == 'JSON' and
                            len(beneficiaries) == 2 and
                            beneficiaries[0].get('contingent_beneficiaries') is not None):
                            
                            self.log_result("JSON Field Handling", True, 
                                          "Complex nested JSON data stored and retrieved correctly")
                            return True
                        else:
                            self.log_result("JSON Field Handling", False, 
                                          "Nested JSON data not preserved correctly")
                            return False
                    else:
                        self.log_result("JSON Field Handling", False, 
                                      f"Could not verify stored data - HTTP {verify_response.status_code}")
                        return False
                else:
                    self.log_result("JSON Field Handling", False, "No will ID in response", data)
                    return False
            else:
                self.log_result("JSON Field Handling", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("JSON Field Handling", False, f"Request error: {str(e)}")
            return False
    
    def test_7_pdf_generation(self, will_id):
        """Test 7: Test will PDF generation endpoint"""
        print("\n🔍 TEST 7: PDF Generation Test")
        
        if not will_id:
            self.log_result("PDF Generation", False, "No will ID available for PDF testing")
            return False
        
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/{will_id}/pdf",
                timeout=30  # PDF generation might take longer
            )
            
            if response.status_code == 200:
                # Check if response is actually PDF content
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' in content_type:
                    pdf_size = len(response.content)
                    self.log_result("PDF Generation", True, 
                                  f"PDF generated successfully - Size: {pdf_size} bytes")
                    return True
                else:
                    self.log_result("PDF Generation", False, 
                                  f"Response not PDF format - Content-Type: {content_type}")
                    return False
            else:
                self.log_result("PDF Generation", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("PDF Generation", False, f"Request error: {str(e)}")
            return False
    
    def test_8_error_analysis(self):
        """Test 8: Capture exact error messages from will creation attempts"""
        print("\n🔍 TEST 8: Error Analysis - Invalid Requests")
        
        # Test 8a: Missing required fields
        try:
            invalid_data = {
                "state": "CA"
                # Missing personal_info and other required fields
            }
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=invalid_data,
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_result("Error Handling - Missing Fields", True, 
                              "Missing fields correctly rejected with validation error")
            elif response.status_code == 500:
                error_data = response.json() if response.content else {}
                self.log_result("Error Handling - Missing Fields", False, 
                              f"Server error instead of validation error: {error_data}")
            else:
                self.log_result("Error Handling - Missing Fields", False, 
                              f"Unexpected status code: {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Missing Fields", False, f"Request error: {str(e)}")
        
        # Test 8b: Invalid user email
        try:
            valid_data = {
                "state": "CA",
                "personal_info": {"full_name": "Test User"},
                "beneficiaries": [],
                "assets": [],
                "witnesses": [],
                "executor": {}
            }
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email=nonexistent@example.com",
                json=valid_data,
                timeout=10
            )
            
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid User", True, 
                              "Invalid user email correctly rejected")
            else:
                error_data = response.json() if response.content else {}
                self.log_result("Error Handling - Invalid User", False, 
                              f"Expected 404, got {response.status_code}: {error_data}")
        except Exception as e:
            self.log_result("Error Handling - Invalid User", False, f"Request error: {str(e)}")
        
        # Test 8c: Invalid JSON
        try:
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                data="invalid json data",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 422:
                self.log_result("Error Handling - Invalid JSON", True, 
                              "Invalid JSON correctly rejected")
            else:
                self.log_result("Error Handling - Invalid JSON", False, 
                              f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid JSON", False, f"Request error: {str(e)}")
    
    def test_9_database_schema_compatibility(self):
        """Test 9: Verify database schema compatibility"""
        print("\n🔍 TEST 9: Database Schema Compatibility")
        
        # Test different user emails to check foreign key relationships
        test_users = [
            "schema.test1@nexteraestate.com",
            "schema.test2@nexteraestate.com"
        ]
        
        for user_email in test_users:
            try:
                # Create user
                user_data = {
                    "email": user_email,
                    "name": f"Schema Test User {user_email.split('@')[0]}",
                    "provider": "google"
                }
                user_response = self.session.post(
                    f"{self.base_url}/api/users",
                    json=user_data,
                    timeout=10
                )
                
                if user_response.status_code == 200:
                    user_data_response = user_response.json()
                    user_id = user_data_response.get('id')
                    
                    # Create will for this user
                    will_data = {
                        "state": "TX",
                        "personal_info": {"full_name": f"Schema Test {user_email}"},
                        "beneficiaries": [],
                        "assets": [],
                        "witnesses": [],
                        "executor": {}
                    }
                    
                    will_response = self.session.post(
                        f"{self.base_url}/api/wills?user_email={user_email}",
                        json=will_data,
                        timeout=10
                    )
                    
                    if will_response.status_code == 200:
                        will_data_response = will_response.json()
                        will_user_id = will_data_response.get('user_id')
                        
                        if will_user_id == user_id:
                            self.log_result(f"Schema Test - {user_email}", True, 
                                          f"User-Will relationship correct: {user_id}")
                        else:
                            self.log_result(f"Schema Test - {user_email}", False, 
                                          f"User ID mismatch: expected {user_id}, got {will_user_id}")
                    else:
                        self.log_result(f"Schema Test - {user_email}", False, 
                                      f"Will creation failed: HTTP {will_response.status_code}")
                else:
                    self.log_result(f"Schema Test - {user_email}", False, 
                                  f"User creation failed: HTTP {user_response.status_code}")
            except Exception as e:
                self.log_result(f"Schema Test - {user_email}", False, f"Request error: {str(e)}")
    
    def run_comprehensive_will_debug(self):
        """Run comprehensive will creation debug tests"""
        print("🔍 CRITICAL WILL CREATION DEBUG TEST")
        print("Debugging the core will creation workflow step-by-step...")
        print("=" * 80)
        
        # Test 1: API Reachability
        if not self.test_1_api_endpoint_reachability():
            print("\n❌ CRITICAL: Backend API is not reachable. Cannot proceed with will creation tests.")
            return False
        
        # Test 2: User Integration
        if not self.test_2_user_creation_and_lookup():
            print("\n❌ CRITICAL: User creation/lookup failed. Cannot proceed with will creation tests.")
            return False
        
        # Test 3: Minimal Will Creation
        minimal_will_id = self.test_3_minimal_will_creation()
        
        # Test 4: Complete Will Creation  
        complete_will_id = self.test_4_complete_will_creation()
        
        # Test 5: Database Persistence (use complete will if available, otherwise minimal)
        test_will_id = complete_will_id or minimal_will_id
        self.test_5_database_persistence(test_will_id)
        
        # Test 6: JSON Field Handling
        self.test_6_json_field_handling()
        
        # Test 7: PDF Generation
        self.test_7_pdf_generation(test_will_id)
        
        # Test 8: Error Analysis
        self.test_8_error_analysis()
        
        # Test 9: Database Schema Compatibility
        self.test_9_database_schema_compatibility()
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 WILL CREATION DEBUG SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Critical analysis
        critical_failures = []
        for result in self.results:
            if not result['success']:
                if any(keyword in result['test'] for keyword in ['Creation', 'Lookup', 'Persistence']):
                    critical_failures.append(result)
        
        if critical_failures:
            print(f"\n❌ CRITICAL FAILURES BLOCKING WILL CREATION:")
            for failure in critical_failures:
                print(f"   • {failure['test']}: {failure['details']}")
        
        if failed_tests == 0:
            print(f"\n✅ WILL CREATION WORKFLOW: FULLY OPERATIONAL")
            print("   All will creation tests passed successfully")
        elif len(critical_failures) == 0:
            print(f"\n⚠️  WILL CREATION WORKFLOW: MOSTLY OPERATIONAL")
            print("   Core functionality works, minor issues detected")
        else:
            print(f"\n❌ WILL CREATION WORKFLOW: CRITICAL ISSUES DETECTED")
            print("   Core will creation functionality is blocked")
        
        return len(critical_failures) == 0

def main():
    """Main test execution for will creation debugging"""
    debugger = WillCreationDebugger(BACKEND_URL)
    success = debugger.run_comprehensive_will_debug()
    
    # Save detailed results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f'/app/will_creation_debug_results_{timestamp}.json'
    
    with open(results_file, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': BACKEND_URL,
            'test_user_email': debugger.test_user_email,
            'total_tests': len(debugger.results),
            'passed_tests': sum(1 for r in debugger.results if r['success']),
            'failed_tests': sum(1 for r in debugger.results if not r['success']),
            'success_rate': (sum(1 for r in debugger.results if r['success']) / len(debugger.results)) * 100,
            'will_creation_operational': success,
            'test_results': debugger.results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {results_file}")
    
    if success:
        print("\n🎉 WILL CREATION DEBUG COMPLETE!")
        print("✅ Will creation workflow is operational!")
        sys.exit(0)
    else:
        print("\n⚠️  WILL CREATION DEBUG COMPLETE!")
        print("❌ Critical issues found in will creation workflow")
        sys.exit(1)

if __name__ == "__main__":
    main()
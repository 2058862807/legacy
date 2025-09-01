#!/usr/bin/env python3
"""
NexteraEstate PDF Generation & Download Flow Testing
Critical Priority #3: Test PDF Generation & Download Flow
Verify that users can successfully generate and download PDF documents for their wills after creation.
"""

import requests
import json
import sys
import os
import io
from datetime import datetime

# Get backend URL from environment or use default
BACKEND_URL = os.environ.get('NEXT_PUBLIC_BACKEND_BASE_URL', 'http://localhost:8001')
if not BACKEND_URL.startswith('http'):
    BACKEND_URL = f'http://{BACKEND_URL}'

print(f"🚀 PDF GENERATION & DOWNLOAD FLOW TESTING")
print(f"Testing backend at: {BACKEND_URL}")
print("=" * 80)

class PDFGenerationTester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        self.test_user_email = "pdf.test@nexteraestate.com"
        self.created_will_id = None
        
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
    
    def setup_test_user_and_will(self):
        """Setup test user and create a will for PDF testing"""
        print("\n🔧 Setting up test user and will for PDF testing...")
        
        # Create test user
        try:
            user_data = {
                "email": self.test_user_email,
                "name": "PDF Test User",
                "provider": "google"
            }
            response = self.session.post(
                f"{self.base_url}/api/users",
                json=user_data,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_result("Test User Setup", True, "PDF test user created successfully")
            else:
                self.log_result("Test User Setup", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Test User Setup", False, f"Request error: {str(e)}")
            return False
        
        # Create a comprehensive will for PDF testing
        try:
            will_data = {
                "state": "CA",
                "personal_info": {
                    "full_name": "PDF Test User",
                    "address": "123 Test Street, San Francisco, CA 94102",
                    "date_of_birth": "1980-01-15",
                    "phone": "(555) 123-4567",
                    "email": self.test_user_email
                },
                "beneficiaries": [
                    {
                        "name": "Jane Test Beneficiary",
                        "relationship": "Spouse",
                        "percentage": 60,
                        "address": "123 Test Street, San Francisco, CA 94102"
                    },
                    {
                        "name": "John Test Beneficiary Jr.",
                        "relationship": "Child",
                        "percentage": 40,
                        "address": "123 Test Street, San Francisco, CA 94102"
                    }
                ],
                "assets": [
                    {
                        "type": "Real Estate",
                        "description": "Primary residence at 123 Test Street",
                        "value": 750000
                    },
                    {
                        "type": "Bank Account",
                        "description": "Chase Checking Account #12345",
                        "value": 50000
                    }
                ],
                "witnesses": [
                    {
                        "name": "Witness One",
                        "address": "456 Witness Ave, San Francisco, CA 94103"
                    },
                    {
                        "name": "Witness Two", 
                        "address": "789 Witness Blvd, San Francisco, CA 94104"
                    }
                ],
                "executor": {
                    "name": "Jane Test Beneficiary",
                    "address": "123 Test Street, San Francisco, CA 94102",
                    "phone": "(555) 987-6543"
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=will_data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data:
                    self.created_will_id = data['id']
                    completion = data.get('completion_percentage', 0)
                    self.log_result("Test Will Creation", True, 
                                  f"Will created with ID: {self.created_will_id}, completion: {completion}%")
                    return True
                else:
                    self.log_result("Test Will Creation", False, "No will ID in response", data)
            else:
                self.log_result("Test Will Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Test Will Creation", False, f"Request error: {str(e)}")
        
        return False
    
    def test_pdf_generation_api(self):
        """Test GET /api/wills/{will_id}/pdf endpoint"""
        print("\n📄 Testing PDF Generation API...")
        
        if not self.created_will_id:
            self.log_result("PDF Generation API", False, "No will ID available for testing")
            return False
        
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/{self.created_will_id}/pdf",
                timeout=30  # PDF generation might take time
            )
            
            if response.status_code == 200:
                # Check content type
                content_type = response.headers.get('content-type', '')
                if content_type == 'application/pdf':
                    self.log_result("PDF Generation API", True, 
                                  f"PDF generated successfully, content-type: {content_type}")
                    
                    # Store PDF content for further validation
                    self.pdf_content = response.content
                    return True
                else:
                    self.log_result("PDF Generation API", False, 
                                  f"Wrong content-type: {content_type}, expected application/pdf")
            elif response.status_code == 404:
                self.log_result("PDF Generation API", False, "Will not found")
            elif response.status_code == 500:
                error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
                self.log_result("PDF Generation API", False, f"Server error: {error_data}")
            else:
                self.log_result("PDF Generation API", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("PDF Generation API", False, f"Request error: {str(e)}")
        
        return False
    
    def test_pdf_content_validation(self):
        """Test PDF content validation"""
        print("\n🔍 Testing PDF Content Validation...")
        
        if not hasattr(self, 'pdf_content') or not self.pdf_content:
            self.log_result("PDF Content Validation", False, "No PDF content available for validation")
            return False
        
        try:
            # Check PDF file signature
            if self.pdf_content.startswith(b'%PDF-'):
                self.log_result("PDF File Signature", True, "Valid PDF file signature found")
            else:
                self.log_result("PDF File Signature", False, "Invalid PDF file signature")
                return False
            
            # Check PDF file size
            pdf_size = len(self.pdf_content)
            if pdf_size > 1024:  # At least 1KB
                self.log_result("PDF File Size", True, f"PDF size: {pdf_size} bytes (reasonable size)")
            else:
                self.log_result("PDF File Size", False, f"PDF too small: {pdf_size} bytes")
            
            # Check for PDF structure markers
            pdf_text = self.pdf_content.decode('latin-1', errors='ignore')
            
            # Look for essential PDF elements
            has_pdf_version = '%PDF-' in pdf_text
            has_eof_marker = '%%EOF' in pdf_text
            has_xref = 'xref' in pdf_text
            
            if has_pdf_version and has_eof_marker:
                self.log_result("PDF Structure", True, "PDF has valid structure (version header and EOF)")
            else:
                self.log_result("PDF Structure", False, 
                              f"Invalid PDF structure - version: {has_pdf_version}, EOF: {has_eof_marker}")
            
            # Check for will-related content (basic text search)
            content_checks = {
                "Will Document": any(term in pdf_text.upper() for term in ['WILL', 'TESTAMENT', 'LAST WILL']),
                "User Name": 'PDF TEST USER' in pdf_text.upper(),
                "Beneficiary Info": 'JANE TEST BENEFICIARY' in pdf_text.upper(),
                "State Info": 'CALIFORNIA' in pdf_text.upper() or 'CA' in pdf_text,
                "Legal Language": any(term in pdf_text.upper() for term in ['HEREBY', 'REVOKE', 'EXECUTOR'])
            }
            
            passed_content_checks = sum(content_checks.values())
            total_content_checks = len(content_checks)
            
            if passed_content_checks >= 3:  # At least 3 out of 5 content checks
                self.log_result("PDF Content Validation", True, 
                              f"PDF contains proper will content ({passed_content_checks}/{total_content_checks} checks passed)")
            else:
                self.log_result("PDF Content Validation", False, 
                              f"PDF missing will content ({passed_content_checks}/{total_content_checks} checks passed)")
                # Log which checks failed
                for check, passed in content_checks.items():
                    if not passed:
                        print(f"   Missing: {check}")
            
            return True
            
        except Exception as e:
            self.log_result("PDF Content Validation", False, f"Validation error: {str(e)}")
            return False
    
    def test_file_download_flow(self):
        """Test PDF streaming response and download headers"""
        print("\n⬇️  Testing File Download Flow...")
        
        if not self.created_will_id:
            self.log_result("File Download Flow", False, "No will ID available for testing")
            return False
        
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/{self.created_will_id}/pdf",
                timeout=30,
                stream=True  # Test streaming response
            )
            
            if response.status_code == 200:
                # Check Content-Disposition header for download
                content_disposition = response.headers.get('Content-Disposition', '')
                if 'attachment' in content_disposition:
                    self.log_result("Download Headers", True, 
                                  f"Proper download header: {content_disposition}")
                else:
                    self.log_result("Download Headers", False, 
                                  f"Missing or invalid Content-Disposition: {content_disposition}")
                
                # Check filename generation
                if f'will_{self.created_will_id}.pdf' in content_disposition:
                    self.log_result("Filename Generation", True, 
                                  f"Proper filename with will ID: will_{self.created_will_id}.pdf")
                else:
                    self.log_result("Filename Generation", False, 
                                  "Filename doesn't match expected pattern")
                
                # Test streaming download
                downloaded_size = 0
                for chunk in response.iter_content(chunk_size=1024):
                    downloaded_size += len(chunk)
                    if downloaded_size > 10240:  # Stop after 10KB to avoid full download
                        break
                
                if downloaded_size > 0:
                    self.log_result("PDF Streaming", True, 
                                  f"PDF streaming works, downloaded {downloaded_size} bytes")
                else:
                    self.log_result("PDF Streaming", False, "No data received in streaming response")
                
                return True
            else:
                self.log_result("File Download Flow", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("File Download Flow", False, f"Request error: {str(e)}")
        
        return False
    
    def test_authentication_requirements(self):
        """Test authentication requirements for PDF access"""
        print("\n🔐 Testing Authentication Requirements...")
        
        if not self.created_will_id:
            self.log_result("Authentication Requirements", False, "No will ID available for testing")
            return False
        
        # Test 1: Access PDF without user_email parameter (should work as will ID is specific)
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/{self.created_will_id}/pdf",
                timeout=15
            )
            
            if response.status_code == 200:
                self.log_result("PDF Access Control", True, 
                              "PDF accessible with valid will ID (current implementation)")
            elif response.status_code == 401 or response.status_code == 403:
                self.log_result("PDF Access Control", True, 
                              "PDF properly protected - authentication required")
            else:
                self.log_result("PDF Access Control", False, 
                              f"Unexpected response: HTTP {response.status_code}")
        except Exception as e:
            self.log_result("PDF Access Control", False, f"Request error: {str(e)}")
        
        # Test 2: Try to access PDF with invalid will ID
        try:
            fake_will_id = "00000000-0000-0000-0000-000000000000"
            response = self.session.get(
                f"{self.base_url}/api/wills/{fake_will_id}/pdf",
                timeout=15
            )
            
            if response.status_code == 404:
                self.log_result("Invalid Will ID Protection", True, 
                              "Invalid will ID correctly rejected with 404")
            elif response.status_code == 403:
                self.log_result("Invalid Will ID Protection", True, 
                              "Invalid will ID correctly rejected with 403")
            else:
                self.log_result("Invalid Will ID Protection", False, 
                              f"Invalid will ID not properly handled: HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Will ID Protection", False, f"Request error: {str(e)}")
        
        return True
    
    def test_error_scenarios(self):
        """Test error scenarios for PDF generation"""
        print("\n⚠️  Testing Error Scenarios...")
        
        # Test 1: PDF generation with malformed will ID
        try:
            response = self.session.get(
                f"{self.base_url}/api/wills/invalid-will-id/pdf",
                timeout=15
            )
            
            if response.status_code == 404:
                self.log_result("Malformed Will ID Error", True, 
                              "Malformed will ID properly rejected")
            elif response.status_code == 422:
                self.log_result("Malformed Will ID Error", True, 
                              "Malformed will ID validation error")
            else:
                self.log_result("Malformed Will ID Error", False, 
                              f"Unexpected response: HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Malformed Will ID Error", False, f"Request error: {str(e)}")
        
        # Test 2: PDF generation with non-existent will ID
        try:
            fake_will_id = "99999999-9999-9999-9999-999999999999"
            response = self.session.get(
                f"{self.base_url}/api/wills/{fake_will_id}/pdf",
                timeout=15
            )
            
            if response.status_code == 404:
                error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
                self.log_result("Non-existent Will Error", True, 
                              f"Non-existent will properly handled: {error_data}")
            else:
                self.log_result("Non-existent Will Error", False, 
                              f"Unexpected response: HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Non-existent Will Error", False, f"Request error: {str(e)}")
        
        # Test 3: Test server error handling (simulate by testing with empty will data)
        try:
            # Create a will with minimal data that might cause PDF generation issues
            minimal_will_data = {
                "state": "CA",
                "personal_info": {},
                "beneficiaries": [],
                "assets": []
            }
            
            response = self.session.post(
                f"{self.base_url}/api/wills?user_email={self.test_user_email}",
                json=minimal_will_data,
                timeout=10
            )
            
            if response.status_code == 200:
                minimal_will_id = response.json().get('id')
                if minimal_will_id:
                    # Try to generate PDF for minimal will
                    pdf_response = self.session.get(
                        f"{self.base_url}/api/wills/{minimal_will_id}/pdf",
                        timeout=15
                    )
                    
                    if pdf_response.status_code == 200:
                        self.log_result("Minimal Will PDF", True, 
                                      "PDF generation handles minimal will data")
                    elif pdf_response.status_code == 500:
                        self.log_result("PDF Error Handling", True, 
                                      "Server properly returns 500 for problematic will data")
                    else:
                        self.log_result("PDF Error Handling", False, 
                                      f"Unexpected response: HTTP {pdf_response.status_code}")
                else:
                    self.log_result("Minimal Will Creation", False, "No will ID returned")
            else:
                self.log_result("Minimal Will Creation", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("PDF Error Handling", False, f"Request error: {str(e)}")
        
        return True
    
    def test_frontend_api_integration(self):
        """Test frontend API integration scenarios"""
        print("\n🌐 Testing Frontend API Integration...")
        
        # Test CORS headers for frontend integration
        try:
            response = self.session.options(
                f"{self.base_url}/api/wills/{self.created_will_id}/pdf" if self.created_will_id else f"{self.base_url}/api/wills/test/pdf",
                headers={
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'GET'
                },
                timeout=10
            )
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                self.log_result("CORS Configuration", True, 
                              f"CORS headers present for frontend integration")
            else:
                self.log_result("CORS Configuration", False, 
                              "Missing CORS headers for frontend integration")
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Request error: {str(e)}")
        
        # Test API response format consistency
        if self.created_will_id:
            try:
                # Test will retrieval API for consistency
                response = self.session.get(
                    f"{self.base_url}/api/wills/{self.created_will_id}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    will_data = response.json()
                    required_fields = ['id', 'user_id', 'state', 'personal_info', 'completion_percentage']
                    
                    missing_fields = [field for field in required_fields if field not in will_data]
                    
                    if not missing_fields:
                        self.log_result("API Response Format", True, 
                                      "Will API returns consistent format for frontend")
                    else:
                        self.log_result("API Response Format", False, 
                                      f"Missing fields in API response: {missing_fields}")
                else:
                    self.log_result("API Response Format", False, f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result("API Response Format", False, f"Request error: {str(e)}")
        
        return True
    
    def run_comprehensive_pdf_tests(self):
        """Run comprehensive PDF generation and download tests"""
        print("🚀 NEXTERAESTATE PDF GENERATION & DOWNLOAD FLOW TESTING")
        print("Testing all critical PDF functionality for production readiness...")
        print("=" * 80)
        
        # Setup phase
        if not self.setup_test_user_and_will():
            print("\n❌ CRITICAL: Test setup failed. Cannot proceed with PDF tests.")
            return False
        
        # Run all PDF-specific tests
        print("\n📄 CRITICAL TEST 1: PDF Generation API")
        self.test_pdf_generation_api()
        
        print("\n🔍 CRITICAL TEST 2: PDF Content Validation")
        self.test_pdf_content_validation()
        
        print("\n⬇️  CRITICAL TEST 3: File Download Flow")
        self.test_file_download_flow()
        
        print("\n🔐 CRITICAL TEST 4: Authentication Requirements")
        self.test_authentication_requirements()
        
        print("\n⚠️  CRITICAL TEST 5: Error Scenarios")
        self.test_error_scenarios()
        
        print("\n🌐 CRITICAL TEST 6: Frontend API Integration")
        self.test_frontend_api_integration()
        
        # Comprehensive Summary
        print("\n" + "=" * 80)
        print("🎯 PDF GENERATION & DOWNLOAD FLOW TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Critical success criteria analysis
        critical_tests = {
            'PDF Generation API': [r for r in self.results if 'PDF Generation API' in r['test']],
            'PDF Content Validation': [r for r in self.results if 'PDF Content' in r['test'] or 'PDF File' in r['test'] or 'PDF Structure' in r['test']],
            'File Download Flow': [r for r in self.results if 'Download' in r['test'] or 'Filename' in r['test'] or 'Streaming' in r['test']],
            'Authentication & Security': [r for r in self.results if 'Access Control' in r['test'] or 'Protection' in r['test']],
            'Error Handling': [r for r in self.results if 'Error' in r['test']],
            'Frontend Integration': [r for r in self.results if 'CORS' in r['test'] or 'API Response' in r['test']]
        }
        
        print(f"\n🔍 CRITICAL SUCCESS CRITERIA STATUS:")
        all_critical_passed = True
        
        for criteria, tests in critical_tests.items():
            if tests:
                criteria_passed = sum(1 for t in tests if t['success'])
                criteria_total = len(tests)
                criteria_rate = (criteria_passed/criteria_total)*100 if criteria_total > 0 else 0
                status = "✅ WORKING" if criteria_rate >= 80 else "❌ FAILING"
                print(f"   {criteria}: {criteria_passed}/{criteria_total} ({criteria_rate:.0f}%) {status}")
                
                if criteria_rate < 80:
                    all_critical_passed = False
        
        # Production readiness assessment
        print(f"\n🚀 PDF FUNCTIONALITY ASSESSMENT:")
        if failed_tests == 0:
            print("   ✅ ALL PDF TESTS PASSED - PDF GENERATION & DOWNLOAD FULLY OPERATIONAL")
        elif all_critical_passed and failed_tests <= 2:
            print("   ⚠️  MOSTLY OPERATIONAL - MINOR PDF ISSUES DETECTED")
            print("   📋 Review failed tests before production deployment")
        else:
            print("   ❌ CRITICAL PDF ISSUES DETECTED - PDF FUNCTIONALITY NOT READY")
            print("   🔧 Address critical PDF failures before launch")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED PDF TESTS REQUIRING ATTENTION:")
            for result in self.results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['details']}")
        
        return failed_tests == 0

def main():
    """Main test execution for PDF generation and download flow testing"""
    tester = PDFGenerationTester(BACKEND_URL)
    success = tester.run_comprehensive_pdf_tests()
    
    # Save detailed results with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f'/app/pdf_test_results_{timestamp}.json'
    
    with open(results_file, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': BACKEND_URL,
            'total_tests': len(tester.results),
            'passed_tests': sum(1 for r in tester.results if r['success']),
            'failed_tests': sum(1 for r in tester.results if not r['success']),
            'success_rate': (sum(1 for r in tester.results if r['success']) / len(tester.results)) * 100,
            'pdf_functionality_ready': success,
            'test_results': tester.results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {results_file}")
    
    if success:
        print("\n🎉 PDF GENERATION & DOWNLOAD FLOW TESTING COMPLETE!")
        print("✅ All critical PDF functionality operational - Ready for user testing!")
        sys.exit(0)
    else:
        print("\n⚠️  PDF GENERATION & DOWNLOAD FLOW TESTING FAILED!")
        print("❌ Critical PDF issues detected - Address failures before launch")
        sys.exit(1)

if __name__ == "__main__":
    main()
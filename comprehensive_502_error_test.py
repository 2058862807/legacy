#!/usr/bin/env python3
"""
NexteraEstate Backend 502 Error Investigation & Comprehensive API Testing
Focus: Identifying 502 errors, connection issues, and API endpoint failures
User Issue: "502 errors" and "unable to fetch" issues need to be resolved
"""

import requests
import json
import sys
import os
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# Backend URL from environment
BACKEND_URL = "http://localhost:8001"

print(f"🔍 NexteraEstate 502 Error Investigation & API Testing")
print(f"Backend URL: {BACKEND_URL}")
print(f"Focus: Identifying 502 errors, connection issues, and endpoint failures")
print("=" * 80)

class ComprehensiveAPITester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = []
        self.error_502_count = 0
        self.connection_error_count = 0
        self.total_tests = 0
        
    def log_result(self, test_name, success, details="", response_data=None, status_code=None):
        """Log test result with special attention to 502 errors"""
        self.total_tests += 1
        
        if status_code == 502:
            self.error_502_count += 1
            status = "🚨 502 ERROR"
        elif "connection" in details.lower() or "unable to fetch" in details.lower():
            self.connection_error_count += 1
            status = "🔌 CONNECTION ERROR"
        elif success:
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
            
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'status_code': status_code,
            'response_data': response_data,
            'timestamp': datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status} {test_name}: {details}")
        
        if status_code == 502 or not success:
            print(f"   Status Code: {status_code}")
            if response_data:
                print(f"   Response: {str(response_data)[:200]}...")
    
    def test_endpoint(self, method, endpoint, data=None, params=None, timeout=10, test_name=None):
        """Generic endpoint tester with 502 error detection"""
        if not test_name:
            test_name = f"{method.upper()} {endpoint}"
            
        try:
            url = f"{self.base_url}{endpoint}"
            
            if method.upper() == 'GET':
                response = self.session.get(url, params=params, timeout=timeout)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, params=params, timeout=timeout)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, params=params, timeout=timeout)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, params=params, timeout=timeout)
            else:
                self.log_result(test_name, False, f"Unsupported method: {method}")
                return False
            
            # Check for 502 errors specifically
            if response.status_code == 502:
                self.log_result(test_name, False, "Bad Gateway - Backend server error", 
                              response.text, response.status_code)
                return False
            elif response.status_code >= 500:
                self.log_result(test_name, False, f"Server error: {response.status_code}", 
                              response.text, response.status_code)
                return False
            elif response.status_code >= 400:
                # 4xx errors might be expected for some tests
                try:
                    error_data = response.json()
                    self.log_result(test_name, False, f"Client error: {response.status_code}", 
                                  error_data, response.status_code)
                except:
                    self.log_result(test_name, False, f"Client error: {response.status_code}", 
                                  response.text, response.status_code)
                return False
            else:
                # Success response
                try:
                    response_data = response.json()
                    self.log_result(test_name, True, f"Success: {response.status_code}", 
                                  response_data, response.status_code)
                    return True
                except:
                    # Non-JSON response (like PDF)
                    self.log_result(test_name, True, f"Success: {response.status_code} (non-JSON)", 
                                  f"Content-Type: {response.headers.get('content-type', 'unknown')}", 
                                  response.status_code)
                    return True
                    
        except requests.exceptions.ConnectionError as e:
            self.connection_error_count += 1
            self.log_result(test_name, False, f"Connection error: {str(e)}")
            return False
        except requests.exceptions.Timeout as e:
            self.log_result(test_name, False, f"Timeout error: {str(e)}")
            return False
        except Exception as e:
            self.log_result(test_name, False, f"Request error: {str(e)}")
            return False

    def test_core_health_endpoints(self):
        """Test core health and status endpoints"""
        print("\n🏥 Testing Core Health & Status Endpoints...")
        
        endpoints = [
            ("GET", "/api/health", None, None, "Health Check"),
            ("GET", "/api/ai-team/status", None, None, "AI Team Status"),
            ("GET", "/api/autolex/status", None, None, "AutoLex Status"),
            ("GET", "/api/rag/status", None, None, "RAG System Status"),
        ]
        
        for method, endpoint, data, params, name in endpoints:
            self.test_endpoint(method, endpoint, data, params, test_name=name)

    def test_authentication_endpoints(self):
        """Test authentication and user management endpoints"""
        print("\n👤 Testing Authentication & User Management...")
        
        # Test NextAuth compatibility endpoints
        self.test_endpoint("GET", "/api/auth/session", test_name="NextAuth Session")
        self.test_endpoint("GET", "/api/auth/providers", test_name="NextAuth Providers")
        
        # Test user management
        test_user_data = {
            "email": "test.502@nexteraestate.com",
            "name": "502 Test User",
            "provider": "google"
        }
        
        self.test_endpoint("POST", "/api/users", test_user_data, test_name="User Creation")
        self.test_endpoint("GET", "/api/users", params={"email": "test.502@nexteraestate.com"}, 
                          test_name="User Retrieval")
        self.test_endpoint("GET", "/api/user/dashboard-stats", 
                          params={"user_email": "test.502@nexteraestate.com"}, 
                          test_name="Dashboard Stats")

    def test_ai_bot_endpoints(self):
        """Test AI bot endpoints that might be causing 502 errors"""
        print("\n🤖 Testing AI Bot Endpoints...")
        
        test_user_email = "bot.test.502@nexteraestate.com"
        
        # Create user first
        user_data = {
            "email": test_user_email,
            "name": "Bot Test User",
            "provider": "google"
        }
        self.test_endpoint("POST", "/api/users", user_data, test_name="Bot Test User Creation")
        
        # Test help bot
        help_data = {
            "message": "What are the requirements for creating a will in California?",
            "user_email": test_user_email
        }
        self.test_endpoint("POST", "/api/bot/help", help_data, 
                          params={"user_email": test_user_email}, test_name="Help Bot")
        
        # Test grief bot
        grief_data = {
            "message": "I need help dealing with estate matters after a loss",
            "user_email": test_user_email
        }
        self.test_endpoint("POST", "/api/bot/grief", grief_data, 
                          params={"user_email": test_user_email}, test_name="Grief Bot")

    def test_ai_team_communication(self):
        """Test AI team communication system"""
        print("\n🧠 Testing AI Team Communication System...")
        
        # Test AI team integration
        test_data = {
            "message": "Test AI team integration",
            "user_email": "ai.team.test@nexteraestate.com"
        }
        self.test_endpoint("POST", "/api/ai-team/test", test_data, test_name="AI Team Integration Test")
        
        # Test RAG legal analysis
        rag_data = {
            "message": "What are the legal requirements for will execution?",
            "context": "estate_planning"
        }
        self.test_endpoint("POST", "/api/rag/legal-analysis", rag_data, 
                          params={"user_email": "rag.test@nexteraestate.com"}, 
                          test_name="RAG Legal Analysis")

    def test_payment_endpoints(self):
        """Test payment processing endpoints"""
        print("\n💳 Testing Payment Processing Endpoints...")
        
        # Test checkout creation for all plans
        plans = ["core", "plus", "pro", "enterprise"]
        
        for plan in plans:
            checkout_data = {
                "plan": plan,
                "billing_period": "monthly"
            }
            self.test_endpoint("POST", "/api/payments/create-checkout", checkout_data, 
                              test_name=f"Stripe Checkout - {plan.title()}")
        
        # Test payment status
        self.test_endpoint("GET", "/api/payments/status", 
                          params={"session_id": "test_session_id"}, 
                          test_name="Payment Status")

    def test_compliance_endpoints(self):
        """Test compliance system endpoints"""
        print("\n📋 Testing Compliance System Endpoints...")
        
        # Test compliance rules for different states
        states = ["CA", "NY", "TX", "FL", "WA"]
        
        for state in states:
            self.test_endpoint("GET", "/api/compliance/rules", 
                              params={"state": state, "doc_type": "will"}, 
                              test_name=f"Compliance Rules - {state}")
        
        # Test compliance summary
        self.test_endpoint("GET", "/api/compliance/summary", test_name="Compliance Summary")

    def test_will_creation_endpoints(self):
        """Test will creation and management endpoints"""
        print("\n📄 Testing Will Creation & Management...")
        
        test_user_email = "will.test.502@nexteraestate.com"
        
        # Create user first
        user_data = {
            "email": test_user_email,
            "name": "Will Test User",
            "provider": "google"
        }
        self.test_endpoint("POST", "/api/users", user_data, test_name="Will Test User Creation")
        
        # Test will creation
        will_data = {
            "state": "CA",
            "personal_info": {
                "full_name": "Will Test User",
                "address": "123 Test St, San Francisco, CA 94102"
            },
            "beneficiaries": [],
            "assets": [],
            "witnesses": [],
            "executor": {}
        }
        
        success = self.test_endpoint("POST", "/api/wills", will_data, 
                                   params={"user_email": test_user_email}, 
                                   test_name="Will Creation")
        
        # Test will retrieval
        self.test_endpoint("GET", "/api/wills", 
                          params={"user_email": test_user_email}, 
                          test_name="Will Retrieval")

    def test_document_endpoints(self):
        """Test document management endpoints"""
        print("\n📁 Testing Document Management...")
        
        test_user_email = "doc.test.502@nexteraestate.com"
        
        # Create user first
        user_data = {
            "email": test_user_email,
            "name": "Document Test User",
            "provider": "google"
        }
        self.test_endpoint("POST", "/api/users", user_data, test_name="Document Test User Creation")
        
        # Test document listing
        self.test_endpoint("GET", "/api/documents/list", 
                          params={"user_email": test_user_email}, 
                          test_name="Document Listing")

    def test_pdf_generation_endpoints(self):
        """Test PDF generation endpoints"""
        print("\n📄 Testing PDF Generation...")
        
        # Test pet trust PDF generation
        pet_trust_data = {
            "pets": [{"name": "Buddy", "type": "Dog", "breed": "Golden Retriever", "age": 5}],
            "trust_amount": 10000,
            "primary_caretaker": "Jane Doe",
            "backup_caretaker": "John Smith"
        }
        
        self.test_endpoint("POST", "/api/pet-trust/pdf", pet_trust_data, 
                          params={"user_email": "pdf.test@nexteraestate.com"}, 
                          test_name="Pet Trust PDF Generation")

    def test_blockchain_endpoints(self):
        """Test blockchain notarization endpoints"""
        print("\n⛓️ Testing Blockchain Notarization...")
        
        # Test hash generation
        hash_data = {"content": "Test document for blockchain notarization"}
        success = self.test_endpoint("POST", "/api/notary/hash", hash_data, 
                                   test_name="Blockchain Hash Generation")
        
        # Test notarization
        notary_data = {
            "document_hash": "a" * 64,  # Valid 64-char hex hash
            "user_address": "0x1234567890123456789012345678901234567890"
        }
        self.test_endpoint("POST", "/api/notary/create", notary_data, 
                          test_name="Blockchain Notarization")
        
        # Test status check
        self.test_endpoint("GET", "/api/notary/status", 
                          params={"tx_hash": "test_tx_hash"}, 
                          test_name="Notary Status Check")
        
        # Test gasless notarization endpoints
        self.test_endpoint("GET", "/api/notary/pricing", 
                          params={"document_type": "will"}, 
                          test_name="Gasless Notary Pricing")
        
        self.test_endpoint("GET", "/api/notary/wallet-status", 
                          test_name="Gasless Wallet Status")

    def test_live_estate_endpoints(self):
        """Test Live Estate Plan MVP endpoints"""
        print("\n🏠 Testing Live Estate Plan MVP...")
        
        test_user_email = "live.estate.502@nexteraestate.com"
        
        # Create user first
        user_data = {
            "email": test_user_email,
            "name": "Live Estate Test User",
            "provider": "google"
        }
        self.test_endpoint("POST", "/api/users", user_data, test_name="Live Estate User Creation")
        
        # Test live status
        self.test_endpoint("GET", "/api/live/status", 
                          params={"user_email": test_user_email}, 
                          test_name="Live Estate Status")
        
        # Test life event recording
        event_data = {
            "event_type": "marriage",
            "event_data": {
                "spouse_name": "Jane Smith",
                "marriage_date": "2024-06-15",
                "new_state": "CA"
            }
        }
        self.test_endpoint("POST", "/api/live/event", event_data, 
                          params={"user_email": test_user_email}, 
                          test_name="Life Event Recording")
        
        # Test proposal generation
        self.test_endpoint("POST", "/api/live/propose", {}, 
                          params={"user_email": test_user_email}, 
                          test_name="AI Proposal Generation")

    def test_concurrent_requests(self):
        """Test concurrent requests to identify connection issues"""
        print("\n🔄 Testing Concurrent Requests (Connection Stress Test)...")
        
        def make_health_request():
            try:
                response = self.session.get(f"{self.base_url}/api/health", timeout=5)
                return response.status_code == 200
            except:
                return False
        
        # Test 10 concurrent requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_health_request) for _ in range(10)]
            results = [future.result() for future in as_completed(futures)]
        
        success_count = sum(results)
        total_count = len(results)
        
        if success_count == total_count:
            self.log_result("Concurrent Requests", True, 
                          f"All {total_count} concurrent requests successful")
        else:
            self.log_result("Concurrent Requests", False, 
                          f"Only {success_count}/{total_count} concurrent requests successful")

    def run_comprehensive_test(self):
        """Run all tests and generate comprehensive report"""
        print("🚀 Starting Comprehensive 502 Error Investigation...")
        start_time = time.time()
        
        # Run all test categories
        self.test_core_health_endpoints()
        self.test_authentication_endpoints()
        self.test_ai_bot_endpoints()
        self.test_ai_team_communication()
        self.test_payment_endpoints()
        self.test_compliance_endpoints()
        self.test_will_creation_endpoints()
        self.test_document_endpoints()
        self.test_pdf_generation_endpoints()
        self.test_blockchain_endpoints()
        self.test_live_estate_endpoints()
        self.test_concurrent_requests()
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Generate summary report
        self.generate_summary_report(duration)
        
        return self.results

    def generate_summary_report(self, duration):
        """Generate comprehensive summary report"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE 502 ERROR INVESTIGATION REPORT")
        print("=" * 80)
        
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = self.total_tests - passed_tests
        success_rate = (passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        
        print(f"🔍 Total Tests Executed: {self.total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        print(f"⏱️ Test Duration: {duration:.2f} seconds")
        print()
        
        # 502 Error Analysis
        print("🚨 502 ERROR ANALYSIS:")
        if self.error_502_count == 0:
            print("✅ No 502 Bad Gateway errors detected!")
        else:
            print(f"❌ Found {self.error_502_count} 502 Bad Gateway errors")
            print("   These indicate backend server issues or proxy problems")
        print()
        
        # Connection Error Analysis
        print("🔌 CONNECTION ERROR ANALYSIS:")
        if self.connection_error_count == 0:
            print("✅ No connection errors detected!")
        else:
            print(f"❌ Found {self.connection_error_count} connection errors")
            print("   These indicate network connectivity or service availability issues")
        print()
        
        # Failed Endpoints Summary
        failed_endpoints = [r for r in self.results if not r['success']]
        if failed_endpoints:
            print("❌ FAILED ENDPOINTS:")
            for result in failed_endpoints:
                status_code = result.get('status_code', 'Unknown')
                print(f"   • {result['test']}: {result['details']} (Status: {status_code})")
        else:
            print("✅ All endpoints are working correctly!")
        print()
        
        # Critical Issues Summary
        critical_issues = []
        
        if self.error_502_count > 0:
            critical_issues.append(f"502 Bad Gateway errors ({self.error_502_count} occurrences)")
        
        if self.connection_error_count > 0:
            critical_issues.append(f"Connection errors ({self.connection_error_count} occurrences)")
        
        if success_rate < 80:
            critical_issues.append(f"Low success rate ({success_rate:.1f}%)")
        
        if critical_issues:
            print("🚨 CRITICAL ISSUES IDENTIFIED:")
            for issue in critical_issues:
                print(f"   • {issue}")
            print("\n🔧 RECOMMENDED ACTIONS:")
            print("   1. Check backend service status (supervisorctl status)")
            print("   2. Verify backend is running on port 8001")
            print("   3. Check backend logs for errors")
            print("   4. Verify database connectivity")
            print("   5. Check network configuration and firewall settings")
        else:
            print("✅ NO CRITICAL ISSUES DETECTED")
            print("   Backend appears to be functioning correctly")
        
        print("\n" + "=" * 80)

def main():
    """Main execution function"""
    tester = ComprehensiveAPITester(BACKEND_URL)
    
    try:
        results = tester.run_comprehensive_test()
        
        # Save results to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"502_error_investigation_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'backend_url': BACKEND_URL,
                'total_tests': tester.total_tests,
                'error_502_count': tester.error_502_count,
                'connection_error_count': tester.connection_error_count,
                'results': results
            }, f, indent=2)
        
        print(f"📄 Detailed results saved to: {filename}")
        
        # Return exit code based on critical issues
        if tester.error_502_count > 0 or tester.connection_error_count > 0:
            print("\n🚨 CRITICAL ISSUES DETECTED - Investigation required")
            return 1
        else:
            print("\n✅ NO CRITICAL ISSUES - Backend appears healthy")
            return 0
            
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
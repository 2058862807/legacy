#!/usr/bin/env python3
"""
Critical API Endpoints Testing - Production 502 Error Fix Verification
Testing the newly added endpoints that were missing and causing 502 errors in production.

CRITICAL ENDPOINTS TO TEST:
1. GET /list?user_email=test@example.com (should return {"documents": []})
2. GET /v1/list?user_email=test@example.com (should return {"documents": []}) 
3. GET /api/list?user_email=test@example.com (should return {"documents": []})
4. GET /api/v1/list?user_email=test@example.com (should return {"documents": []})
5. GET /api/test (should return status ok message)
"""

import requests
import json
import time
from datetime import datetime
import sys
import os

# Backend URL configuration (matching frontend logic)
BACKEND_BASE_URL = "http://localhost:8001"

class CriticalEndpointTester:
    def __init__(self):
        self.results = {
            "test_summary": {
                "total_tests": 0,
                "passed": 0,
                "failed": 0,
                "success_rate": 0.0,
                "test_date": datetime.now().isoformat()
            },
            "endpoint_tests": [],
            "critical_issues": [],
            "recommendations": []
        }
        
    def log_result(self, endpoint, method, expected_status, actual_status, response_data, success, error_msg=None):
        """Log test result"""
        result = {
            "endpoint": endpoint,
            "method": method,
            "expected_status": expected_status,
            "actual_status": actual_status,
            "response_data": response_data,
            "success": success,
            "error_message": error_msg,
            "timestamp": datetime.now().isoformat()
        }
        
        self.results["endpoint_tests"].append(result)
        self.results["test_summary"]["total_tests"] += 1
        
        if success:
            self.results["test_summary"]["passed"] += 1
            print(f"✅ {method} {endpoint} - Status: {actual_status}")
        else:
            self.results["test_summary"]["failed"] += 1
            print(f"❌ {method} {endpoint} - Status: {actual_status} - Error: {error_msg}")
            
            # Add to critical issues if it's a 502 or 404 error
            if actual_status in [502, 404]:
                self.results["critical_issues"].append({
                    "endpoint": endpoint,
                    "status": actual_status,
                    "error": error_msg,
                    "severity": "CRITICAL" if actual_status == 502 else "HIGH"
                })
    
    def test_endpoint(self, endpoint, method="GET", expected_status=200, params=None, data=None):
        """Test a single endpoint"""
        url = f"{BACKEND_BASE_URL}{endpoint}"
        
        try:
            print(f"\n🔍 Testing {method} {endpoint}")
            
            if method == "GET":
                response = requests.get(url, params=params, timeout=10)
            elif method == "POST":
                response = requests.post(url, json=data, params=params, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            # Check status code
            success = response.status_code == expected_status
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text[:500]}
            
            self.log_result(
                endpoint=endpoint,
                method=method,
                expected_status=expected_status,
                actual_status=response.status_code,
                response_data=response_data,
                success=success,
                error_msg=None if success else f"Expected {expected_status}, got {response.status_code}"
            )
            
            return success, response_data
            
        except requests.exceptions.ConnectionError as e:
            error_msg = f"Connection error: {str(e)}"
            self.log_result(
                endpoint=endpoint,
                method=method,
                expected_status=expected_status,
                actual_status=0,
                response_data={"error": "Connection failed"},
                success=False,
                error_msg=error_msg
            )
            return False, {"error": error_msg}
            
        except requests.exceptions.Timeout as e:
            error_msg = f"Timeout error: {str(e)}"
            self.log_result(
                endpoint=endpoint,
                method=method,
                expected_status=expected_status,
                actual_status=0,
                response_data={"error": "Timeout"},
                success=False,
                error_msg=error_msg
            )
            return False, {"error": error_msg}
            
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            self.log_result(
                endpoint=endpoint,
                method=method,
                expected_status=expected_status,
                actual_status=0,
                response_data={"error": "Exception"},
                success=False,
                error_msg=error_msg
            )
            return False, {"error": error_msg}
    
    def validate_documents_response(self, response_data, endpoint):
        """Validate that the response has the expected documents structure"""
        if not isinstance(response_data, dict):
            return False, f"Response is not a JSON object: {type(response_data)}"
        
        if "documents" not in response_data:
            return False, "Missing 'documents' key in response"
        
        if not isinstance(response_data["documents"], list):
            return False, f"'documents' should be a list, got {type(response_data['documents'])}"
        
        # For new user, documents should be empty array
        if len(response_data["documents"]) == 0:
            return True, "Empty documents array as expected for new user"
        
        # If documents exist, validate structure
        for doc in response_data["documents"]:
            required_fields = ["id", "filename", "file_type", "upload_date"]
            for field in required_fields:
                if field not in doc:
                    return False, f"Document missing required field: {field}"
        
        return True, f"Valid documents response with {len(response_data['documents'])} documents"
    
    def run_critical_tests(self):
        """Run all critical endpoint tests"""
        print("🚀 Starting Critical API Endpoints Testing")
        print("=" * 60)
        print("Testing newly added endpoints that were causing 502 errors in production")
        print(f"Backend URL: {BACKEND_BASE_URL}")
        print("=" * 60)
        
        test_user_email = "test@example.com"
        
        # Test 1: GET /api/test (Basic routing verification)
        print("\n📋 TEST 1: API Test Endpoint")
        success, response = self.test_endpoint("/api/test", "GET", 200)
        if success and "status" in response and response["status"] == "ok":
            print("✅ API routing is working correctly")
        elif success:
            print(f"⚠️ API test endpoint responded but with unexpected data: {response}")
        
        # Test 2: GET /list?user_email=test@example.com
        print("\n📋 TEST 2: Root List Endpoint")
        success, response = self.test_endpoint("/list", "GET", 200, params={"user_email": test_user_email})
        if success:
            valid, msg = self.validate_documents_response(response, "/list")
            if valid:
                print(f"✅ Root list endpoint: {msg}")
            else:
                print(f"⚠️ Root list endpoint response validation failed: {msg}")
                self.results["critical_issues"].append({
                    "endpoint": "/list",
                    "issue": f"Response validation failed: {msg}",
                    "severity": "MEDIUM"
                })
        
        # Test 3: GET /v1/list?user_email=test@example.com
        print("\n📋 TEST 3: V1 List Endpoint")
        success, response = self.test_endpoint("/v1/list", "GET", 200, params={"user_email": test_user_email})
        if success:
            valid, msg = self.validate_documents_response(response, "/v1/list")
            if valid:
                print(f"✅ V1 list endpoint: {msg}")
            else:
                print(f"⚠️ V1 list endpoint response validation failed: {msg}")
                self.results["critical_issues"].append({
                    "endpoint": "/v1/list",
                    "issue": f"Response validation failed: {msg}",
                    "severity": "MEDIUM"
                })
        
        # Test 4: GET /api/list?user_email=test@example.com
        print("\n📋 TEST 4: API List Endpoint")
        success, response = self.test_endpoint("/api/list", "GET", 200, params={"user_email": test_user_email})
        if success:
            valid, msg = self.validate_documents_response(response, "/api/list")
            if valid:
                print(f"✅ API list endpoint: {msg}")
            else:
                print(f"⚠️ API list endpoint response validation failed: {msg}")
                self.results["critical_issues"].append({
                    "endpoint": "/api/list",
                    "issue": f"Response validation failed: {msg}",
                    "severity": "MEDIUM"
                })
        
        # Test 5: GET /api/v1/list?user_email=test@example.com
        print("\n📋 TEST 5: API V1 List Endpoint")
        success, response = self.test_endpoint("/api/v1/list", "GET", 200, params={"user_email": test_user_email})
        if success:
            valid, msg = self.validate_documents_response(response, "/api/v1/list")
            if valid:
                print(f"✅ API V1 list endpoint: {msg}")
            else:
                print(f"⚠️ API V1 list endpoint response validation failed: {msg}")
                self.results["critical_issues"].append({
                    "endpoint": "/api/v1/list",
                    "issue": f"Response validation failed: {msg}",
                    "severity": "MEDIUM"
                })
        
        # Additional verification tests
        print("\n📋 ADDITIONAL VERIFICATION TESTS")
        
        # Test health endpoint
        print("\n🔍 Testing Health Endpoint")
        self.test_endpoint("/api/health", "GET", 200)
        
        # Test root health endpoints
        print("\n🔍 Testing Root Health Endpoints")
        self.test_endpoint("/health", "GET", 200)
        self.test_endpoint("/v1/health", "GET", 200)
        
        # Test with missing user_email parameter
        print("\n🔍 Testing Error Handling - Missing user_email")
        self.test_endpoint("/api/list", "GET", 422)  # Should return validation error
        
        # Test with invalid user_email
        print("\n🔍 Testing Error Handling - Invalid user_email")
        self.test_endpoint("/api/list", "GET", 200, params={"user_email": "nonexistent@example.com"})
        
        # Calculate success rate
        total = self.results["test_summary"]["total_tests"]
        passed = self.results["test_summary"]["passed"]
        self.results["test_summary"]["success_rate"] = (passed / total * 100) if total > 0 else 0
        
        # Generate recommendations
        self.generate_recommendations()
        
        return self.results
    
    def generate_recommendations(self):
        """Generate recommendations based on test results"""
        critical_count = len([issue for issue in self.results["critical_issues"] if issue["severity"] == "CRITICAL"])
        high_count = len([issue for issue in self.results["critical_issues"] if issue["severity"] == "HIGH"])
        
        if critical_count > 0:
            self.results["recommendations"].append({
                "priority": "CRITICAL",
                "action": f"Fix {critical_count} critical 502 errors immediately - these are blocking production",
                "details": "502 Bad Gateway errors indicate server connectivity issues or missing endpoints"
            })
        
        if high_count > 0:
            self.results["recommendations"].append({
                "priority": "HIGH", 
                "action": f"Fix {high_count} high priority 404 errors - endpoints not found",
                "details": "404 errors indicate missing endpoints that should be implemented"
            })
        
        success_rate = self.results["test_summary"]["success_rate"]
        if success_rate < 80:
            self.results["recommendations"].append({
                "priority": "HIGH",
                "action": f"Success rate is {success_rate:.1f}% - investigate failing endpoints",
                "details": "Low success rate indicates systemic issues with the API"
            })
        elif success_rate >= 95:
            self.results["recommendations"].append({
                "priority": "LOW",
                "action": "Excellent success rate - API endpoints are working correctly",
                "details": "All critical endpoints are responding as expected"
            })
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🎯 CRITICAL ENDPOINTS TEST SUMMARY")
        print("=" * 60)
        
        summary = self.results["test_summary"]
        print(f"📊 Total Tests: {summary['total_tests']}")
        print(f"✅ Passed: {summary['passed']}")
        print(f"❌ Failed: {summary['failed']}")
        print(f"📈 Success Rate: {summary['success_rate']:.1f}%")
        
        if self.results["critical_issues"]:
            print(f"\n🚨 CRITICAL ISSUES FOUND: {len(self.results['critical_issues'])}")
            for issue in self.results["critical_issues"]:
                print(f"   {issue['severity']}: {issue['endpoint']} - {issue.get('issue', issue.get('error', 'Unknown error'))}")
        else:
            print("\n✅ NO CRITICAL ISSUES FOUND")
        
        if self.results["recommendations"]:
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in self.results["recommendations"]:
                print(f"   {rec['priority']}: {rec['action']}")
        
        print("=" * 60)

def main():
    """Main test execution"""
    tester = CriticalEndpointTester()
    
    try:
        # Run the critical tests
        results = tester.run_critical_tests()
        
        # Print summary
        tester.print_summary()
        
        # Save results to file
        results_file = f"critical_endpoints_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {results_file}")
        
        # Return appropriate exit code
        if results["test_summary"]["success_rate"] >= 80:
            print("\n🎉 CRITICAL ENDPOINTS TEST PASSED")
            return 0
        else:
            print("\n💥 CRITICAL ENDPOINTS TEST FAILED")
            return 1
            
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR IN TESTING: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
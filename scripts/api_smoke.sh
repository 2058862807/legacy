#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-https://api.nexteraestate.com}"

pass=0
fail=0

check() {
    name="$1"
    url="$2"
    method="${3:-GET}"
    data="${4:-}"
    
    echo "Testing $name: $method $url"
    
    if [ "$method" = "GET" ]; then
        resp=$(curl -sS -m 8 -w " HTTPSTATUS:%{http_code}" "$BASE$url")
    else
        resp=$(curl -sS -m 8 -X "$method" -H "Content-Type: application/json" -d "$data" -w " HTTPSTATUS:%{http_code}" "$BASE$url")
    fi
    
    body="${resp% HTTPSTATUS:*}"
    code="${resp##*HTTPSTATUS:}"
    
    if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
        echo "✅ PASS $name $code"
        pass=$((pass+1))
    else
        echo "❌ FAIL $name $code $url"
        echo "$body" | head -n 5
        fail=$((fail+1))
    fi
    echo ""
}

echo "🚀 NexteraEstate API Smoke Tests (TypeScript/Express)"
echo "Testing base: $BASE"
echo "=================================="
echo ""

# Health endpoints
check "health" "/health"
check "health_v1" "/v1/health"
check "diagnostics" "/v1/diagnostics"

# V1 Business endpoints
check "v1_list" "/v1/list?user_email=test%40example.com"
check "v1_users" "/v1/users?email=test%40example.com"  
check "v1_wills" "/v1/wills?user_email=test%40example.com"
check "v1_compliance" "/v1/compliance"
check "v1_test" "/v1/test"

# Compatibility layer (/api -> /v1 mapping)
check "api_documents_list" "/api/documents/list?user_email=test%40example.com"
check "api_documents" "/api/documents?user_email=test%40example.com"
check "api_users" "/api/users?email=test%40example.com"
check "api_wills" "/api/wills?user_email=test%40example.com"
check "api_compliance" "/api/compliance"
check "api_test" "/api/test"
check "api_debug_cors" "/api/debug/cors"

echo "=================================="
echo "📊 SMOKE TEST SUMMARY"
echo "✅ PASS: $pass"
echo "❌ FAIL: $fail"
echo "Total tests: $((pass+fail))"

if [ "$fail" -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo "💥 $fail TESTS FAILED!"
    exit 1
fi
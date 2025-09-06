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

echo "🚀 NexteraEstate API Smoke Tests"
echo "Testing base: $BASE"
echo "=================================="
echo ""

# Health endpoints
check "health" "/health"
check "health_v1" "/v1/health"
check "diagnostics" "/v1/diagnostics"

# Critical list endpoints (502 fix)
check "list_root" "/list?user_email=test%40example.com"
check "list_v1" "/v1/list?user_email=test%40example.com"
check "list_api" "/api/list?user_email=test%40example.com"
check "list_api_v1" "/api/v1/list?user_email=test%40example.com"

# Document endpoints
check "documents_list" "/api/documents/list?user_email=test%40example.com"

# User endpoints  
check "user_lookup" "/api/users?email=test%40example.com"

# Will endpoints
check "will_lookup" "/api/wills?user_email=test%40example.com"

# Compliance
check "compliance" "/api/compliance"

# Debug endpoints
check "cors_debug" "/api/debug/cors"
check "api_test" "/api/test"

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
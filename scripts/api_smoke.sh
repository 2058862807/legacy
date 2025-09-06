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

# Business endpoints
check "list" "/v1/list?user_email=test%40example.com"
check "users" "/v1/users?email=test%40example.com"  
check "wills" "/v1/wills?user_email=test%40example.com"
check "compliance" "/v1/compliance"
check "test" "/v1/test"

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
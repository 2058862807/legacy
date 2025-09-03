#!/bin/bash

# Quick AI Agent Communication Script
# Usage: ./ask_ai.sh "Your question here"

if [ -z "$1" ]; then
    echo "Usage: ./ask_ai.sh \"Your question here\""
    echo "Example: ./ask_ai.sh \"What is my system status?\""
    exit 1
fi

echo "🤖 Asking your AI agents..."
echo "----------------------------------------"

curl -X POST "http://localhost:8001/api/ai-team/communicate" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$1\",\"recipient\":\"team\",\"priority\":\"normal\"}" \
  2>/dev/null | python3 -m json.tool

echo "----------------------------------------"
echo "✅ Response complete"
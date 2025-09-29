#!/bin/bash

echo "🧪 Simple Parallel AI API Test"
echo "=============================="

# Check if API key is provided
if [ -z "$1" ]; then
    echo "❌ Usage: $0 <your_parallel_api_key>"
    echo "   Example: $0 sk-1234567890abcdef..."
    exit 1
fi

API_KEY="$1"
API_URL="https://api.parallel.ai/v1/tasks/runs"

echo "✅ Testing with API key: ${API_KEY:0:10}..."
echo ""

# Test request
echo "📤 Making test request to: $API_URL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "https://www.instagram.com/test",
    "task_spec": {
      "output_schema": {
        "type": "json",
        "json_schema": {
          "type": "object",
          "properties": {
            "test": {
              "type": "string",
              "description": "A simple test response"
            }
          },
          "required": ["test"],
          "additionalProperties": false
        }
      }
    },
    "processor": "lite",
    "metadata": {
      "test": true
    }
  }' \
  "$API_URL")

# Split response and status code
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "📥 Response status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 201 ]; then
    echo "✅ SUCCESS! Parallel AI Task API is working!"
    echo ""
    echo "📋 Response:"
    echo "$RESPONSE_BODY" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE_BODY"
else
    echo "❌ API request failed"
    echo ""
    echo "📋 Error response:"
    echo "$RESPONSE_BODY"
    
    # Common error analysis
    if echo "$RESPONSE_BODY" | grep -q "No products found"; then
        echo ""
        echo "💡 This error suggests the endpoint path might be incorrect."
        echo "   The API might be expecting a different endpoint structure."
    elif echo "$RESPONSE_BODY" | grep -q "unauthorized\|Unauthorized"; then
        echo ""
        echo "💡 This suggests an authentication issue."
        echo "   Please verify your API key is correct."
    elif echo "$RESPONSE_BODY" | grep -q "not found\|Not Found"; then
        echo ""
        echo "💡 This suggests the endpoint doesn't exist."
        echo "   Please check the Parallel AI documentation for correct endpoints."
    fi
fi

echo ""
echo "🏁 Test completed!"

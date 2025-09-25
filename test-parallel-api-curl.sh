#!/bin/bash

# Test script for Parallel AI Task API using curl
# This script tests the API endpoints without requiring Node.js

echo "🧪 Testing Parallel AI Task API with curl"
echo "=========================================="

# Check if PARALLEL_API_KEY is set
if [ -z "$PARALLEL_API_KEY" ]; then
    echo "❌ PARALLEL_API_KEY not found in environment variables"
    echo "Please set PARALLEL_API_KEY in your environment:"
    echo "export PARALLEL_API_KEY=your_actual_parallel_api_key_here"
    exit 1
fi

echo "✅ PARALLEL_API_KEY found: ${PARALLEL_API_KEY:0:10}..."

# API Configuration
PARALLEL_API_BASE_URL="https://api.parallel.ai"
ENDPOINT="/v1/tasks/runs"

echo ""
echo "📤 Testing endpoint: ${PARALLEL_API_BASE_URL}${ENDPOINT}"
echo ""

# Test request payload
TEST_REQUEST='{
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
}'

echo "📋 Request payload:"
echo "$TEST_REQUEST" | jq . 2>/dev/null || echo "$TEST_REQUEST"
echo ""

# Make the API request
echo "🚀 Making API request..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$TEST_REQUEST" \
  "$PARALLEL_API_BASE_URL$ENDPOINT")

# Split response and status code
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "📥 Response status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 201 ]; then
    echo "✅ SUCCESS! Parallel AI Task API is working!"
    echo ""
    echo "📋 Response body:"
    echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
    
    # Extract task ID if available
    TASK_ID=$(echo "$RESPONSE_BODY" | jq -r '.run_id // .id // .task_id' 2>/dev/null)
    if [ "$TASK_ID" != "null" ] && [ -n "$TASK_ID" ]; then
        echo ""
        echo "🎯 Task ID: $TASK_ID"
        echo ""
        echo "📊 Testing task status endpoint..."
        
        # Test status endpoint
        STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" \
          -H "x-api-key: $PARALLEL_API_KEY" \
          -H "Content-Type: application/json" \
          "$PARALLEL_API_BASE_URL/v1/tasks/runs/$TASK_ID")
        
        STATUS_HTTP=$(echo "$STATUS_RESPONSE" | tail -n1)
        STATUS_BODY=$(echo "$STATUS_RESPONSE" | head -n -1)
        
        echo "📥 Status response: $STATUS_HTTP"
        if [ "$STATUS_HTTP" -eq 200 ]; then
            echo "✅ Status endpoint working!"
            echo "$STATUS_BODY" | jq . 2>/dev/null || echo "$STATUS_BODY"
        else
            echo "❌ Status endpoint failed"
            echo "$STATUS_BODY"
        fi
    fi
    
else
    echo "❌ API request failed"
    echo ""
    echo "📋 Error response:"
    echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
    
    # Common error analysis
    if echo "$RESPONSE_BODY" | grep -q "No products found"; then
        echo ""
        echo "💡 This error suggests the endpoint path might be incorrect."
        echo "   The API might be expecting a different endpoint structure."
    elif echo "$RESPONSE_BODY" | grep -q "unauthorized\|Unauthorized"; then
        echo ""
        echo "💡 This suggests an authentication issue."
        echo "   Please verify your PARALLEL_API_KEY is correct."
    elif echo "$RESPONSE_BODY" | grep -q "not found\|Not Found"; then
        echo ""
        echo "💡 This suggests the endpoint doesn't exist."
        echo "   Please check the Parallel AI documentation for correct endpoints."
    fi
fi

echo ""
echo "🏁 Test completed!"

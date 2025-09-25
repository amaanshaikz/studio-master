// Simple test script to debug Parallel API connection
const fetch = require('node-fetch');

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;
const PARALLEL_API_BASE_URL = 'https://api.parallel.ai';

async function testParallelAPI() {
  console.log('🔍 Testing Parallel API Connection...');
  console.log('API Key configured:', !!PARALLEL_API_KEY);
  console.log('API Key length:', PARALLEL_API_KEY ? PARALLEL_API_KEY.length : 0);
  console.log('API Key prefix:', PARALLEL_API_KEY ? PARALLEL_API_KEY.substring(0, 8) + '...' : 'N/A');
  
  if (!PARALLEL_API_KEY) {
    console.error('❌ PARALLEL_API_KEY not found in environment variables');
    console.log('Please set PARALLEL_API_KEY in your .env.local file');
    return;
  }

  const testRequest = {
    input: 'https://www.instagram.com/test',
    task_spec: {
      output_schema: {
        type: "json",
        json_schema: {
          type: "object",
          properties: {
            test: { 
              type: "string",
              description: "A simple test response"
            }
          },
          required: ["test"],
          additionalProperties: false
        }
      }
    },
    processor: 'lite',
    metadata: {
      test: true
    }
  };

  try {
    // Test the correct Parallel AI Task API endpoint
    const endpoint = '/v1/tasks/runs';

    console.log(`\n📤 Testing endpoint: ${PARALLEL_API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${PARALLEL_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'x-api-key': PARALLEL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    console.log(`📥 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText.substring(0, 200)}...`);
    } else {
      const result = await response.json();
      console.log(`✅ SUCCESS! Parallel AI Task API is working!`);
      console.log('Response:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Network/Request Error:', error.message);
    console.error('Full error:', error);
  }
}

testParallelAPI();

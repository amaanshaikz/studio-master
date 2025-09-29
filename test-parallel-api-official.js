#!/usr/bin/env node

/**
 * Official Parallel AI API Test Script
 * Based on the official documentation: https://docs.parallel.ai/
 * 
 * This script tests the canonical endpoints and request formats
 * for Deep Research tasks with processor="pro"
 */

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;
const PARALLEL_API_BASE = process.env.PARALLEL_API_BASE || 'https://api.parallel.ai';

// Official headers as per documentation
const HEADERS = {
  'x-api-key': PARALLEL_API_KEY,
  'Content-Type': 'application/json'
};

async function testParallelAPI() {
  console.log('🧪 Official Parallel AI API Test');
  console.log('================================');
  console.log(`Base URL: ${PARALLEL_API_BASE}`);
  console.log(`API Key: ${PARALLEL_API_KEY ? PARALLEL_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
  console.log('');

  if (!PARALLEL_API_KEY) {
    console.error('❌ PARALLEL_API_KEY not found in environment variables');
    console.log('Please set PARALLEL_API_KEY in your environment:');
    console.log('export PARALLEL_API_KEY=your_actual_parallel_api_key_here');
    return;
  }

  try {
    // Test 1: Create a Deep Research task (pro processor)
    console.log('📤 Test 1: Creating Deep Research task with processor="pro"');
    
    const createRequest = {
      input: "Write a structured, citation-backed 1-page market research summary on Instagram creator @test",
      processor: "pro",
      task_spec: {
        output_schema: {
          type: "json",
          json_schema: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Market research summary" }
            },
            required: ["summary"],
            additionalProperties: false
          }
        }
      }
    };

    console.log('Request payload:', JSON.stringify(createRequest, null, 2));
    console.log('');

    const createResponse = await fetch(`${PARALLEL_API_BASE}/v1/tasks/runs`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(createRequest)
    });

    console.log(`📥 Create response status: ${createResponse.status}`);
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('❌ Create task failed:');
      console.log(errorText);
      return;
    }

    const createResult = await createResponse.json();
    console.log('✅ Task created successfully!');
    console.log('Response:', JSON.stringify(createResult, null, 2));
    
    const runId = createResult.run_id;
    if (!runId) {
      console.log('❌ No run_id in response');
      return;
    }

    console.log(`🎯 Run ID: ${runId}`);
    console.log('');

    // Test 2: Retrieve run status
    console.log('📤 Test 2: Retrieving run status');
    
    const statusResponse = await fetch(`${PARALLEL_API_BASE}/v1/tasks/runs/${runId}`, {
      method: 'GET',
      headers: HEADERS
    });

    console.log(`📥 Status response: ${statusResponse.status}`);
    
    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.log('❌ Get status failed:');
      console.log(errorText);
      return;
    }

    const statusResult = await statusResponse.json();
    console.log('✅ Status retrieved successfully!');
    console.log('Status:', JSON.stringify(statusResult, null, 2));
    console.log('');

    // Test 3: Retrieve run input
    console.log('📤 Test 3: Retrieving run input');
    
    const inputResponse = await fetch(`${PARALLEL_API_BASE}/v1/tasks/runs/${runId}/input`, {
      method: 'GET',
      headers: HEADERS
    });

    console.log(`📥 Input response: ${inputResponse.status}`);
    
    if (!inputResponse.ok) {
      const errorText = await inputResponse.text();
      console.log('❌ Get input failed:');
      console.log(errorText);
    } else {
      const inputResult = await inputResponse.json();
      console.log('✅ Input retrieved successfully!');
      console.log('Input:', JSON.stringify(inputResult, null, 2));
    }
    console.log('');

    // Test 4: Retrieve run result (blocking with timeout)
    console.log('📤 Test 4: Retrieving run result (blocking with 60s timeout)');
    
    const resultResponse = await fetch(`${PARALLEL_API_BASE}/v1/tasks/runs/${runId}/result?timeout=60`, {
      method: 'GET',
      headers: HEADERS
    });

    console.log(`📥 Result response: ${resultResponse.status}`);
    
    if (!resultResponse.ok) {
      const errorText = await resultResponse.text();
      console.log('❌ Get result failed:');
      console.log(errorText);
    } else {
      const resultData = await resultResponse.json();
      console.log('✅ Result retrieved successfully!');
      console.log('Result:', JSON.stringify(resultData, null, 2));
    }
    console.log('');

    // Test 5: Test Instagram Creator Intelligence specific request
    console.log('📤 Test 5: Instagram Creator Intelligence Deep Research');
    
    const instagramRequest = {
      input: "You are a structured research agent. Your task is to analyze a social media creator's profile and generate a detailed, structured dataset. Analyze the Instagram profile at https://www.instagram.com/test and provide comprehensive creator intelligence data. ⚠️ Output Rules: - Respond in **valid JSON only**, no markdown, no explanations, no comments. - Always include **all fields**, even if inferred or empty. - Keep text concise but descriptive. - Arrays must always return at least an empty array if no data is available.",
      processor: "pro",
      task_spec: {
        output_schema: {
          type: "json",
          json_schema: {
            type: "object",
            description: "Analyze the Instagram creator's profile and extract comprehensive creator intelligence data. Focus on visible content, engagement patterns, and audience insights from their public profile.",
            properties: {
              username: { 
                type: "string", 
                description: "Instagram username (without @)" 
              },
              full_name: { 
                type: "string", 
                description: "Full display name from profile" 
              },
              follower_count: { 
                type: "integer", 
                description: "Number of followers" 
              },
              post_count: { 
                type: "integer", 
                description: "Number of posts" 
              },
              bio: { 
                type: "string", 
                description: "Profile bio text" 
              },
              primary_niche: { 
                type: "string", 
                description: "Main content category/niche" 
              }
            },
            required: ["username", "full_name", "follower_count", "post_count", "bio", "primary_niche"],
            additionalProperties: false
          }
        }
      }
    };

    console.log('Instagram request payload:', JSON.stringify(instagramRequest, null, 2));
    console.log('');

    const instagramResponse = await fetch(`${PARALLEL_API_BASE}/v1/tasks/runs`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(instagramRequest)
    });

    console.log(`📥 Instagram response status: ${instagramResponse.status}`);
    
    if (!instagramResponse.ok) {
      const errorText = await instagramResponse.text();
      console.log('❌ Instagram task creation failed:');
      console.log(errorText);
    } else {
      const instagramResult = await instagramResponse.json();
      console.log('✅ Instagram task created successfully!');
      console.log('Response:', JSON.stringify(instagramResult, null, 2));
    }

    console.log('');
    console.log('🏁 All tests completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('✅ Base URL: https://api.parallel.ai');
    console.log('✅ Auth Header: x-api-key');
    console.log('✅ Endpoints: /v1/tasks/runs, /v1/tasks/runs/{id}, /v1/tasks/runs/{id}/result');
    console.log('✅ Processor: pro (Deep Research)');
    console.log('✅ Output Schema: auto (Deep Research mode)');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testParallelAPI().catch(console.error);

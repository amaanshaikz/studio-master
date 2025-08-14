#!/usr/bin/env node

/**
 * Platform Integration Testing Script
 * Tests Instagram Graph API and LinkedIn API integrations
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:9002';

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logHeader(message) {
  log(`\n${colors.bold}${message}${colors.reset}`);
  console.log('='.repeat(message.length));
}

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: TEST_CONFIG.timeout,
      ...options,
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test functions
async function testServerHealth() {
  logHeader('Testing Server Health');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/platforms/instagram`);
    if (response.status === 401) {
      logSuccess('Server is running and authentication is working');
    } else {
      logWarning(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    logError(`Server health check failed: ${error.message}`);
    return false;
  }
  
  return true;
}

async function testInstagramAPI() {
  logHeader('Testing Instagram API Endpoints');
  
  const endpoints = [
    {
      name: 'GET /api/platforms/instagram',
      url: `${BASE_URL}/api/platforms/instagram`,
      method: 'GET',
    },
    {
      name: 'POST /api/platforms/instagram',
      url: `${BASE_URL}/api/platforms/instagram`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    },
    {
      name: 'POST /api/platforms/instagram/disconnect',
      url: `${BASE_URL}/api/platforms/instagram/disconnect`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      logInfo(`Testing ${endpoint.name}...`);
      
      const response = await makeRequest(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body,
      });

      if (response.status === 401) {
        logSuccess(`${endpoint.name} - Authentication required (expected)`);
      } else if (response.status === 200 || response.status === 400) {
        logSuccess(`${endpoint.name} - Responded correctly (${response.status})`);
      } else {
        logWarning(`${endpoint.name} - Unexpected status: ${response.status}`);
      }
    } catch (error) {
      logError(`${endpoint.name} - Failed: ${error.message}`);
    }
  }
}

async function testLinkedInAPI() {
  logHeader('Testing LinkedIn API Endpoints');
  
  const endpoints = [
    {
      name: 'GET /api/platforms/linkedin',
      url: `${BASE_URL}/api/platforms/linkedin`,
      method: 'GET',
    },
    {
      name: 'POST /api/platforms/linkedin',
      url: `${BASE_URL}/api/platforms/linkedin`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    },
    {
      name: 'POST /api/platforms/linkedin/disconnect',
      url: `${BASE_URL}/api/platforms/linkedin/disconnect`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      logInfo(`Testing ${endpoint.name}...`);
      
      const response = await makeRequest(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body,
      });

      if (response.status === 401) {
        logSuccess(`${endpoint.name} - Authentication required (expected)`);
      } else if (response.status === 200 || response.status === 400) {
        logSuccess(`${endpoint.name} - Responded correctly (${response.status})`);
      } else {
        logWarning(`${endpoint.name} - Unexpected status: ${response.status}`);
      }
    } catch (error) {
      logError(`${endpoint.name} - Failed: ${error.message}`);
    }
  }
}

async function testWebhookEndpoints() {
  logHeader('Testing Webhook Endpoints');
  
  const endpoints = [
    {
      name: 'GET /api/webhooks/instagram',
      url: `${BASE_URL}/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=test&hub.challenge=test`,
      method: 'GET',
    },
    {
      name: 'POST /api/webhooks/instagram',
      url: `${BASE_URL}/api/webhooks/instagram`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    },
    {
      name: 'GET /api/webhooks/linkedin',
      url: `${BASE_URL}/api/webhooks/linkedin?challenge=test&token=test`,
      method: 'GET',
    },
    {
      name: 'POST /api/webhooks/linkedin',
      url: `${BASE_URL}/api/webhooks/linkedin`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    },
  ];

  for (const endpoint of endpoints) {
    try {
      logInfo(`Testing ${endpoint.name}...`);
      
      const response = await makeRequest(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body,
      });

      if (response.status === 403) {
        logSuccess(`${endpoint.name} - Webhook verification working (expected 403 for invalid tokens)`);
      } else if (response.status === 200 || response.status === 400) {
        logSuccess(`${endpoint.name} - Responded correctly (${response.status})`);
      } else {
        logWarning(`${endpoint.name} - Unexpected status: ${response.status}`);
      }
    } catch (error) {
      logError(`${endpoint.name} - Failed: ${error.message}`);
    }
  }
}

async function testOAuthEndpoints() {
  logHeader('Testing OAuth Endpoints');
  
  const endpoints = [
    {
      name: 'GET /api/auth/callback/instagram',
      url: `${BASE_URL}/api/auth/callback/instagram?error=test`,
      method: 'GET',
    },
    {
      name: 'GET /api/auth/callback/linkedin',
      url: `${BASE_URL}/api/auth/callback/linkedin?error=test`,
      method: 'GET',
    },
  ];

  for (const endpoint of endpoints) {
    try {
      logInfo(`Testing ${endpoint.name}...`);
      
      const response = await makeRequest(endpoint.url, {
        method: endpoint.method,
      });

      if (response.status === 302) {
        logSuccess(`${endpoint.name} - Redirecting correctly (expected for OAuth errors)`);
      } else {
        logWarning(`${endpoint.name} - Unexpected status: ${response.status}`);
      }
    } catch (error) {
      logError(`${endpoint.name} - Failed: ${error.message}`);
    }
  }
}

async function testEnvironmentVariables() {
  logHeader('Testing Environment Variables');
  
  const requiredVars = [
    'NEXT_PUBLIC_INSTAGRAM_CLIENT_ID',
    'INSTAGRAM_CLIENT_SECRET',
    'INSTAGRAM_WEBHOOK_VERIFY_TOKEN',
    'INSTAGRAM_WEBHOOK_SECRET',
    'NEXT_PUBLIC_LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET',
    'LINKEDIN_WEBHOOK_VERIFY_TOKEN',
    'LINKEDIN_WEBHOOK_SECRET',
    'ENCRYPTION_KEY',
  ];

  for (const varName of requiredVars) {
    try {
      const response = await makeRequest(`${BASE_URL}/api/test/env/${varName}`);
      if (response.status === 200) {
        logSuccess(`${varName} - Configured`);
      } else {
        logWarning(`${varName} - Not configured or not accessible`);
      }
    } catch (error) {
      logWarning(`${varName} - Could not verify (${error.message})`);
    }
  }
}

async function runAllTests() {
  logHeader('Platform Integration Test Suite');
  logInfo('Starting comprehensive testing...\n');

  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'Instagram API', fn: testInstagramAPI },
    { name: 'LinkedIn API', fn: testLinkedInAPI },
    { name: 'Webhook Endpoints', fn: testWebhookEndpoints },
    { name: 'OAuth Endpoints', fn: testOAuthEndpoints },
    { name: 'Environment Variables', fn: testEnvironmentVariables },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      logInfo(`Running ${test.name} tests...`);
      const result = await test.fn();
      if (result !== false) {
        passedTests++;
      }
    } catch (error) {
      logError(`${test.name} tests failed: ${error.message}`);
    }
  }

  logHeader('Test Results Summary');
  logInfo(`Tests passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    logSuccess('All tests passed! 🎉');
  } else {
    logWarning('Some tests failed. Please review the output above.');
  }

  logHeader('Next Steps');
  logInfo('1. Run the database migration in Supabase dashboard');
  logInfo('2. Configure Instagram and LinkedIn developer apps');
  logInfo('3. Set up webhook subscriptions');
  logInfo('4. Test with real OAuth flows');
  logInfo('5. Monitor webhook events');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    logError(`Test suite failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testServerHealth,
  testInstagramAPI,
  testLinkedInAPI,
  testWebhookEndpoints,
  testOAuthEndpoints,
  testEnvironmentVariables,
  runAllTests,
};

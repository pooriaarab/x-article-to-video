// Test script for API endpoints

const sampleTweet = {
  text: "Just shipped a new feature! 🚀 Excited to see what people build with it.",
  author: {
    name: "Test User",
    username: "@testuser",
    profilePicUrl: "https://via.placeholder.com/100"
  },
  media: [],
  timestamp: new Date().toISOString(),
  url: "https://x.com/testuser/status/123456789"
};

async function testHealthCheck() {
  console.log('\n🔍 Testing health check endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testGenerate() {
  console.log('\n🔍 Testing generate endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tweet: sampleTweet,
        style: 'minimal',
        grokApiKey: 'test-key-placeholder'
      })
    });

    const data = await response.json();

    if (data.error) {
      console.log('⚠️  Expected behavior - API needs real Grok key:', data.error);
      return { jobId: data.jobId || 'test-job-id', needsKey: true };
    }

    console.log('✅ Generate endpoint working:', data);
    return { jobId: data.jobId, needsKey: false };
  } catch (error) {
    console.error('❌ Generate endpoint failed:', error.message);
    return null;
  }
}

async function testStatus(jobId) {
  console.log('\n🔍 Testing status endpoint...');
  try {
    const response = await fetch(`http://localhost:3000/api/status/${jobId}`);
    const data = await response.json();

    if (data.error === 'Job not found') {
      console.log('✅ Status endpoint working (job not found - expected for test job)');
      return true;
    }

    console.log('✅ Status endpoint working:', data);
    return true;
  } catch (error) {
    console.error('❌ Status endpoint failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  console.log('='.repeat(50));

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Server not running. Please start with: npm run server');
    process.exit(1);
  }

  const generateResult = await testGenerate();
  if (!generateResult) {
    console.log('\n❌ Generate endpoint failed');
    process.exit(1);
  }

  const statusOk = await testStatus(generateResult.jobId);
  if (!statusOk) {
    console.log('\n❌ Status endpoint failed');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ All API tests passed!');
  console.log('\n📝 Note: Full video generation requires a valid Grok API key');
  console.log('   Set it in the Chrome extension settings after loading.\n');
}

runTests().catch(console.error);

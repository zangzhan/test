const axios = require('axios');

// 测试API密钥验证接口
async function testApiKey() {
  try {
    const response = await axios.get('http://localhost:3001/api/verify-api-key');
    console.log('API密钥验证结果:', response.data);
  } catch (error) {
    console.error('测试失败:', error.response ? error.response.data : error.message);
  }
}

// 测试环境变量接口
async function testEnv() {
  try {
    const response = await axios.get('http://localhost:3001/api/env');
    console.log('环境变量信息:', {
      aliyunApiKeyExists: response.data.aliyunApiKeyExists,
      aliyunApiKeyLength: response.data.aliyunApiKeyLength,
      aliyunApiKeyPrefix: response.data.aliyunApiKeyPrefix,
      nodeEnv: response.data.nodeEnv
    });
  } catch (error) {
    console.error('环境变量测试失败:', error.response ? error.response.data : error.message);
  }
}

// 执行测试
async function runTests() {
  console.log('开始测试API密钥...');
  await testApiKey();
  console.log('\n开始测试环境变量...');
  await testEnv();
}

runTests();
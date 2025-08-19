const axios = require('axios');

// 测试简化服务器的API
async function testSimpleServer() {
  try {
    const testData = {
      prompt: 'test image',
      style: 'realistic'
    };

    console.log('发送测试请求到 http://localhost:3002/api/generate');
    console.log('测试数据:', testData);

    const response = await axios.post('http://localhost:3002/api/generate', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('错误状态:', error.response?.status || 'N/A');
    console.error('错误数据:', JSON.stringify(error.response?.data || error.message, null, 2));
    console.error('错误堆栈:', error.stack);
  }
}

// 运行测试
console.log('开始测试简化服务器...');
testSimpleServer();
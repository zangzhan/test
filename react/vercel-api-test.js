const axios = require('axios');

// 测试Vercel部署的API
async function testVercelApi() {
  try {
    console.log('======= Vercel API 测试开始 =======');
    
    // 配置请求参数
    const vercelAppUrl = 'https://react-berryl-five-62.vercel.app';
    const testEndpoints = [
      { name: '验证API密钥', path: '/api/verify-api-key', method: 'GET' },
      { name: '环境变量检查', path: '/api/env', method: 'GET' },
      { 
        name: '生成图片API', 
        path: '/api/generate', 
        method: 'POST',
        data: { prompt: '测试图片', style: 'realistic' }
      }
    ];

    // 创建axios实例
    const axiosInstance = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 测试每个端点
    for (const endpoint of testEndpoints) {
      console.log(`\n测试端点: ${endpoint.name} (${endpoint.path})`);
      try {
        const url = `${vercelAppUrl}${endpoint.path}`;
        console.log(`请求URL: ${url}`);
        
        let response;
        if (endpoint.method === 'GET') {
          response = await axiosInstance.get(url);
        } else if (endpoint.method === 'POST') {
          response = await axiosInstance.post(url, endpoint.data);
          console.log('请求数据:', JSON.stringify(endpoint.data, null, 2));
        }

        console.log(`响应状态码: ${response.status}`);
        console.log('响应数据:', JSON.stringify(response.data, null, 2));
        console.log('✅ 测试成功');
      } catch (error) {
        console.error(`❌ 测试失败: ${error.message}`);
        console.error('错误类型:', error.name);
        
        if (error.response) {
          console.error(`响应状态码: ${error.response.status}`);
          console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          console.error('没有收到响应:', error.request);
        }

        // 分析常见错误
        if (error.code === 'ENOTFOUND') {
          console.error('域名解析失败: 可能是网络问题或Vercel应用未部署成功');
        } else if (error.code === 'ETIMEDOUT') {
          console.error('请求超时: 可能是网络不稳定或Vercel应用响应缓慢');
        } else if (error.code === 'ECONNRESET') {
          console.error('连接重置: 可能是网络问题或Vercel应用崩溃');
        } else if (error.response && error.response.status === 401) {
          console.error('认证失败: API密钥可能无效或未正确设置');
        } else if (error.response && error.response.status === 500) {
          console.error('服务器内部错误: Vercel应用可能存在代码问题');
        }
      }
    }

    console.log('\n======= Vercel API 测试结束 =======');
  } catch (error) {
    console.error('整体测试错误:', error);
  }
}

testVercelApi();
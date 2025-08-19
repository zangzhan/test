const https = require('https');

// 简单的网络连接测试
function testNetwork() {
  console.log('开始测试网络连接...');
  
  const options = {
    hostname: 'react-berryl-five-62.vercel.app',
    port: 443,
    path: '/api/verify-api-key',
    method: 'GET',
    timeout: 15000
  };
  
  const req = https.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log('响应头:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应体:', data);
      try {
        const jsonData = JSON.parse(data);
        console.log('解析后的响应:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.isValid !== undefined) {
          console.log(jsonData.isValid ? '✅ API密钥有效' : '❌ API密钥无效');
        }
      } catch (error) {
        console.error('解析响应失败:', error.message);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
    console.error('错误类型:', e.code);
    
    // 常见网络错误的建议
    if (e.code === 'ENOTFOUND') {
      console.log('\n建议: 检查域名是否正确或网络连接是否正常');
    } else if (e.code === 'ETIMEDOUT') {
      console.log('\n建议: 网络连接超时，检查网络稳定性或尝试稍后再试');
    } else {
      console.log('\n建议: 检查网络连接并确认Vercel应用已成功部署');
    }
  });
  
  req.on('timeout', () => {
    console.error('请求超时');
    req.abort();
  });
  
  req.end();
}

testNetwork();
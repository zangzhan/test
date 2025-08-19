const axios = require('axios');

// 测试Vercel部署环境中的API密钥
async function testVercelApiKey() {
  try {
    console.log('测试Vercel环境中的API密钥配置...');
    
    // 配置axios实例，增加超时时间
    const axiosInstance = axios.create({
      timeout: 15000, // 增加到15秒
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 调用Vercel部署的API验证接口
    console.log('正在调用API验证接口: https://react-berryl-five-62.vercel.app/api/verify-api-key');
    const response = await axiosInstance.get('https://react-berryl-five-62.vercel.app/api/verify-api-key');
    
    console.log('API响应状态码:', response.status);
    console.log('API响应:', JSON.stringify(response.data, null, 2));
    
    if (response.data.isValid) {
      console.log('✅ API密钥验证通过!');
      console.log(`密钥前缀: ${response.data.apiKeyPrefix}`);
      console.log(`密钥长度: ${response.data.apiKeyLength}`);
    } else {
      console.log('❌ API密钥验证失败!');
      console.log(`错误信息: ${response.data.message}`);
      console.log(`密钥长度: ${response.data.apiKeyLength}`);
      
      // 提供解决方案建议
      console.log('\n建议解决方案:');
      console.log('1. 登录Vercel控制台');
      console.log('2. 选择您的项目');
      console.log('3. 进入"Settings" -> "Environment Variables"');
      console.log('4. 确保已添加名为ALIYUN_API_KEY的环境变量，值为您的有效阿里云API密钥');
      console.log('5. 重新部署项目');
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
    console.error('错误类型:', error.name);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('没有收到响应:', error.request);
    }
    
    // 网络错误时的建议
    console.log('\n网络错误建议:');
    console.log('1. 检查您的网络连接');
    console.log('2. 确认Vercel应用已成功部署: https://react-berryl-five-62.vercel.app');
    console.log('3. 尝试直接在浏览器中访问API验证接口: https://react-berryl-five-62.vercel.app/api/verify-api-key');
  }
}

testVercelApiKey();
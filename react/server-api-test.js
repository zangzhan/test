require('dotenv').config({ path: ['.env.local', '.env'] });
const axios = require('axios');

// 测试函数
async function testApiCall() {
  try {
    // 获取环境变量
    const apiKey = process.env.ALIYUN_API_KEY || '';
    const apiUrl = process.env.ALIYUN_API_URL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-to-image/generation';

    console.log('环境变量检查:');
    console.log('ALIYUN_API_KEY是否存在:', !!apiKey);
    console.log('ALIYUN_API_KEY长度:', apiKey.length);
    console.log('ALIYUN_API_URL:', apiUrl);
    console.log('使用的API_KEY前缀:', apiKey.substring(0, 5));

    // 准备请求参数
    const requestData = {
      model: 'wan2.2-t2i-plus',
      input: {
        prompt: 'test image',
        style: 'realistic',
        size: '1024x1024',
        n: 1
      },
      parameters: {
        response_format: 'url'
      }
    };

    console.log('请求参数:', requestData);

    // 发送请求到阿里云API
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-DashScope-Async': 'enable'
      },
      timeout: 30000
    });

    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('错误状态:', error.response?.status || 'N/A');
    console.error('错误数据:', JSON.stringify(error.response?.data || error.message, null, 2));
    console.error('错误堆栈:', error.stack);
    throw error;
  }
}

// 运行测试
console.log('开始测试阿里云API调用...');
testApiCall()
  .then(data => console.log('测试完成'))
  .catch(err => console.log('测试失败'));
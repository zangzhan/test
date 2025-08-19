const axios = require('axios');
require('dotenv').config({ path: ['.env.local', '.env'] });

// 直接测试阿里云API的URL
async function testDirectApi() {
  try {
    // 获取环境变量
    const apiKey = process.env.ALIYUN_API_KEY || '';
    // 尝试不同的API URL
    const apiUrls = [
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-to-image/generation',
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      'https://dashscope.aliyuncs.com/api/v1/tasks'
    ];

    console.log('环境变量检查:');
    console.log('ALIYUN_API_KEY是否存在:', !!apiKey);
    console.log('ALIYUN_API_KEY长度:', apiKey.length);

    // 准备请求参数
    const requestData = {
      model: 'wan2.2-t2i-plus',
      prompt: 'test image',
      style: 'realistic',
      size: '1024x1024',
      n: 1
    };

    console.log('请求参数:', requestData);

    // 测试不同的URL
    for (const apiUrl of apiUrls) {
      console.log(`\n测试URL: ${apiUrl}`);
      try {
        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        });

        console.log('响应状态:', response.status);
        console.log('响应数据:', JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('错误状态:', error.response?.status || 'N/A');
        console.error('错误数据:', JSON.stringify(error.response?.data || error.message, null, 2));
      }
    }
  } catch (error) {
    console.error('整体错误:', error);
  }
}

// 运行测试
console.log('开始测试阿里云API URL...');
testDirectApi();
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// 从环境变量获取API密钥
const API_KEY = process.env.ALIYUN_API_KEY;
const ALIYUN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

// 测试数据
const testData = {
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

console.log('直接调用阿里云API测试:');
console.log('API_KEY长度:', API_KEY ? API_KEY.length : 0);
console.log('模型:', testData.model);
console.log('风格:', testData.input.style);

// 发送请求
axios.post(ALIYUN_API_URL, testData, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-DashScope-Async': 'enable'
  },
  timeout: 30000
})
.then(response => {
  console.log('响应状态:', response.status);
  console.log('响应数据:', response.data);
})
.catch(error => {
  console.error('错误状态:', error.response ? error.response.status : 'N/A');
  console.error('错误数据:', error.response ? error.response.data : error.message);
  console.error('错误详情:', error.config);
});
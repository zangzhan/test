// 环境变量测试脚本
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

console.log('======== 环境变量测试 ========');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ALIYUN_API_KEY是否存在:', !!process.env.ALIYUN_API_KEY);
console.log('ALIYUN_API_KEY长度:', process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.length : 0);
console.log('api_key是否存在:', !!process.env.api_key);
console.log('api_key长度:', process.env.api_key ? process.env.api_key.length : 0);
console.log('VERCEL_URL:', process.env.VERCEL_URL);
console.log('======================================');

// 模拟API调用中的认证头
const API_KEY = process.env.ALIYUN_API_KEY || process.env.api_key || '';
console.log('最终使用的API_KEY前缀:', API_KEY.substring(0, 5) + '...');
console.log('认证头格式:', API_KEY ? `Bearer ${API_KEY.substring(0, 5)}...` : 'Bearer [空]');

if (!API_KEY || API_KEY === 'your-aliyun-api-key') {
  console.error('错误: API密钥未正确设置!');
  console.error('请在Vercel控制台设置ALIYUN_API_KEY环境变量');
} else {
  console.log('API密钥已设置，看起来正常');
}
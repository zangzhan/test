require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// 模拟服务器获取API密钥的方式
const API_KEY = process.env.ALIYUN_API_KEY || process.env.api_key || '';

console.log('服务器环境中获取的API密钥信息:');
console.log('ALIYUN_API_KEY是否存在:', !!process.env.ALIYUN_API_KEY);
console.log('ALIYUN_API_KEY长度:', process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.length : 0);
console.log('api_key是否存在:', !!process.env.api_key);
console.log('api_key长度:', process.env.api_key ? process.env.api_key.length : 0);
console.log('最终使用的API_KEY长度:', API_KEY.length);
console.log('API_KEY前5个字符:', API_KEY.substring(0, 5));
console.log('API_KEY后5个字符:', API_KEY.substring(API_KEY.length - 5));
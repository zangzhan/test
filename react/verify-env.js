// 验证环境变量配置脚本
console.log('验证环境变量配置...');

// 检查必要的环境变量
const requiredEnvVars = [
  'ALIYUN_API_KEY',
  'NODE_ENV'
];

let hasError = false;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`错误: 缺少必要的环境变量 ${envVar}`);
    hasError = true;
  } else {
    console.log(`${envVar}: ${envVar === 'ALIYUN_API_KEY' ? '已设置 (值隐藏)' : process.env[envVar]}`);
  }
}

// 检查依赖是否安装
try {
  require('express');
  require('cors');
  require('express-rate-limit');
  console.log('必要的依赖已安装');
} catch (error) {
  console.error('错误: 缺少必要的依赖，请运行 npm install');
  hasError = true;
}

if (hasError) {
  console.error('验证失败，请修复上述问题后再部署');
  process.exit(1);
} else {
  console.log('验证通过，可以进行部署');
}
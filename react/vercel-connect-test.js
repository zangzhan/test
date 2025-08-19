const https = require('https');

// 测试Vercel应用的网络连接（支持重定向）
function testVercelConnection() {
  console.log('======= Vercel 网络连接测试开始 =======');
  
  // 初始配置
  const maxRedirects = 5;
  let redirectCount = 0;
  
  // 测试函数，支持重定向
  function makeRequest(options) {
    console.log(`正在连接到: https://${options.hostname}${options.path}`);
    
    const req = https.request(options, (res) => {
      console.log(`响应状态码: ${res.statusCode}`);
      console.log('响应头:', res.headers);
      
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        redirectCount++;
        if (redirectCount > maxRedirects) {
          console.error(`❌ 超过最大重定向次数(${maxRedirects})`);
          console.log('======= Vercel 网络连接测试结束 =======');
          return;
        }
        
        const redirectUrl = new URL(res.headers.location);
        console.log(`🔄 重定向到: ${redirectUrl.href}`);
        
        // 准备新请求
        const newOptions = {
          hostname: redirectUrl.hostname,
          port: redirectUrl.port || 443,
          path: redirectUrl.pathname + redirectUrl.search,
          method: 'GET',
          timeout: 10000
        };
        
        // 跟随重定向
        makeRequest(newOptions);
      } else {
        // 非重定向响应
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`响应体长度: ${data.length} 字符`);
          console.log('✅ 连接成功');
          console.log('======= Vercel 网络连接测试结束 =======');
        });
      }
    });
    
    req.on('error', (e) => {
      console.error(`❌ 连接失败: ${e.message}`);
      console.error('错误类型:', e.code);
      
      if (e.code === 'ENOTFOUND') {
        console.error('域名解析失败: 确认Vercel应用已成功部署或检查网络连接');
      } else if (e.code === 'ETIMEDOUT') {
        console.error('请求超时: 网络可能不稳定');
      } else if (e.code === 'ECONNRESET') {
        console.error('连接重置: 可能是服务器问题或网络中断');
      }
      
      console.log('======= Vercel 网络连接测试结束 =======');
    });
    
    req.on('timeout', () => {
      console.error('❌ 请求超时');
      req.abort();
    });
    
    req.end();
  }
  
  // 初始请求
  const initialOptions = {
    hostname: '1336104.xyz',
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 10000
  };
  
  makeRequest(initialOptions);
}

testVercelConnection();
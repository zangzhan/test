const http = require('http');
const fs = require('fs');
const path = require('path');

// 简单的HTTP服务器配置
const PORT = 8080;
const HOST = 'localhost';

// 创建服务器
const server = http.createServer((req, res) => {
  // 解析请求URL
  const url = req.url === '/' ? '/vercel-test-simple.html' : req.url;
  const filePath = path.join(__dirname, url);

  // 确定文件类型
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }

  // 读取并提供文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      // 成功提供文件
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
  console.log(`请在浏览器中访问 http://${HOST}:${PORT} 来测试Vercel应用`);
});

// 处理关闭信号
process.on('SIGINT', () => {
  console.log('服务器正在关闭...');
  server.close(() => {
    console.log('服务器已关闭');
  });
});
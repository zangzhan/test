const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// 挂载 API 路由
app.use('/api', require('./functions/api/generate'));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '文生图API服务',
    endpoints: [
      'POST /api/generate-image - 生成图片',
      'POST /api/status - 查询任务状态',
      'GET /health - 健康检查'
    ]
  });
});

// 导出Express应用实例供Vercel使用
module.exports = app;

// 本地开发时才监听端口
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  POST /api/generate-image - 生成图片');
    console.log('  POST /api/status - 查询任务状态');
    console.log('  GET /health - 健康检查');
  });
}
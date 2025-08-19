const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());
app.use(cors());

const ALIYUN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-to-image/generation';
const STATUS_API_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// 尝试从.env和.env.local文件加载环境变量
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// 尝试从不同来源获取API密钥
const API_KEY = process.env.ALIYUN_API_KEY || process.env.api_key || '';

// 服务器启动时记录关键环境变量信息
console.log('======== 服务器启动环境变量检查 ========');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ALIYUN_API_KEY是否存在:', !!process.env.ALIYUN_API_KEY);
console.log('ALIYUN_API_KEY长度:', process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.length : 0);
console.log('最终使用的API_KEY长度:', API_KEY.length);
console.log('VERCEL_URL:', process.env.VERCEL_URL);
console.log('======================================');

// 检查API密钥是否存在
if (!API_KEY || API_KEY === 'your-aliyun-api-key') {
  console.error('错误: ALIYUN_API_KEY未正确设置');
  console.error('请执行以下操作之一:');
  console.error('1. 在.env文件中设置有效的ALIYUN_API_KEY');
  console.error('2. 在系统环境变量中配置ALIYUN_API_KEY');
  console.error('3. 在Vercel控制台中设置ALIYUN_API_KEY环境变量');
  console.error('当前API_KEY值:', API_KEY);
}

// 频率限制
const generateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 参数验证函数
function validateGenerateParams(prompt, style) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return '缺少或非法的 prompt 参数';
  }
  if (prompt.length > 500) {
    return 'prompt 参数过长，最大500字符';
  }
  if (!style || typeof style !== 'string') {
    return '缺少或非法的 style 参数';
  }
  const validStyles = ['realistic', 'cartoon', 'sketch', 'anime'];
  if (!validStyles.includes(style)) {
    return `style 参数必须是以下之一: ${validStyles.join(', ')}`;
  }
  return null;
}

function validateStatusParams(taskId) {
  if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
    return '缺少或非法的 taskId 参数';
  }
  return null;
}

// 生成图片接口 - 与前端匹配的端点
app.post('/api/generate', generateLimit, async (req, res) => {
  const { prompt, style } = req.body;
  let requestData = null;

  // 参数验证
  const validationError = validateGenerateParams(prompt, style);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
      console.log(`[生成请求] prompt: ${prompt.substring(0, 50)}..., style: ${style}`);

      // 准备请求参数
      requestData = {
        model: 'wan2.2-t2i-plus',
        prompt: prompt.trim(),
        style,
        size: '1024x1024',
        n: 1,
        response_format: 'url'
      };

      console.log('准备发送请求到阿里云API:', ALIYUN_API_URL);
      console.log('请求参数:', requestData);
      console.log('使用的API_KEY前缀:', API_KEY.substring(0, 5));

      // 发送请求到阿里云API
      const response = await axios.post(
        ALIYUN_API_URL,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-DashScope-Async': 'enable'
          },
          timeout: 30000
        }
      );

      console.log('阿里云API响应:', response.data);

      // 处理响应
      const taskId = response.data.task_id || (response.data.output && response.data.output.task_id);
      if (taskId) {
        console.log(`[生成成功] 任务ID: ${taskId}`);
        res.json({
          success: true,
          taskId: taskId
        });
      } else {
        throw new Error('API返回数据格式不正确: 缺少task_id');
      }

    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || err.message;
      const errorDetails = {
        message: errorMessage,
        status: statusCode,
        data: err.response?.data || {},
        requestData: requestData,
        apiKeyPrefix: API_KEY.substring(0, 5),
        stack: err.stack
      };

      console.error('API调用错误详情:', JSON.stringify(errorDetails, null, 2));
      console.error('请求参数:', requestData);
      console.error('使用的API_KEY前缀:', API_KEY.substring(0, 5));
      console.error('错误堆栈:', err.stack);

      if (statusCode === 401) {
        res.status(500).json({
          error: 'API 认证失败，请检查API密钥',
          detail: errorMessage,
          apiKeyPrefix: API_KEY.substring(0, 5),
          requestData: requestData,
          errorDetails: err.response?.data || {}
        });
      } else if (statusCode === 429) {
        res.status(429).json({
          error: 'API 调用频率超限，请稍后再试',
          detail: errorMessage,
          errorDetails: err.response?.data || {}
        });
      } else if (statusCode >= 400 && statusCode < 500) {
        res.status(400).json({
          error: '请求参数错误',
          detail: errorMessage,
          errorDetails: err.response?.data || {}
        });
      } else {
        res.status(500).json({
          error: '生成图片失败',
          detail: errorMessage,
          errorDetails: errorDetails
        });
      }
    }
});

// 查询任务状态接口
app.post('/api/status', async (req, res) => {
  const { taskId } = req.body;

  // 参数验证
  const validationError = validateStatusParams(taskId);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    console.log(`[状态查询] 任务ID: ${taskId}`);

    const response = await axios.get(
      `${STATUS_API_URL}/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // 检查响应数据结构
    const taskStatus = response.data.output?.task_status || response.data.task_status || 'UNKNOWN';
    console.log(`[状态更新] 任务ID: ${taskId}, 状态: ${taskStatus}`);

    // 获取图片URL
    let imageUrl = null;
    if (response.data.output?.results && response.data.output.results.length > 0) {
      imageUrl = response.data.output.results[0].url;
    }

    const resultData = {
      ...(response.data.output?.result || {}),
      images: response.data.output?.results || null,
      imageUrl: imageUrl || null
    };

    res.json({
      success: true,
      status: taskStatus,
      result: resultData
    });

  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;

    console.error('[状态查询失败]', statusCode, errorMessage);

    res.status(500).json({ error: '查询任务状态失败', detail: errorMessage });
  }
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 环境变量查看接口 - 增强版
app.get('/api/env', (req, res) => {
  res.json({
    aliyunApiKeyExists: !!process.env.ALIYUN_API_KEY,
    aliyunApiKeyLength: process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.length : 0,
    aliyunApiKeyPrefix: process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.substring(0, 5) : '',
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    allEnvKeys: Object.keys(process.env)
  });
});

// 简单的API密钥验证接口
app.get('/api/verify-api-key', (req, res) => {
  try {
    const isValid = !!process.env.ALIYUN_API_KEY && process.env.ALIYUN_API_KEY.length > 0 && process.env.ALIYUN_API_KEY !== 'your-aliyun-api-key';
    res.json({
      isValid: isValid,
      apiKeyLength: process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.length : 0,
      apiKeyPrefix: process.env.ALIYUN_API_KEY ? process.env.ALIYUN_API_KEY.substring(0, 5) : '',
      message: isValid ? 'API密钥验证通过' : 'API密钥无效或未设置'
    });
  } catch (error) {
    res.status(500).json({
      isValid: false,
      error: error.message
    });
  }
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

// 本地开发时才监听端口
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 导出Express应用实例供Vercel使用
module.exports = app;
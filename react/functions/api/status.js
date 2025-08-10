const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const ALIYUN_STATUS_API_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks/status';
const API_KEY = process.env.ALIYUN_API_KEY || 'sk-4ae06338bd6f4f958ad46a1c74f37e8f';

// 频率限制：每分钟最多30次状态查询
const statusLimit = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 30, // 最多30次
  message: { error: '状态查询请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(statusLimit);

// 参数验证函数
function validateStatusParams(task_id) {
  if (!task_id || typeof task_id !== 'string' || task_id.trim().length === 0) {
    return '缺少或非法的 task_id 参数';
  }
  // 假设 task_id 格式为数字或字母数字组合，长度在10-50之间
  if (task_id.length < 10 || task_id.length > 50) {
    return 'task_id 格式错误';
  }
  if (!/^[a-zA-Z0-9\-_]+$/.test(task_id)) {
    return 'task_id 只能包含字母、数字、下划线和短横线';
  }
  return null;
}

router.post('/', async (req, res) => {
  const { task_id } = req.body;
  
  // 参数验证
  const validationError = validateStatusParams(task_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    console.log(`[状态查询] task_id: ${task_id}`);
    
    const response = await axios.post(
      ALIYUN_STATUS_API_URL,
      { task_id: task_id.trim() },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒超时
      }
    );
    
    console.log(`[状态查询成功] task_id: ${task_id}, status: ${response.data?.task_status || 'unknown'}`);
    res.json(response.data);
    
  } catch (err) {
    // 详细错误处理
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;
    const errorDetail = err.response?.data || err.message;
    
    console.error('[状态查询失败]', {
      status: statusCode,
      message: errorMessage,
      detail: errorDetail,
      task_id: task_id
    });
    
    // 根据错误类型返回不同信息
    if (statusCode === 401) {
      res.status(500).json({ error: 'API 认证失败，请联系管理员' });
    } else if (statusCode === 404) {
      res.status(404).json({ error: '任务不存在或已过期' });
    } else if (statusCode === 429) {
      res.status(429).json({ error: 'API 调用频率超限，请稍后再试' });
    } else if (statusCode >= 400 && statusCode < 500) {
      res.status(400).json({ error: '请求参数错误', detail: errorMessage });
    } else {
      res.status(500).json({ error: '状态查询服务暂时不可用，请稍后再试' });
    }
  }
});

module.exports = router;
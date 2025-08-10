const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = require('express').Router();

const ALIYUN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const STATUS_API_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks'; // 任务状态查询API
const API_KEY = process.env.ALIYUN_API_KEY || 'sk-4ae06338bd6f4f958ad46a1c74f37e8f';

// 频率限制：每分钟最多10次生成请求
const generateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 最多10次
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(generateLimit);

// 参数验证函数 - 生成图片
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

// 参数验证函数 - 查询状态
function validateStatusParams(taskId) {
  if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
    return '缺少或非法的 taskId 参数';
  }
  return null;
}

// 生成图片接口
router.post('/generate-image', async (req, res) => {
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
      model: 'wanx-v1',
      input: {
        prompt: prompt.trim(),
        style,
        size: '1024x1024',
        n: 1
      },
      parameters: {
        response_format: 'url'
      }
    };

    console.log(`[请求调试] 模型版本: ${requestData.model}, 参数: ${JSON.stringify(requestData.parameters)}`);
    console.log(`[权限调试] API密钥: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 5)}`);
    console.log(`[API端点调试] URL: ${ALIYUN_API_URL}`);
    console.log(`[调用模式] 异步调用(添加X-DashScope-Async请求头)`);
    
    console.log(`[请求数据] ${JSON.stringify(requestData).substring(0, 200)}...`);
    
    // 发送请求到阿里云API - 第一步：创建任务获取任务ID
    const response = await axios.post(
      ALIYUN_API_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-DashScope-Async': 'enable' // 关键：添加异步请求头
        },
        timeout: 30000
      }
    );
    
    console.log(`[生成响应] 状态码: ${response.status}, 数据: ${JSON.stringify(response.data).substring(0, 200)}...`);
    
    // 处理响应 - 支持新旧两种API响应格式
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
    // 详细错误处理
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;
    const errorDetail = err.response?.data || err;
    
    console.error('[生成失败]', {
      status: statusCode,
      message: errorMessage,
      detail: JSON.stringify(errorDetail),
      prompt: prompt?.substring(0, 50),
      url: ALIYUN_API_URL,
      requestBody: requestData ? JSON.stringify(requestData) : '请求数据未定义'
    });
    
    // 根据错误类型返回不同信息
    if (statusCode === 401) {
      res.status(500).json({ error: 'API 认证失败，请检查API密钥' });
    } else if (statusCode === 429) {
      res.status(429).json({ error: 'API 调用频率超限，请稍后再试' });
    } else if (statusCode >= 400 && statusCode < 500) {
      res.status(400).json({
        error: '请求参数错误', 
        detail: errorMessage,
        apiResponse: errorDetail
      });
    } else {
      res.status(500).json({
        error: '生成图片失败', 
        detail: errorMessage,
        apiResponse: errorDetail
      });
    }
  }
});

// 查询任务状态接口
router.post('/status', async (req, res) => {
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
        timeout: 30000 // 30秒超时
      }
    );

    // 检查响应数据结构，支持不同格式的状态字段
    const taskStatus = response.data.output?.task_status || response.data.task_status || response.data.state || response.data.status || 'UNKNOWN';
    console.log(`[状态更新] 任务ID: ${taskId}, 状态: ${taskStatus}`);
    console.log(`[完整响应] ${JSON.stringify(response.data)}`);

    // 从正确的字段中获取图片URL: output.results
    let imageUrl = null;
    if (response.data.output?.results && response.data.output.results.length > 0) {
      imageUrl = response.data.output.results[0].url;
      console.log(`[图片URL] 找到图片URL: ${imageUrl.substring(0, 50)}...`);
    } else {
      console.log('[图片URL] 未找到图片URL');
    }

    // 构造result对象
    const resultData = {
      ...(response.data.output?.result || response.data.result || {}),
      images: response.data.output?.results || null,
      imageUrl: imageUrl || null
    };

    res.json({
      success: true,
      status: taskStatus,
      result: resultData,
      debug: {
        responseDataKeys: Object.keys(response.data),
        hasOutput: !!response.data.output,
        hasResults: !!response.data.output?.results,
        resultsCount: response.data.output?.results?.length || 0
      }
    });

  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;

    console.error('[状态查询失败]', {
      status: statusCode,
      message: errorMessage,
      taskId: taskId
    });

    res.status(500).json({ error: '查询任务状态失败', detail: errorMessage });
  }
});

module.exports = router;
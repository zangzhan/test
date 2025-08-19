const express = require('express');
const axios = require('axios');
require('dotenv').config({ path: ['.env.local', '.env'] });

const app = express();
app.use(express.json());

// 简化的服务器配置
const API_KEY = process.env.ALIYUN_API_KEY || '';
const ALIYUN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const STATUS_API_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// 支持的模型列表
const SUPPORTED_MODELS = {
  'turbo': 'wanx2.1-t2i-turbo',
  'plus': 'wanx2.1-t2i-plus'
};

console.log('简化服务器启动...');
console.log('API_KEY长度:', API_KEY.length);
console.log('API_URL:', ALIYUN_API_URL);

// 查询任务状态接口
app.get('/api/task-status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log(`查询任务状态: ${taskId}`);

    // 调用阿里云任务状态查询API
    const response = await axios.get(`${STATUS_API_URL}/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('任务状态响应:', response.data);

    // 构建包含图像URL的响应
    const taskStatus = response.data.output?.task_status;
    let responseData = { status: taskStatus };

    if (taskStatus === 'SUCCEEDED') {
      // 提取图像URL
      const imageUrl = response.data.output?.results?.[0]?.url;
      responseData = {
        status: 'SUCCEEDED',
        data: {
          images: [{ url: imageUrl }]
        }
      };
    } else if (taskStatus === 'FAILED') {
      responseData = {
        status: 'FAILED',
        error: response.data.output?.message || '任务失败'
      };
    }

    res.json(responseData);
  } catch (error) {
    console.error('查询任务状态错误:', error.response?.status);
    console.error('错误数据:', error.response?.data);
    res.status(error.response?.status || 500).json({
      success: false,
      error: '查询任务状态失败',
      details: error.response?.data || error.message
    });
  }
});

// 简化的生成图片接口
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, style } = req.body;
    console.log('收到请求:', { prompt, style });

    // 准备请求参数
    const requestData = {
      model: 'wanx2.1-t2i-plus', // 使用正确的模型名称
      input: {
        prompt: prompt.trim(),
        style: style || 'realistic'
      },
      parameters: {
        size: '1024*1024',
        n: 1
      }
    };

    console.log('请求参数:', requestData);

    // 发送异步请求到阿里云API
    const response = await axios.post(ALIYUN_API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable' // 启用异步模式
      }
    });

    console.log('任务创建成功:', response.data);
    const taskId = response.data.output?.task_id;

    if (!taskId) {
      throw new Error('未获取到任务ID');
    }

    // 返回任务ID，让客户端轮询结果
    res.json({ success: true, task_id: taskId });

    // 记录响应状态和数据
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
  } catch (error) {
    console.error('错误状态:', error.response?.status);
    console.error('错误数据:', error.response?.data);
    console.error('错误堆栈:', error.stack);

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`简化服务器运行在 http://localhost:${PORT}`);
});
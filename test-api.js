const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 检查后端服务器是否可达
async function checkBackendHealth() {
  try {
    console.log('检查后端健康状态...');
    const response = await axios.get('http://localhost:3001/health', {
      timeout: 5000
    });
    console.log('后端健康状态:', response.data);
    return true;
  } catch (error) {
    console.error('后端健康检查失败:', error.message);
    return false;
  }
}

// 测试生成图片API
async function testGenerateImage() {
  try {
    console.log('测试生成图片API...');
    const response = await axios.post('http://localhost:3001/api/generate-image', {
      prompt: '一只在月球喝茶的猫',
      style: 'realistic'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('生成图片API响应:', response.data);
    return response.data.taskId;
  } catch (error) {
    console.error('生成图片API错误:', error.message);
    console.error('错误详情:', error.response?.data);
    console.error('错误堆栈:', error.stack);
    return null;
  }
}

// 查询任务状态API
async function testCheckStatus(taskId) {
  try {
    console.log(`查询任务状态 [${taskId}]...`);
    const response = await axios.post('http://localhost:3001/api/status', {
      taskId: taskId
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('任务状态响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('查询任务状态错误:', error.message);
    console.error('错误详情:', error.response?.data);
    return null;
  }
}

// 轮询任务状态
async function pollTaskStatus(taskId) {
  let attempts = 0;
  const maxAttempts = 15;
  const interval = 5000; // 5秒轮询一次，减少API调用频率

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`第 ${attempts} 次轮询任务状态`);
    try {
      const statusResponse = await testCheckStatus(taskId);

      if (!statusResponse) {
        console.error('轮询失败，无法获取任务状态');
        await new Promise(resolve => setTimeout(resolve, interval));
        continue;
      }

      console.log('任务状态响应:', statusResponse); // 打印完整响应

      // 检查各种可能的图片URL路径
      let imageUrl = null;
      if (statusResponse.result?.images?.[0]?.url) {
        imageUrl = statusResponse.result.images[0].url;
        console.log('找到图片URL (路径1):', imageUrl);
      } else if (statusResponse.result?.url) {
        imageUrl = statusResponse.result.url;
        console.log('找到图片URL (路径2):', imageUrl);
      } else if (statusResponse.result?.output?.url) {
        imageUrl = statusResponse.result.output.url;
        console.log('找到图片URL (路径3):', imageUrl);
      } else if (statusResponse.output?.result?.url) {
        imageUrl = statusResponse.output.result.url;
        console.log('找到图片URL (路径4):', imageUrl);
      } else if (statusResponse.output?.url) {
        imageUrl = statusResponse.output.url;
        console.log('找到图片URL (路径5):', imageUrl);
      } else if (statusResponse.data?.images?.[0]?.url) {
        imageUrl = statusResponse.data.images[0].url;
        console.log('找到图片URL (路径6):', imageUrl);
      } else if (statusResponse.data?.url) {
        imageUrl = statusResponse.data.url;
        console.log('找到图片URL (路径7):', imageUrl);
      } else {
        console.log('未找到图片URL');
      }

      // 接受更多可能的成功状态值
      const successStatuses = ['SUCCEEDED', 'COMPLETED', 'SUCCESS'];
      if (successStatuses.includes(statusResponse.status)) {
        console.log('任务成功完成！');
        if (imageUrl) {
          console.log('最终图片URL:', imageUrl);
        } else {
          console.log('图片URL:', statusResponse.result?.images?.[0]?.url || '未找到');
        }
        return statusResponse.result;
      } else if (statusResponse.status === 'FAILED' || statusResponse.status === 'ERROR') {
        console.error('任务失败:', statusResponse.result?.error_message || '未知错误');
        break;
      } else if (statusResponse.status === 'PENDING' || statusResponse.status === 'RUNNING') {
        console.log(`任务正在进行中: ${statusResponse.status}`);
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        console.log(`未知状态: ${statusResponse.status}`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } catch (error) {
      console.error('查询任务状态错误:', error.message);
      console.error('错误详情:', error.response?.data || error);
      // 不立即停止，而是继续尝试
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  if (attempts >= maxAttempts) {
    console.error('轮询超时，任务可能仍在处理中');
  }
  return null;
}

// 运行测试
async function runTest() {
  const isHealthy = await checkBackendHealth();
  if (isHealthy) {
    const taskId = await testGenerateImage();
    if (taskId) {
      await pollTaskStatus(taskId);
    } else {
      console.log('生成图片API调用失败，无法获取任务ID');
    }
  } else {
    console.log('后端服务器不可达，测试中止。');
  }
}

runTest();
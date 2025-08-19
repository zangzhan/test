const axios = require('axios');

// 测试异步API调用流程
async function testAsyncApi() {
  try {
    // 1. 创建图像生成任务
    const createTaskResponse = await axios.post('http://localhost:3002/api/generate', {
      prompt: 'test image',
      style: 'realistic'
    });

    console.log('任务创建响应:', createTaskResponse.data);
    const taskId = createTaskResponse.data.task_id;
    if (!taskId) {
      console.error('未获取到任务ID');
      return;
    }

    console.log(`任务ID: ${taskId}，开始轮询任务状态...`);

    // 2. 轮询任务状态
    let taskStatus = 'PENDING';
    let maxAttempts = 30; // 最多轮询30次
    let attempts = 0;
    let taskResult = null;

    while (taskStatus !== 'SUCCEEDED' && taskStatus !== 'FAILED' && attempts < maxAttempts) {
      attempts++;
      console.log(`第 ${attempts} 次轮询...`);

      try {
        const statusResponse = await axios.get(`http://localhost:3002/api/task-status/${taskId}`);
        taskResult = statusResponse.data;
        taskStatus = taskResult.output?.task_status || 'PENDING';

        console.log(`任务状态: ${taskStatus}`);

        if (taskStatus === 'SUCCEEDED') {
          console.log('任务成功完成!');
          console.log('图像URL:', taskResult.data?.images?.[0]?.url);
          break;
        } else if (taskStatus === 'FAILED') {
          console.error('任务失败:');
          console.error('错误信息:', taskResult.error);
          break;
        }
      } catch (error) {
        console.error('轮询错误:', error.message);
      }

      // 等待5秒后再次轮询
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    if (attempts >= maxAttempts) {
      console.error('轮询超时，任务可能仍在处理中');
    }
  } catch (error) {
    console.error('测试错误:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

// 运行测试
console.log('开始测试异步API调用...');
testAsyncApi();
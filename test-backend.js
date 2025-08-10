const axios = require('axios');

// 测试生成图片API
async function testGenerateImage() {
  try {
    const response = await axios.post('http://localhost:3001/api/generate-image', {
      prompt: '一只在月球喝茶的猫',
      style: 'realistic'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('生成图片API响应:', response.data);
    return response.data.taskId;
  } catch (error) {
    console.error('生成图片API错误:', error.response?.data || error.message);
  }
}

// 测试查询状态API
async function testCheckStatus(taskId) {
  try {
    const response = await axios.post('http://localhost:3001/api/status', {
      taskId: taskId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('查询状态API响应:', response.data);
  } catch (error) {
    console.error('查询状态API错误:', error.response?.data || error.message);
  }
}

// 运行测试
async function runTest() {
  console.log('开始测试后端API...');
  const taskId = await testGenerateImage();
  
  if (taskId) {
    console.log('等待3秒后查询任务状态...');
    setTimeout(() => {
      testCheckStatus(taskId);
    }, 3000);
  }
}

runTest();
const axios = require('axios');

// 测试数据
const testData = {
  prompt: 'test image',
  style: 'realistic', // 注意：server.js中validStyles包括'realistic'但不包括'real'
  size: '1024x1024',
  n: 1
};

console.log('Sending test request to http://localhost:3001/api/generate-image');
console.log('Test data:', testData);

// 发送请求
axios.post('http://localhost:3001/api/generate-image', testData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response data:', response.data);
  
  // 如果成功获取任务ID，查询任务状态
  if (response.data.success && response.data.taskId) {
    console.log(`获取任务ID成功: ${response.data.taskId}`);
    console.log('开始查询任务状态...');
    checkTaskStatus(response.data.taskId);
  }
})
.catch(error => {
    console.error('Error status:', error.response ? error.response.status : 'N/A');
    console.error('Error statusText:', error.response ? error.response.statusText : 'N/A');
    console.error('Error headers:', error.response ? JSON.stringify(error.response.headers, null, 2) : 'N/A');
    console.error('Error data:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    console.error('Error config:', error.config);
    console.error('Error stack:', error.stack);
  });

// 查询任务状态函数
function checkTaskStatus(taskId) {
  axios.post('http://localhost:3001/api/status', { taskId }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('任务状态查询结果:', response.data);
    
    if (response.data.success) {
      if (response.data.status === 'SUCCEEDED') {
        console.log('任务成功完成!');
        console.log('图片URL:', response.data.result.imageUrl);
      } else if (response.data.status === 'FAILED') {
        console.error('任务失败:', response.data.result);
      } else {
        console.log(`任务状态: ${response.data.status}, 3秒后再次查询...`);
        setTimeout(() => checkTaskStatus(taskId), 3000);
      }
    } else {
      console.error('查询任务状态失败:', response.data.error);
    }
  })
  .catch(error => {
    console.error('查询任务状态出错:', error.response ? error.response.data : error.message);
  });
}
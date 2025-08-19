// AI图像生成服务
// 调用后端 Node.js 代理，转发到阿里云文生图API

export interface ImageGenerationRequest {
  prompt: string
  style: string
}

export interface ImageGenerationResponse {
  url: string
  id: string
}

// 风格提示词映射
const stylePrompts = {
  realistic: 'realistic, high quality, detailed',
  artistic: 'artistic, oil painting style, creative',
  cartoon: 'cartoon, cute, colorful, animated',
  anime: 'anime style, Japanese animation, detailed',
  fantasy: 'fantasy, magical, mystical, ethereal',
  minimalist: 'minimalist, simple, clean, modern'
}

// 调用后端 API 生成图像
export const generateImage = async (
  prompt: string, 
  style: string
): Promise<{ taskId: string }> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '网络错误' }));
      throw new Error(errorData.error || '图片生成失败');
    }
    
    const data = await response.json();
    
    // 返回任务ID用于后续查询
    return {
      taskId: data.taskId
    };
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}

// 查询任务状态
export const checkTaskStatus = async (taskId: string) => {
  try {
    const response = await fetch(`/api/task-status/${taskId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '网络错误' }));
      throw new Error(errorData.error || '状态查询失败');
    }
    
    return response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
}

// 实际项目中的API配置示例
export const API_CONFIG = {
  // 这里可以配置真实的AI图像生成API
  // 例如：OpenAI DALL-E, Stable Diffusion, Midjourney等
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  apiKey: import.meta.env.VITE_API_KEY || '',
  
  // 支持的模型
  models: {
    dallE: 'dall-e-3',
    stableDiffusion: 'stable-diffusion-xl',
    midjourney: 'midjourney-v6'
  }
}

// 真实API调用示例（需要配置API密钥）
export const generateImageWithRealAPI = async (
  prompt: string,
  style: string
): Promise<ImageGenerationResponse> => {
  const fullPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts] || ''}`
  
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        model: API_CONFIG.models.dallE,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      })
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      url: data.data[0].url,
      id: data.created
    }
  } catch (error) {
    console.error('Real API error:', error)
    throw error
  }
}
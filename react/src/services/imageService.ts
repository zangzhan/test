// 模拟图像生成服务
// 在实际项目中，这里会调用真实的AI图像生成API

export interface ImageGenerationRequest {
  prompt: string
  style: string
}

export interface ImageGenerationResponse {
  url: string
  id: string
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 风格提示词映射
const stylePrompts = {
  realistic: 'realistic, high quality, detailed',
  artistic: 'artistic, oil painting style, creative',
  cartoon: 'cartoon, cute, colorful, animated',
  anime: 'anime style, Japanese animation, detailed',
  fantasy: 'fantasy, magical, mystical, ethereal',
  minimalist: 'minimalist, simple, clean, modern'
}

// 模拟图像生成
export const generateImage = async (
  prompt: string, 
  style: string
): Promise<ImageGenerationResponse> => {
  // 模拟API调用延迟
  await delay(2000 + Math.random() * 3000)
  
  // 使用Unsplash API获取随机图像作为演示
  // 在实际项目中，这里会调用真实的AI图像生成API
  const searchQuery = encodeURIComponent(prompt)
  
  try {
    // 这里使用Unsplash的随机图像API作为演示
    // 在实际项目中，应该替换为真实的AI图像生成API
    const response = await fetch(
      `https://source.unsplash.com/random/512x512/?${searchQuery}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to generate image')
    }
    
    // 获取图像URL
    const imageUrl = response.url
    
    return {
      url: imageUrl,
      id: Date.now().toString()
    }
  } catch (error) {
    console.error('Image generation error:', error)
    
    // 如果API调用失败，返回一个占位符图像
    return {
      url: `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent(prompt)}`,
      id: Date.now().toString()
    }
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
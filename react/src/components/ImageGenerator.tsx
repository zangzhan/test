import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Wand2, Download, RefreshCw, Image as ImageIcon } from 'lucide-react'
import PromptInput from './PromptInput'
import ImageDisplay from './ImageDisplay'
import StyleSelector from './StyleSelector'
import { generateImage, checkTaskStatus } from '../services/imageService'

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入描述文字')
      return
    }

    setIsGenerating(true)
    
    try {
      // 1. 获取任务ID
      const { taskId } = await generateImage(prompt, selectedStyle)
      toast.success('图像生成任务已提交，正在处理...')
      
      // 2. 轮询任务状态
      const pollStatus = async () => {
        try {
          const statusResponse = await checkTaskStatus(taskId)
          
          if (statusResponse.status === 'completed') {
            // 任务完成，获取图像URL
            const newImage: GeneratedImage = {
              id: Date.now().toString(),
              url: statusResponse.url,
              prompt,
              style: selectedStyle,
              timestamp: new Date()
            }
            
            setGeneratedImages(prev => [newImage, ...prev])
            setCurrentImage(newImage)
            toast.success('图像生成成功！')
            setIsGenerating(false)
          } else if (statusResponse.status === 'failed') {
            // 任务失败
            toast.error('图像生成失败: ' + (statusResponse.error || '未知错误'))
            setIsGenerating(false)
          } else {
            // 任务仍在处理中，继续轮询
            setTimeout(pollStatus, 3000) // 每3秒轮询一次
          }
        } catch (error) {
          console.error('查询任务状态失败:', error)
          toast.error('查询任务状态失败，请重试')
          setIsGenerating(false)
        }
      }
      
      // 开始轮询
      pollStatus()
    } catch (error) {
      console.error('提交图像生成任务失败:', error)
      toast.error('提交图像生成任务失败，请重试')
      setIsGenerating(false)
    }
  }

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `ai-generated-${image.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('图像下载成功！')
  }

  const handleRegenerate = () => {
    if (currentImage) {
      setPrompt(currentImage.prompt)
      setSelectedStyle(currentImage.style)
      handleGenerate()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 输入区域 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          创建你的图像
        </h2>
        
        <div className="space-y-4">
          <PromptInput 
            value={prompt}
            onChange={setPrompt}
            placeholder="描述你想要生成的图像，例如：一只可爱的小猫在花园里玩耍"
          />
          
          <StyleSelector 
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
          
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成图像
                </>
              )}
            </button>
            
            {currentImage && (
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                重新生成
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 当前图像显示 */}
      {currentImage && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">最新生成的图像</h3>
            <button
              onClick={() => handleDownload(currentImage)}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载
            </button>
          </div>
          <ImageDisplay image={currentImage} />
        </div>
      )}

      {/* 历史图像 */}
      {generatedImages.length > 1 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">历史图像</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.slice(1).map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleDownload(image)}
                    className="opacity-0 group-hover:opacity-100 btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!currentImage && !isGenerating && (
        <div className="card p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            开始创建你的图像
          </h3>
          <p className="text-gray-500">
            在上方输入描述文字，选择风格，然后点击生成按钮
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageGenerator
import { GeneratedImage } from './ImageGenerator'
import { Calendar, Tag } from 'lucide-react'

interface ImageDisplayProps {
  image: GeneratedImage
}

const ImageDisplay = ({ image }: ImageDisplayProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStyleName = (styleId: string) => {
    const styleMap: Record<string, string> = {
      realistic: '写实风格',
      artistic: '艺术风格',
      cartoon: '卡通风格',
      anime: '动漫风格',
      fantasy: '奇幻风格',
      minimalist: '极简风格'
    }
    return styleMap[styleId] || styleId
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-800 mb-1">描述</h4>
          <p className="text-gray-600 text-sm">{image.prompt}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            <span>{getStyleName(image.style)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(image.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageDisplay 
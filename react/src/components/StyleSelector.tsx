import { Palette } from 'lucide-react'

interface StyleSelectorProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
}

const styles = [
  { id: 'realistic', name: '写实风格', description: '逼真的照片效果' },
  { id: 'artistic', name: '艺术风格', description: '油画、水彩等艺术效果' },
  { id: 'cartoon', name: '卡通风格', description: '可爱的卡通形象' },
  { id: 'anime', name: '动漫风格', description: '日式动漫风格' },
  { id: 'fantasy', name: '奇幻风格', description: '魔法、科幻效果' },
  { id: 'minimalist', name: '极简风格', description: '简洁现代的设计' }
]

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        图像风格
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedStyle === style.id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4" />
              <span className="font-medium text-sm">{style.name}</span>
            </div>
            <p className="text-xs text-gray-600">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StyleSelector 
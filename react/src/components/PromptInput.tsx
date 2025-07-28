import { FileText } from 'lucide-react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const PromptInput = ({ value, onChange, placeholder }: PromptInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        图像描述
      </label>
      <div className="relative">
        <<FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" /> />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10 pr-3 py-3 h-24 resize-none"
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {value.length}/500
        </div>
      </div>
    </div>
  )
}

export default PromptInput 
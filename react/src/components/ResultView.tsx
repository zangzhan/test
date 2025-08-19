import React, { useState } from "react";
import { motion } from "framer-motion";

interface ResultViewProps {
  imageUrl?: string;
  prompt?: string;
  style?: string;
  loading?: boolean;
  error?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  imageUrl,
  prompt,
  style,
  loading = false,
  error,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 下载图片函数
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = prompt ? `${prompt}.png` : "ai-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 风格映射到中文名称
  const styleMap: Record<string, string> = {
    'realistic': '写实',
    'cartoon': '卡通',
    'sketch': '素描',
    'anime': '二次元',
    'oil': '油画',
    'watercolor': '水彩'
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] bg-gray-800/50 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm overflow-hidden relative">
      {loading ? (
        <div className="text-center">
          <motion.div
            className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            className="text-blue-400 text-lg font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            图片生成中...
          </motion.span>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-900/20 rounded-xl border border-red-800/30 w-full max-w-md">
          <motion.span
            className="text-red-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.span>
        </div>
      ) : imageUrl ? (
        <motion.div
          className="w-full flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative max-w-full max-h-[300px] rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={imageUrl}
              alt={prompt || "生成图片"}
              className="max-w-full max-h-[300px] object-contain"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <button
                onClick={handleDownload}
                className="absolute bottom-4 right-4 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
              >
                下载图片
              </button>
            </motion.div>
          </div>

          {prompt && (
            <div className="w-full max-w-md mb-2 text-left">
              <span className="text-gray-400 text-sm">提示词：</span>
              <span className="text-gray-200 text-sm">{prompt}</span>
            </div>
          )}
          {style && (
            <div className="w-full max-w-md text-left">
              <span className="text-gray-400 text-sm">风格：</span>
              <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                {styleMap[style] || style}
              </span>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl w-full">
          <motion.span
            className="text-gray-500"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            图片将在这里展示
          </motion.span>
        </div>
      )}
    </div>
  );
};

export default ResultView;
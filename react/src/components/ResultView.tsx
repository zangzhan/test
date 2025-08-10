import React from "react";

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

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[300px] bg-white border rounded shadow p-4">
      {loading ? (
        <span className="text-blue-500 text-lg">图片生成中...</span>
      ) : error ? (
        <span className="text-red-500">{error}</span>
      ) : imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={prompt || "生成图片"}
            className="max-w-full max-h-72 rounded mb-2 border"
          />
          <button
            onClick={handleDownload}
            className="mb-2 px-4 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
          >
            下载图片
          </button>
          {prompt && (
            <div className="text-sm text-gray-500 mb-1">提示词：{prompt}</div>
          )}
          {style && (
            <div className="text-xs text-gray-400">风格：{style}</div>
          )}
        </>
      ) : (
        <span className="text-gray-400">图片将在这里展示</span>
      )}
    </div>
  );
};

export default ResultView; 
import { useState, useEffect } from 'react';
import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import { useGlobalLoading } from "./context/LoadingContext";
import { generateImage, checkTaskStatus } from "./services/imageService";
import ImageGallery from './components/ImageGallery';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// 模拟热门提示词数据
const hotPrompts = [
  "古风少女，手持团扇，站在桃花树下",
  "赛博朋克风格的城市夜景",
  "可爱的柯基犬，戴着墨镜，坐在沙滩上",
  "未来科技感的书房，有机器人助手"
];

// 模拟历史记录数据
const historyRecords = [
  { id: 1, prompt: "一只在月球上喝茶的猫", style: "cartoon", date: "2023-10-15" },
  { id: 2, prompt: "中世纪城堡，有龙在飞行", style: "realistic", date: "2023-10-14" },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState("realistic");
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('generate');
  const { loading, setLoading } = useGlobalLoading();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 加载示例图库
  useEffect(() => {
    // 这里可以从API加载示例图片
    const examples = [
      "https://placekitten.com/600/400",
      "https://placekitten.com/601/400",
      "https://placekitten.com/602/400",
      "https://placekitten.com/603/400",
      "https://placekitten.com/604/400",
      "https://placekitten.com/605/400",
    ];
    setGalleryImages(examples);
  }, []);

  const handlePromptChange = (val: string) => {
    setPrompt(val);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };

  const handlePromptSubmit = async () => {
    setLoading(true);
    setError(undefined);
    setImageUrl(undefined);
    setTaskId(undefined);
    setStatus(undefined);
    
    try {
      const data = await generateImage(prompt, style);
      setTaskId(data.taskId);
      setStatus('pending');
    } catch (error) {
      setError(error instanceof Error ? error.message : '图片生成失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  // 轮询任务状态
  useEffect(() => {
    if (!taskId || status === 'completed' || status === 'failed') return;

    const intervalId = setInterval(async () => {
      try {
        const result = await checkTaskStatus(taskId);
        console.log('完整的状态响应:', JSON.stringify(result));
        setStatus(result.status);

        // 尝试从不同路径获取图片URL
        let imageUrl = null;
        // 检查所有可能的URL路径
        if (result.result?.images?.[0]?.url) {
          imageUrl = result.result.images[0].url;
          console.log('找到图片URL (路径1):', imageUrl);
        } else if (result.result?.url) {
          imageUrl = result.result.url;
          console.log('找到图片URL (路径2):', imageUrl);
        } else if (result.result?.output?.url) {
          imageUrl = result.result.output.url;
          console.log('找到图片URL (路径3):', imageUrl);
        } else if (result.output?.result?.url) {
          imageUrl = result.output.result.url;
          console.log('找到图片URL (路径4):', imageUrl);
        } else if (result.output?.url) {
          imageUrl = result.output.url;
          console.log('找到图片URL (路径5):', imageUrl);
        } else if (result.data?.images?.[0]?.url) {
          imageUrl = result.data.images[0].url;
          console.log('找到图片URL (路径6):', imageUrl);
        } else if (result.data?.url) {
          imageUrl = result.data.url;
          console.log('找到图片URL (路径7):', imageUrl);
        } else if (result.result?.images) {
          // 后端修改后，图片URL可能直接在result.images中
          imageUrl = result.result.images[0].url;
          console.log('找到图片URL (路径8):', imageUrl);
        } else {
          console.log('未找到图片URL，响应结构:', JSON.stringify(result));
        }

        // 接受更多可能的成功状态值
        const successStatuses = ['SUCCEEDED', 'COMPLETED', 'SUCCESS'];
        if (successStatuses.includes(result.status) && imageUrl) {
          setImageUrl(imageUrl);
          clearInterval(intervalId);
        } else if (result.status === 'FAILED' || result.status === 'ERROR') {
          setError('图片生成失败: ' + (result.result?.error_message || '未知错误'));
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('查询任务状态失败:', error);
        clearInterval(intervalId);
      }
    }, 5000); // 每5秒查询一次，避免API限流

    return () => clearInterval(intervalId);
  }, [taskId, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* 顶部导航栏 */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 主要内容区域 */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'generate' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* 欢迎区域 */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  行雲流水，萬相皆成
                </h1>
                <p className="text-gray-400 text-lg">探索AI创作的无限可能</p>
              </div>

              {/* 提示词输入区域 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                <PromptInput
                  value={prompt}
                  onChange={handlePromptChange}
                  onSubmit={handlePromptSubmit}
                  placeholder="输入你的创意，例如：一只在月球上喝茶的猫"
                  className="mb-4"
                />

                {/* 风格选择器 */}
                <div className="mb-6">
                  <label htmlFor="style" className="block mb-2 text-lg font-medium text-gray-300">选择风格：</label>
                  <select
                    id="style"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={style}
                    onChange={handleStyleChange}
                    disabled={loading}
                  >
                    <option value="realistic">写实</option>
                    <option value="cartoon">卡通</option>
                    <option value="sketch">素描</option>
                    <option value="anime">二次元</option>
                    <option value="oil">油画</option>
                    <option value="watercolor">水彩</option>
                  </select>
                </div>

                {/* 热门提示词 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-3">热门提示词</h3>
                  <div className="flex flex-wrap gap-2">
                    {hotPrompts.map((hotPrompt, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(hotPrompt)}
                        className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600 text-sm rounded-full transition"
                      >
                        {hotPrompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 结果展示区域 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-200">生成结果</h2>
                <ResultView
                  imageUrl={imageUrl}
                  prompt={prompt}
                  style={style}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-200">作品画廊</h2>
              <ImageGallery images={galleryImages} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-200">历史记录</h2>
              <div className="space-y-4">
                {historyRecords.map(record => (
                  <div key={record.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-200 truncate max-w-[70%]">{record.prompt}</h3>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{record.style}</span>
                    </div>
                    <div className="text-xs text-gray-400">{record.date}</div>
                    <button
                      onClick={() => {
                        setPrompt(record.prompt);
                        setStyle(record.style);
                        setActiveTab('generate');
                      }}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      重新生成
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
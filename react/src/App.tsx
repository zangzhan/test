import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import ImageGenerator from './components/ImageGenerator'
import Header from './components/Header'
import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import { useGlobalLoading } from "./context/LoadingContext";
import { generateImage, checkTaskStatus } from "./services/imageService";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [style, setStyle] = useState("realistic");
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { loading, setLoading } = useGlobalLoading();

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-6 bg-white shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">AI 文生图生成器</h1>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl flex flex-col gap-6 items-center">
        {/* Prompt Input */}
        <section className="w-full">
          <PromptInput
            value={prompt}
            onChange={handlePromptChange}
            onSubmit={handlePromptSubmit}
            placeholder="例如：一只在月球上喝茶的猫"
          />
        </section>

        {/* Style Selector */}
        <section className="w-full">
          <label htmlFor="style" className="block mb-2 text-lg font-medium text-gray-700">选择风格：</label>
          <select
            id="style"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={style}
            onChange={handleStyleChange}
            disabled={loading}
          >
            <option value="realistic">写实</option>
            <option value="cartoon">卡通</option>
            <option value="sketch">素描</option>
            <option value="anime">二次元</option>
          </select>
        </section>

        {/* Image Display */}
        <section className="w-full">
          <ResultView
            imageUrl={imageUrl}
            prompt={prompt}
            style={style}
            loading={loading}
            error={error}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
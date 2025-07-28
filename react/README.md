# AI图像生成器

一个基于React和Vite的现代化AI图像生成网站，支持多种艺术风格，提供直观的用户界面来创建AI生成的图像。

## 功能特性

- 🎨 **多种艺术风格**: 支持写实、艺术、卡通、动漫、奇幻、极简等多种风格
- 📝 **智能提示词**: 优化的提示词输入界面，支持字符计数
- 🖼️ **图像展示**: 美观的图像展示界面，支持下载功能
- 📱 **响应式设计**: 完全响应式设计，支持移动端和桌面端
- ⚡ **快速开发**: 基于Vite构建，开发体验优秀
- 🎯 **TypeScript**: 完整的TypeScript支持，类型安全
- 🎨 **Tailwind CSS**: 现代化的UI设计系统

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **通知系统**: React Hot Toast
- **HTTP客户端**: Axios

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 页面头部
│   ├── ImageGenerator.tsx  # 主要图像生成组件
│   ├── PromptInput.tsx     # 提示词输入组件
│   ├── StyleSelector.tsx   # 风格选择器
│   └── ImageDisplay.tsx    # 图像显示组件
├── services/           # 服务层
│   └── imageService.ts # 图像生成服务
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
├── index.css          # 全局样式
└── vite-env.d.ts      # Vite环境变量类型
```

## 配置AI图像生成API

当前项目使用Unsplash API作为演示。要使用真实的AI图像生成API，请按以下步骤配置：

### 1. 创建环境变量文件

创建 `.env.local` 文件：

```env
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_KEY=your_api_key_here
```

### 2. 支持的AI服务

项目支持以下AI图像生成服务：

- **OpenAI DALL-E**: 高质量的AI图像生成
- **Stable Diffusion**: 开源的图像生成模型
- **Midjourney**: 艺术风格的图像生成

### 3. 修改API配置

在 `src/services/imageService.ts` 中修改API配置：

```typescript
// 使用真实的API调用
const imageData = await generateImageWithRealAPI(prompt, selectedStyle)
```

## 自定义样式

项目使用Tailwind CSS进行样式设计。主要自定义样式在 `src/index.css` 中定义：

- 自定义颜色主题
- 组件样式类
- 动画效果

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### Netlify部署

1. 构建项目：`npm run build`
2. 将 `dist` 文件夹部署到Netlify

## 开发指南

### 添加新风格

1. 在 `src/components/StyleSelector.tsx` 中添加新风格选项
2. 在 `src/services/imageService.ts` 中添加对应的提示词
3. 在 `src/components/ImageDisplay.tsx` 中添加风格名称映射

### 自定义组件

所有组件都使用TypeScript编写，支持完整的类型检查。组件采用函数式组件和Hooks模式。

## 贡献

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本发布
- 支持多种艺术风格
- 响应式设计
- TypeScript支持 
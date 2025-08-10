# 将项目部署到Vercel的指南

## 前提条件
1. 拥有GitHub账号
2. 拥有Vercel账号
3. 已安装Git

## 部署步骤

### 1. 将代码推送到GitHub
```bash
# 初始化Git仓库（如果尚未初始化）
git init
\# 添加所有文件
git add .
\# 提交更改
git commit -m "Initial commit"
\# 添加远程仓库
git remote add origin https://github.com/your-username/your-repo-name.git
\# 推送代码
git push -u origin main
```

### 2. 在Vercel中导入项目
1. 登录Vercel账号
2. 点击"New Project"
3. 选择"Import from Git Repository"
4. 选择你的GitHub仓库
5. 点击"Import"

### 3. 配置项目
1. 在"Configure Project"页面：
   - 确保"Framework Preset"选择为"Vite"
   - 检查构建命令是否为`npm run build`
   - 检查输出目录是否为`dist`
2. 点击"Deploy"

### 4. 配置环境变量
项目部署后，你需要在Vercel中配置环境变量：
1. 进入项目的"Settings"页面
2. 点击"Environment Variables"
3. 添加以下环境变量：
   - `VITE_API_BASE_URL`: 你的API基础URL
   - `ALIYUN_API_KEY`: 你的阿里云API密钥

### 5. 完成部署
配置完成后，Vercel会自动重新部署你的项目。部署完成后，你可以访问提供的URL来查看你的应用。

## 注意事项
- Vercel的免费计划有一些限制，包括函数执行时间和API请求次数
- 确保你的API密钥安全，不要提交到代码仓库中
- 如果你需要自定义域名，可以在Vercel的设置中进行配置

## 故障排除
- 如果部署失败，检查Vercel控制台的构建日志以获取详细错误信息
- 确保你的代码中没有使用Vercel不支持的Node.js特性
- 如果你遇到API调用问题，检查环境变量是否正确配置
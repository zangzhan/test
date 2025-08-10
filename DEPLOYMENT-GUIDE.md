# Vercel部署指南

## 已完成的修改

1. **修复vercel.json配置**
   - 修正Node.js构建指向`server.js`
   - 配置静态构建命令为`npm run build`
   - 修复了JSON语法错误（重复的dest属性）
   - 优化路由规则
   - 移除硬编码的环境变量

2. **修复server.js文件**
   - 添加缺失的express引入
   - 恢复被误删除的API路由挂载代码

3. **安全处理API密钥**
   - 从`generate.js`中移除硬编码的API密钥
   - 添加环境变量检查逻辑
   - 当密钥缺失时提供明确错误信息

4. **创建部署验证脚本**
   - 生成`verify-env.js`脚本用于检查环境变量和依赖

## 部署到Vercel的步骤

1. **提交代码到GitHub**
   ```bash
   git add .
   git commit -m "修复Vercel部署配置"
   git push origin main
   ```
   *如果遇到网络问题，可以尝试使用SSH协议替代HTTPS，或检查网络连接。*

2. **在Vercel控制台确认环境变量**
   - 登录Vercel账户并选择你的项目
   - 进入`设置 > 环境变量`
   - 确保已添加以下环境变量:
     - `ALIYUN_API_KEY`: 你的阿里云API密钥
     - `NODE_ENV`: `production`

3. **触发重新部署**
   - 进入Vercel项目的`部署`标签
   - 点击`触发部署`按钮

4. **验证部署结果**
   - 部署完成后，访问应用URL
   - 测试`/health`接口确保服务正常运行
   - 测试`/api/generate-image`接口确保可以生成图片

## 故障排除

- 如果部署失败，检查Vercel部署日志以获取详细错误信息
- 如果遇到API密钥问题，确认Vercel环境变量配置正确
- 如果遇到依赖问题，确保`package.json`中包含所有必要的依赖
- 本地开发时，可以在项目根目录创建`.env`文件设置环境变量

## 本地开发环境设置

创建`.env`文件:
```
ALIYUN_API_KEY=你的阿里云API密钥
NODE_ENV=development
```

运行本地服务器:
```bash
cd react
node server.js
```

运行前端开发服务器:
```bash
cd react
npm run dev
```
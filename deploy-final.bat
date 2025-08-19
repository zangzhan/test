@echo off

:: 导航到项目目录
cd /d d:\文档\test\react

:: 检查 Vercel CLI 是否已安装
echo 检查 Vercel CLI 是否已安装...
vercel --version >nul 2>&1
if %errorLevel% NEQ 0 (
    echo Vercel CLI 未安装，请先运行: npm install -g vercel
    pause
    exit /b 1
)

:: 运行部署命令
echo 开始部署到 Vercel...
vercel --prod

:: 检查部署是否成功
if %errorLevel% NEQ 0 (
    echo 部署失败！
    pause
    exit /b 1
)

:: 部署成功
echo 部署成功！
pause
exit /b 0
@echo off

:: 检查是否以管理员身份运行
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo 请以管理员身份运行此批处理文件！
    pause
    exit /b 1
)

:: 检查 PowerShell 脚本是否存在
if not exist "d:\文档\test\deploy-to-vercel.ps1" (
    echo 未找到部署脚本：d:\文档\test\deploy-to-vercel.ps1
    pause
    exit /b 1
)

:: 设置 Vercel 令牌环境变量
:: 请将 <your-vercel-token> 替换为您的实际 Vercel 令牌
set VERCEL_TOKEN=<your-vercel-token>

:: 检查令牌是否已替换
if "%VERCEL_TOKEN%" == "<your-vercel-token>" (
    echo 错误：请先替换批处理文件中的 <your-vercel-token> 为您的实际 Vercel 令牌
    pause
    exit /b 1
)

:: 运行 PowerShell 脚本
powershell -File "d:\文档\test\deploy-to-vercel.ps1"

:: 检查部署是否成功
if %errorLevel% NEQ 0 (
    echo 部署失败！请查看上面的错误信息。
    pause
    exit /b 1
)

:: 部署成功
 echo 部署成功！
 pause
 exit /b 0
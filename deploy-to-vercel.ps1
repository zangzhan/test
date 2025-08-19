# Vercel 部署脚本

# 从环境变量获取 Vercel 令牌
$vercelToken = $env:VERCEL_TOKEN

if (-not $vercelToken) {
    Write-Host '请先设置 Vercel 令牌环境变量: $env:VERCEL_TOKEN = "your-token"'
    exit 1
}

# 设置环境变量
$env:VERCEL_TOKEN = $vercelToken

# 导航到项目目录
Set-Location -Path 'd:\文档\test\react'

# 运行 Vercel 部署命令
vercel --prod
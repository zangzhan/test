# Vercel 部署脚本 v2

# 检查 Vercel CLI 是否已安装
if (-not (Get-Command 'vercel' -ErrorAction SilentlyContinue)) {
    Write-Host 'Vercel CLI 未安装，请先运行: npm install -g vercel'
    exit 1
}

# 检查用户是否已登录 Vercel
$vercelLoginStatus = vercel whoami 2>$null
if (-not $vercelLoginStatus) {
    Write-Host '请先登录 Vercel: vercel login'
    exit 1
}

# 导航到项目目录
Set-Location -Path 'd:\文档\test\react'

# 运行部署命令
Write-Host '开始部署到 Vercel...'
vercel --prod

# 检查部署是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host '部署失败！'
    exit 1
}

Write-Host '部署成功！'
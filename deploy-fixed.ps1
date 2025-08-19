# 检查 Vercel CLI 是否已安装
Write-Host "检查 Vercel CLI 是否已安装..."
vercel --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel CLI 未安装，正在安装..."
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Vercel CLI 安装失败！"
        exit 1
    }
}

# 导航到项目目录
Set-Location -Path 'd:\文档\test\react'

# 运行部署命令
Write-Host "开始部署到 Vercel..."
vercel --prod

# 检查部署是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host "部署失败！"
    exit 1
}

Write-Host "部署成功！"
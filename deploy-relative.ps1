# Check if Vercel CLI is installed
Write-Host "Checking if Vercel CLI is installed..."
vercel --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel CLI is not installed, installing..."
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI!"
        exit 1
    }
}

# 使用环境变量中的Vercel Token进行认证
if (-not $env:VERCEL_TOKEN) {
    Write-Host "错误: 未设置VERCEL_TOKEN环境变量"
    Write-Host "请先设置环境变量: $env:VERCEL_TOKEN = 'your-vercel-token'"
    exit 1
}
Write-Host "使用环境变量中的Vercel Token进行认证..."

# Navigate to project directory using relative path
Write-Host "Navigating to project directory: react"
Set-Location -Path .\react

# Run deploy command with token and --yes to avoid interactive prompts
Write-Host "Starting deployment to Vercel..."
vercel --prod --yes --token $env:VERCEL_TOKEN

# Check if deployment succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!"
    exit 1
}

Write-Host "Deployment succeeded!"
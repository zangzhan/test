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

# Navigate to project directory
Set-Location -Path 'd:\文档\test\react'

# Run deploy command
Write-Host "Starting deployment to Vercel..."
vercel --prod

# Check if deployment succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!"
    exit 1
}

Write-Host "Deployment succeeded!"
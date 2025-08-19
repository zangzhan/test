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

# Define project path using double quotes and check if it exists
$projectPath = "d:\文档\test\react"
Write-Host "Checking if project path exists: $projectPath"
if (-not (Test-Path -Path $projectPath)) {
    Write-Host "Project path does not exist: $projectPath"
    exit 1
}

# Navigate to project directory
Write-Host "Navigating to project directory: $projectPath"
Set-Location -Path $projectPath

# Run deploy command
Write-Host "Starting deployment to Vercel..."
vercel --prod

# Check if deployment succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!"
    exit 1
}

Write-Host "Deployment succeeded!"
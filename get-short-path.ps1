# 获取项目路径的短路径形式
$longPath = "d:\文档\test\react"
Write-Host "原始路径: $longPath"

# 使用WMI获取短路径
$shortPath = (Get-WmiObject -Class Win32_Directory -Filter "Name='$($longPath.Replace('\', '\\'))'").ShortName

if ($shortPath) {
    Write-Host "短路径: $shortPath"
    # 输出到文件以便后续使用
    $shortPath | Out-File -FilePath "d:\文档\test\short-path.txt"
} else {
    Write-Host "无法获取短路径"
    exit 1
}
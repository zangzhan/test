@echo off
cls

rem 设置长路径
set "LONG_PATH=d:\文档\test\react"

echo 原始路径: %LONG_PATH%

echo 正在获取短路径...
for %%I in ("%LONG_PATH%") do set "SHORT_PATH=%%~sI"

echo 短路径: %SHORT_PATH%

echo %SHORT_PATH% > "d:\文档\test\short-path.txt"

echo 短路径已保存到 d:\文档\test\short-path.txt
pause
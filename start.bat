@echo off
set "PATH=%~dp0.tools\node20;%PATH%"
echo ========================================================
echo   Starting CivicResolve Production Server
echo   Application URL: http://localhost:5000
echo ========================================================
node .\node_modules\tsx\dist\cli.mjs server/index.ts


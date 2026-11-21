@echo off
set "PATH=%~dp0.tools\node20;%PATH%"
echo ========================================================
echo   Starting CivicResolve (Full-Stack Dev Environment)
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================================
node .\node_modules\concurrently\dist\bin\concurrently.js -k -n "server,client" -c "magenta,cyan" "node .\node_modules\tsx\dist\cli.mjs watch server/index.ts" "node .\node_modules\vite\bin\vite.js"


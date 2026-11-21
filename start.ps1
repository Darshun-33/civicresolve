$nodePath = Join-Path $PSScriptRoot ".tools\node20"
$env:Path = "$nodePath;$env:Path"

Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "  CivicResolve — AI-Powered Citizen Grievance Platform" -ForegroundColor Cyan
Write-Host "  Application URL: http://localhost:5000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Magenta

& "$nodePath\node.exe" .\node_modules\tsx\dist\cli.mjs server/index.ts


$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (-not (Test-Path "E:\")) {
  Write-Host "Disco E: nao encontrado. Ajuste o volume em docker-compose.n8n.yml."
  exit 1
}

New-Item -ItemType Directory -Force -Path "E:\npm-cache", "E:\lanchonete-n8n-data", "E:\tmp" | Out-Null
npm config set cache "E:\npm-cache"
$env:TEMP = "E:\tmp"
$env:TMP = "E:\tmp"

$ErrorActionPreference = "SilentlyContinue"
$null = docker info 2>&1
$dockerOk = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = "Stop"
if (-not $dockerOk) {
  Write-Host "Inicie o Docker Desktop e rode de novo: npm run n8n:up"
  Write-Host "Ou use: npm run n8n:npx"
  exit 1
}

docker compose -f docker-compose.n8n.yml pull
docker compose -f docker-compose.n8n.yml up -d
Write-Host "n8n: http://localhost:5678 | dados: E:\lanchonete-n8n-data"

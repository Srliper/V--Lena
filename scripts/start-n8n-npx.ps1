$ErrorActionPreference = "Stop"
if (-not (Test-Path "E:\")) {
  Write-Host "Disco E: nao encontrado. Edite este script."
  exit 1
}
New-Item -ItemType Directory -Force -Path "E:\npm-cache","E:\tmp","E:\lanchonete-n8n-user" | Out-Null
npm config set cache "E:\npm-cache"
$env:TEMP = "E:\tmp"
$env:TMP = "E:\tmp"
$env:N8N_USER_FOLDER = "E:\lanchonete-n8n-user"
Write-Host "http://localhost:5678"
npx --yes n8n

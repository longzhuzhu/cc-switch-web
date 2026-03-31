param(
  [string]$BindHost = "127.0.0.1",
  [int]$Port = 8788
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
$distDir = if ($env:CC_SWITCH_WEB_DIST_DIR) {
  $env:CC_SWITCH_WEB_DIST_DIR
} else {
  Join-Path $repoRoot "dist"
}
$binaryPath = Join-Path $repoRoot "src-tauri\target\release\cc-switch-web.exe"

if (-not (Test-Path $distDir)) {
  Write-Error "dist 目录不存在: $distDir"
  Write-Host "请先执行: pnpm build:web"
  exit 1
}

if (-not (Test-Path $binaryPath)) {
  Write-Error "服务二进制不存在: $binaryPath"
  Write-Host "请先执行: pnpm build:web:service"
  exit 1
}

$env:CC_SWITCH_WEB_HOST = $BindHost
$env:CC_SWITCH_WEB_PORT = "$Port"
$env:CC_SWITCH_WEB_DIST_DIR = (Resolve-Path $distDir).Path

Write-Host "cc-switch-web 正在启动: http://$BindHost`:$Port"
& $binaryPath
exit $LASTEXITCODE


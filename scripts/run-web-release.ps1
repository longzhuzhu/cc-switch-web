param(
  [string]$BindHost = "127.0.0.1",
  [int]$Port = 8788
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$packageRoot = $scriptDir
$defaultDistDir = Join-Path $packageRoot "dist"
$distDir = if ($env:CC_SWITCH_WEB_DIST_DIR) {
  $env:CC_SWITCH_WEB_DIST_DIR
} elseif (Test-Path $defaultDistDir) {
  $defaultDistDir
} else {
  $null
}
$binaryPath = Join-Path $packageRoot "cc-switch-web.exe"

if (-not (Test-Path $binaryPath)) {
  Write-Error "服务二进制不存在: $binaryPath"
  exit 1
}

$env:CC_SWITCH_WEB_HOST = $BindHost
$env:CC_SWITCH_WEB_PORT = "$Port"
if ($distDir) {
  $env:CC_SWITCH_WEB_DIST_DIR = (Resolve-Path $distDir).Path
} else {
  Remove-Item Env:CC_SWITCH_WEB_DIST_DIR -ErrorAction SilentlyContinue
}

Write-Host "CC Switch Web 已启动"
Write-Host "监听地址: $BindHost`:$Port"
Write-Host "访问地址: http://$BindHost`:$Port"
if ($distDir) {
  Write-Host "前端目录: $($env:CC_SWITCH_WEB_DIST_DIR)"
} else {
  Write-Host "前端资源: 内嵌到服务二进制"
}
Write-Host "服务二进制: $binaryPath"
if ($BindHost -eq "0.0.0.0") {
  Write-Host "当前绑定到 0.0.0.0，请使用服务器 IP 或本机地址访问"
}
Write-Host "按 Ctrl+C 停止服务"
Write-Host ""

& $binaryPath
exit $LASTEXITCODE

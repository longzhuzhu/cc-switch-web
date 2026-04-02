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
  Write-Error "Service binary not found: $binaryPath"
  exit 1
}

$env:CC_SWITCH_WEB_HOST = $BindHost
$env:CC_SWITCH_WEB_PORT = "$Port"
if ($distDir) {
  $env:CC_SWITCH_WEB_DIST_DIR = (Resolve-Path $distDir).Path
} else {
  Remove-Item Env:CC_SWITCH_WEB_DIST_DIR -ErrorAction SilentlyContinue
}

Write-Host "CC Switch Web started"
Write-Host "Bind address: $BindHost`:$Port"
Write-Host "Open in browser: http://$BindHost`:$Port"
if ($distDir) {
  Write-Host "Frontend directory: $($env:CC_SWITCH_WEB_DIST_DIR)"
} else {
  Write-Host "Frontend assets: embedded in the service binary"
}
Write-Host "Service binary: $binaryPath"
if ($BindHost -eq "0.0.0.0") {
  Write-Host "Bound to 0.0.0.0, use the server IP or local machine address to access it"
}
Write-Host "Press Ctrl+C to stop the service"
Write-Host ""

& $binaryPath
exit $LASTEXITCODE

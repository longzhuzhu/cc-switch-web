@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "REPO_ROOT=%%~fI"

set "DEFAULT_DIST_DIR=%REPO_ROOT%\dist"
if defined CC_SWITCH_WEB_DIST_DIR (
  set "DIST_DIR=%CC_SWITCH_WEB_DIST_DIR%"
) else (
  if exist "%DEFAULT_DIST_DIR%" (
    set "DIST_DIR=%DEFAULT_DIST_DIR%"
  ) else (
    set "DIST_DIR="
  )
)

set "BINARY_PATH=%REPO_ROOT%\backend\target\release\cc-switch-web.exe"

if not exist "%BINARY_PATH%" (
  echo Service binary not found: %BINARY_PATH%
  echo Run this first: pnpm build:web:service
  exit /b 1
)

if not defined CC_SWITCH_WEB_HOST set "CC_SWITCH_WEB_HOST=127.0.0.1"
if not defined CC_SWITCH_WEB_PORT set "CC_SWITCH_WEB_PORT=8788"
if defined DIST_DIR (
  set "CC_SWITCH_WEB_DIST_DIR=%DIST_DIR%"
) else (
  set "CC_SWITCH_WEB_DIST_DIR="
)

echo CC Switch Web started
echo Bind address: %CC_SWITCH_WEB_HOST%:%CC_SWITCH_WEB_PORT%
echo Open in browser: http://%CC_SWITCH_WEB_HOST%:%CC_SWITCH_WEB_PORT%
if defined DIST_DIR (
  echo Frontend directory: %CC_SWITCH_WEB_DIST_DIR%
) else (
  echo Frontend assets: embedded in the service binary
)
echo Service binary: %BINARY_PATH%
if /I "%CC_SWITCH_WEB_HOST%"=="0.0.0.0" (
  echo Bound to 0.0.0.0, use the server IP or local machine address to access it
)
echo Press Ctrl+C to stop the service
echo.

"%BINARY_PATH%"
exit /b %ERRORLEVEL%

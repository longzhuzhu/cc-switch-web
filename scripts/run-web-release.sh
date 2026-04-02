#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="${SCRIPT_DIR}"

DIST_DIR="${CC_SWITCH_WEB_DIST_DIR:-${PACKAGE_ROOT}/dist}"
BINARY_PATH="${PACKAGE_ROOT}/cc-switch-web"

if [[ ! -x "${BINARY_PATH}" ]]; then
  echo "Service binary not found: ${BINARY_PATH}" >&2
  exit 1
fi

if [[ ! -d "${DIST_DIR}" ]]; then
  DIST_DIR=""
fi

export CC_SWITCH_WEB_HOST="${CC_SWITCH_WEB_HOST:-127.0.0.1}"
export CC_SWITCH_WEB_PORT="${CC_SWITCH_WEB_PORT:-8788}"
if [[ -n "${DIST_DIR}" ]]; then
  export CC_SWITCH_WEB_DIST_DIR="$(cd "${DIST_DIR}" && pwd)"
else
  unset CC_SWITCH_WEB_DIST_DIR || true
fi

echo "CC Switch Web started"
echo "Bind address: ${CC_SWITCH_WEB_HOST}:${CC_SWITCH_WEB_PORT}"
echo "Open in browser: http://${CC_SWITCH_WEB_HOST}:${CC_SWITCH_WEB_PORT}"
if [[ -n "${DIST_DIR}" ]]; then
  echo "Frontend directory: ${CC_SWITCH_WEB_DIST_DIR}"
else
  echo "Frontend assets: embedded in the service binary"
fi
echo "Service binary: ${BINARY_PATH}"
if [[ "${CC_SWITCH_WEB_HOST}" == "0.0.0.0" ]]; then
  echo "Bound to 0.0.0.0, use the server IP or local machine address to access it"
fi
echo "Press Ctrl+C to stop the service"
echo

exec "${BINARY_PATH}"

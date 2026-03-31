#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DIST_DIR="${CC_SWITCH_WEB_DIST_DIR:-${REPO_ROOT}/dist}"
BINARY_PATH="${REPO_ROOT}/src-tauri/target/release/cc-switch-web"

if [[ ! -d "${DIST_DIR}" ]]; then
  echo "dist 目录不存在: ${DIST_DIR}" >&2
  echo "请先执行: pnpm build:web" >&2
  exit 1
fi

if [[ ! -x "${BINARY_PATH}" ]]; then
  echo "服务二进制不存在: ${BINARY_PATH}" >&2
  echo "请先执行: pnpm build:web:service" >&2
  exit 1
fi

export CC_SWITCH_WEB_HOST="${CC_SWITCH_WEB_HOST:-127.0.0.1}"
export CC_SWITCH_WEB_PORT="${CC_SWITCH_WEB_PORT:-8788}"
export CC_SWITCH_WEB_DIST_DIR="${DIST_DIR}"

echo "cc-switch-web 正在启动: http://${CC_SWITCH_WEB_HOST}:${CC_SWITCH_WEB_PORT}"
exec "${BINARY_PATH}"


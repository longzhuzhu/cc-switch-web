# CC Switch Web

English | [中文](README_ZH.md) | [日本語](README_JA.md)

## Overview

CC Switch Web is the web branch repository of [cc-switch](https://github.com/farion1231/cc-switch).

This repository is used to carry web-oriented work around CC Switch, including web-side implementation, related experiments, and branch-specific adjustments.

The current target architecture is:

- Frontend: Web
- Backend: local Rust service
- Access pattern: browser opens `http://localhost:xxxx`

This direction is intended to support headless Linux servers in addition to regular Windows and Linux desktop environments.

## Relationship to Upstream

- Upstream project: [cc-switch](https://github.com/farion1231/cc-switch)
- This repository focuses on the Web branch direction of CC Switch
- When project positioning or external description changes, all language README files in this repository should be updated together

## Notes

If you are looking for the original CC Switch project, desktop application, or upstream release information, please visit the upstream repository directly.

## Run

### Local Run

1. Install dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Start development mode with one command:

   ```bash
   pnpm dev:web
   ```

   Open [http://localhost:3000](http://localhost:3000). The frontend talks to the local Rust service at `http://127.0.0.1:8788`.

3. Start a production-style local run:

   ```bash
   pnpm build:web
   pnpm start:web
   ```

   Then open [http://localhost:8788](http://localhost:8788).

4. Build once and run the release binary directly:

   ```bash
   pnpm build:web
   pnpm build:web:service
   ```

   Linux:

   ```bash
   bash scripts/run-web.sh
   ```

   Windows:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\run-web.ps1
   ```

### Docker Run

1. Build and start:

   ```bash
   docker compose up --build -d
   ```

2. Open [http://localhost:8788](http://localhost:8788).

3. Stop:

   ```bash
   docker compose down
   ```

4. Persistent data is stored in the `cc-switch-web-data` volume.

If you want the containerized service to manage host-side CLI configuration directories directly, add bind mounts in `docker-compose.yml` for paths such as `.claude`, `.codex`, `.gemini`, `opencode`, and `openclaw`.

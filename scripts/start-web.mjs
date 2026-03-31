import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const isWindows = process.platform === "win32";
const cargoCmd = isWindows ? "cargo.exe" : "cargo";
const distDir = process.env.CC_SWITCH_WEB_DIST_DIR || path.join(process.cwd(), "dist");

if (!existsSync(distDir)) {
  console.error(`[start:web] dist directory not found: ${distDir}`);
  console.error("[start:web] run `pnpm build:web` first");
  process.exit(1);
}

const child = spawn(
  cargoCmd,
  ["run", "--manifest-path", "src-tauri/Cargo.toml", "--bin", "cc-switch-web"],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      CC_SWITCH_WEB_DIST_DIR: distDir,
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(0);
  }
  process.exit(code ?? 0);
});

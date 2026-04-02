import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const isWindows = process.platform === "win32";
const cargoCmd = isWindows ? "cargo.exe" : "cargo";
const distDir =
  process.env.CC_SWITCH_WEB_DIST_DIR || path.join(process.cwd(), "dist");
const hasDist = existsSync(distDir);
const host = process.env.CC_SWITCH_WEB_HOST || "127.0.0.1";
const port = process.env.CC_SWITCH_WEB_PORT || "8788";

console.log("CC Switch Web started");
console.log(`Bind address: ${host}:${port}`);
console.log(`Open in browser: http://${host}:${port}`);
if (hasDist) {
  console.log(`Frontend directory: ${distDir}`);
} else {
  console.log("Frontend assets: embedded resources will be used when available");
}
console.log(
  "Service command: cargo run --manifest-path backend/Cargo.toml --bin cc-switch-web",
);
if (host === "0.0.0.0") {
  console.log("Bound to 0.0.0.0, use the server IP or local machine address to access it");
}
console.log("Press Ctrl+C to stop the service");
console.log("");

const child = spawn(
  cargoCmd,
  ["run", "--manifest-path", "backend/Cargo.toml", "--bin", "cc-switch-web"],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      CC_SWITCH_WEB_HOST: host,
      CC_SWITCH_WEB_PORT: port,
      ...(hasDist ? { CC_SWITCH_WEB_DIST_DIR: distDir } : {}),
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(0);
  }
  process.exit(code ?? 0);
});

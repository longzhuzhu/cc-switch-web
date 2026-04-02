import { spawnSync } from "node:child_process";
import process from "node:process";

const mode = (process.argv[2] || "w").toLowerCase();
const isWindows = process.platform === "win32";
const cargoCmd = isWindows ? "cargo.exe" : "cargo";

function printUsage() {
  console.log("Usage: pnpm build -- <w|d>");
  console.log("  w: local release build (frontend bundle + embedded Rust binary)");
  console.log("  d: Docker image build");
}

function run(command, args) {
  const result =
    isWindows && command === "pnpm"
      ? spawnSync("cmd.exe", ["/d", "/s", "/c", command, ...args], {
          cwd: process.cwd(),
          stdio: "inherit",
          env: process.env,
        })
      : spawnSync(command, args, {
          cwd: process.cwd(),
          stdio: "inherit",
          shell: isWindows && command === "docker",
          env: process.env,
        });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

switch (mode) {
  case "w":
    console.log("[build] mode=w -> local release build");
    run("pnpm", ["exec", "vite", "build"]);
    run(cargoCmd, [
      "build",
      "--release",
      "--manifest-path",
      "backend/Cargo.toml",
      "--bin",
      "cc-switch-web",
    ]);
    break;
  case "d":
    console.log("[build] mode=d -> Docker image build");
    run("docker", ["compose", "build"]);
    break;
  default:
    console.error(`[build] unsupported argument: ${mode}`);
    printUsage();
    process.exit(1);
}

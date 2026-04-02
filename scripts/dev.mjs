import { spawn } from "node:child_process";
import process from "node:process";

const mode = (process.argv[2] || "w").toLowerCase();
const isWindows = process.platform === "win32";

function printUsage() {
  console.log("Usage: pnpm dev -- <w|d>");
  console.log("  w: local development mode");
  console.log("  d: Docker foreground development mode");
}

function spawnCommand(command, args) {
  const child =
    isWindows && command === "pnpm"
      ? spawn("cmd.exe", ["/d", "/s", "/c", command, ...args], {
          cwd: process.cwd(),
          stdio: "inherit",
          env: process.env,
        })
      : spawn(command, args, {
          cwd: process.cwd(),
          stdio: "inherit",
          env: process.env,
        });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(0);
    }
    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    console.error("[dev] failed to start", error);
    process.exit(1);
  });
}

switch (mode) {
  case "w":
    console.log("[dev] mode=w -> local development mode");
    spawnCommand(process.execPath, ["scripts/dev-web.mjs"]);
    break;
  case "d":
    console.log("[dev] mode=d -> Docker foreground development mode");
    spawnCommand("docker", ["compose", "up", "--build"]);
    break;
  default:
    console.error(`[dev] unsupported argument: ${mode}`);
    printUsage();
    process.exit(1);
}

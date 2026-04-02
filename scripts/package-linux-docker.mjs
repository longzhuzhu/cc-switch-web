import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const exportDirOnly = process.argv.includes("--dir");
const target = exportDirOnly ? "package-linux-dir" : "package-linux-tar";
const outputRoot = path.join(repoRoot, "release", "docker-linux");

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

const args = [
  "buildx",
  "build",
  "--target",
  target,
  "--output",
  `type=local,dest=${outputRoot}`,
  ".",
];

console.log(`[build:pkg:l] docker ${args.join(" ")}`);

const result = spawnSync("docker", args, {
  cwd: repoRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (exportDirOnly) {
  console.log(
    `[build:pkg:l] Exported Linux release directory: ${path.join(outputRoot, "cc-switch-web-linux-x64")}`,
  );
} else {
  console.log(
    `[build:pkg:l] Exported Linux release archive: ${path.join(outputRoot, "cc-switch-web-linux-x64.tar.gz")}`,
  );
}

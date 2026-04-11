import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

export const isWindows = process.platform === "win32";
export const cargoCmd = isWindows ? "cargo.exe" : "cargo";

function resolveCommand(command, args, shell) {
  if (isWindows && command === "pnpm") {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", command, ...args],
      shell: false,
    };
  }

  return {
    command,
    args,
    shell: shell ?? (isWindows && command === "docker"),
  };
}

export function runOrExit(command, args, options = {}) {
  const { env, shell, ...rest } = options;
  const resolved = resolveCommand(command, args, shell);
  const result = spawnSync(resolved.command, resolved.args, {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      ...env,
    },
    shell: resolved.shell,
    ...rest,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  return result;
}

export function spawnInherited(command, args, options = {}) {
  const { env, shell, ...rest } = options;
  const resolved = resolveCommand(command, args, shell);

  return spawn(resolved.command, resolved.args, {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      ...env,
    },
    shell: resolved.shell,
    ...rest,
  });
}

export function checkNodeScriptSyntax(scriptPath) {
  runOrExit(process.execPath, ["--check", scriptPath], { shell: false });
}

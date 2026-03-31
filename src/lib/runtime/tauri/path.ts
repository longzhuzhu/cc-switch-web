import { isTauriRuntime } from "./env";

export async function homeDir(): Promise<string> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/path");
    return mod.homeDir();
  }

  throw new Error("[runtime:web] homeDir is not available in browser mode");
}

export async function join(...paths: string[]): Promise<string> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/path");
    return mod.join(...paths);
  }

  return paths.join("/").replace(/\/{2,}/g, "/");
}


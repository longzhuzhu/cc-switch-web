import { isTauriRuntime } from "./env";

export async function exit(code = 0): Promise<void> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/process");
    await mod.exit(code);
    return;
  }

  console.warn(`[runtime:web] exit(${code}) ignored in browser mode`);
}

export async function relaunch(): Promise<void> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/process");
    await mod.relaunch();
    return;
  }

  if (typeof window !== "undefined") {
    window.location.reload();
  }
}


import { isTauriRuntime } from "./env";

export async function getVersion(): Promise<string> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/app");
    return mod.getVersion();
  }

  return __APP_VERSION__;
}


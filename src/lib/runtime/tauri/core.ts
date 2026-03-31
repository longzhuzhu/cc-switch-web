import {
  getDefaultGlobalProxyConfig,
  getDefaultProxyConfig,
  getDefaultProxyStatus,
  getDefaultProxyTakeoverStatus,
  getDefaultSettings,
} from "./defaults";
import { isTauriRuntime } from "./env";

type InvokeArgs = Record<string, unknown> | undefined;

const webUnsupportedError = (command: string): Error =>
  new Error(`[runtime:web] Tauri command not available yet: ${command}`);

export async function invoke<T>(
  command: string,
  args?: InvokeArgs,
): Promise<T> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/core");
    return mod.invoke<T>(command, args);
  }

  switch (command) {
    case "get_init_error":
      return null as T;
    case "get_migration_result":
      return false as T;
    case "get_skills_migration_result":
      return null as T;
    case "get_settings":
      return getDefaultSettings() as T;
    case "get_providers":
      return {} as T;
    case "get_current_provider":
      return "" as T;
    case "get_universal_providers":
      return {} as T;
    case "get_universal_provider":
      return null as T;
    case "get_opencode_live_provider_ids":
    case "get_openclaw_live_provider_ids":
    case "get_tool_versions":
      return [] as T;
    case "get_proxy_status":
      return getDefaultProxyStatus() as T;
    case "get_proxy_takeover_status":
      return getDefaultProxyTakeoverStatus() as T;
    case "get_proxy_config":
      return getDefaultProxyConfig() as T;
    case "get_global_proxy_config":
      return getDefaultGlobalProxyConfig() as T;
    case "is_proxy_running":
    case "is_live_takeover_active":
      return false as T;
    case "get_app_config_dir_override":
      return null as T;
    case "get_config_dir":
      return "" as T;
    case "update_tray_menu":
      return false as T;
    case "set_window_theme":
      return true as T;
    case "open_external": {
      const url = typeof args?.url === "string" ? args.url : undefined;
      if (typeof window !== "undefined" && url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return undefined as T;
    }
    default:
      throw webUnsupportedError(command);
  }
}


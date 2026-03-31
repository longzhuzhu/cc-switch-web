import {
  getDefaultGlobalProxyConfig,
  getDefaultProxyConfig,
  getDefaultProxyStatus,
  getDefaultProxyTakeoverStatus,
} from "./defaults";
import { isTauriRuntime } from "./env";
import { getWebProviders, getWebSettings } from "./web";

type AppId = "claude" | "codex" | "gemini" | "opencode" | "openclaw";

type InvokeArgs = Record<string, unknown> | undefined;

const webUnsupportedError = (command: string): Error =>
  new Error(`[runtime:web] Tauri command not available yet: ${command}`);

export async function invoke<T>(
  command: string,
  args?: InvokeArgs,
): Promise<T> {
  if (isTauriRuntime()) {
    const mod = await import("@tauri-apps/api/core");
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
      return (await getWebSettings()) as T;
    case "get_providers": {
      const appId = args?.app as AppId | undefined;
      if (!appId) {
        return {} as T;
      }
      const result = await getWebProviders(appId);
      return result.providers as T;
    }
    case "get_current_provider": {
      const appId = args?.app as AppId | undefined;
      if (!appId) {
        return "" as T;
      }
      const result = await getWebProviders(appId);
      return result.currentProviderId as T;
    }
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


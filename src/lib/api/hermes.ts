import { invoke } from "@/lib/runtime/client/core";
import { settingsApi } from "./settings";
import type {
  HermesHealthWarning,
  HermesModelConfig,
  HermesMemoryKind,
  HermesMemoryLimits,
} from "@/types";

export const hermesApi = {
  async openWebUI(path?: string): Promise<void> {
    const url = await invoke<string>("get_hermes_web_ui_url", {
      path: path ?? null,
    });
    await settingsApi.openExternal(url);
  },

  async launchDashboard(): Promise<void> {
    await invoke("launch_hermes_dashboard");
  },

  async getModelConfig(): Promise<HermesModelConfig | null> {
    return await invoke("get_hermes_model_config");
  },

  async scanHealth(): Promise<HermesHealthWarning[]> {
    return await invoke("scan_hermes_config_health");
  },

  async getMemory(kind: HermesMemoryKind): Promise<string> {
    return await invoke("get_hermes_memory", { kind });
  },

  async setMemory(kind: HermesMemoryKind, content: string): Promise<void> {
    await invoke("set_hermes_memory", { kind, content });
  },

  async getMemoryLimits(): Promise<HermesMemoryLimits> {
    return await invoke("get_hermes_memory_limits");
  },

  async setMemoryEnabled(
    kind: HermesMemoryKind,
    enabled: boolean,
  ): Promise<void> {
    await invoke("set_hermes_memory_enabled", { kind, enabled });
  },
};

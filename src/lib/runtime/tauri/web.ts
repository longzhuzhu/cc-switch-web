import type { Settings } from "@/types";
import type { Provider } from "@/types";
import type { AppId } from "@/lib/api";
import { getDefaultSettings } from "./defaults";

interface ProvidersResponse {
  providers: Record<string, Provider>;
  currentProviderId: string;
}

const DEFAULT_WEB_API_BASE = "http://127.0.0.1:8788";

export const getWebApiBase = (): string => {
  const configured = import.meta.env.VITE_LOCAL_API_BASE?.trim();
  return configured && configured.length > 0
    ? configured.replace(/\/+$/, "")
    : DEFAULT_WEB_API_BASE;
};

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getWebApiBase()}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

export async function getWebSettings(): Promise<Settings> {
  try {
    return await requestJson<Settings>("/api/settings");
  } catch (error) {
    console.warn("[runtime:web] failed to load settings from local service", error);
    return getDefaultSettings();
  }
}

export async function getWebProviders(appId: AppId): Promise<ProvidersResponse> {
  try {
    return await requestJson<ProvidersResponse>(`/api/providers/${appId}`);
  } catch (error) {
    console.warn(
      `[runtime:web] failed to load providers for ${appId} from local service`,
      error,
    );
    return {
      providers: {},
      currentProviderId: "",
    };
  }
}

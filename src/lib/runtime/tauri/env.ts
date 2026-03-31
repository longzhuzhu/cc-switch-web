declare global {
  interface Window {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  }
}

export const isTauriRuntime = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);
};

export const isWebRuntime = (): boolean => !isTauriRuntime();

export {};

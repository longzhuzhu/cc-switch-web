import { isTauriRuntime } from "./env";

export type UnlistenFn = () => void | Promise<void>;

export interface RuntimeEvent<T = unknown> {
  payload: T;
}

export async function listen<T = unknown>(
  event: string,
  handler: (event: RuntimeEvent<T>) => void | Promise<void>,
): Promise<UnlistenFn> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/event");
    return mod.listen<T>(event, handler as any);
  }

  return () => {};
}


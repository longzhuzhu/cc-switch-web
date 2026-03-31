import { isTauriRuntime } from "./env";

interface MessageOptions {
  title?: string;
  kind?: "info" | "warning" | "error";
}

export async function message(
  text: string,
  options?: MessageOptions,
): Promise<void> {
  if (isTauriRuntime()) {
    const mod = await import("@/lib/runtime/tauri/dialog");
    await mod.message(text, options as any);
    return;
  }

  if (typeof window !== "undefined") {
    const title = options?.title ? `${options.title}\n\n` : "";
    window.alert(`${title}${text}`);
  }
}


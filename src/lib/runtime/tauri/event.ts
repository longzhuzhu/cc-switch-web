export type UnlistenFn = () => void | Promise<void>;

export interface RuntimeEvent<T = unknown> {
  payload: T;
}

export async function listen<T = unknown>(
  _event: string,
  _handler: (event: RuntimeEvent<T>) => void | Promise<void>,
): Promise<UnlistenFn> {
  return () => {};
}

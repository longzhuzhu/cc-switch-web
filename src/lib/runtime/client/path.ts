export async function homeDir(): Promise<string> {
  throw new Error("[runtime:web] homeDir is not available in browser mode");
}

export async function join(...paths: string[]): Promise<string> {
  return paths.join("/").replace(/\/{2,}/g, "/");
}

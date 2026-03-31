import { useCallback, useState } from "react";

export interface UseSettingsMetadataResult {
  requiresRestart: boolean;
  isLoading: boolean;
  acknowledgeRestart: () => void;
  setRequiresRestart: (value: boolean) => void;
}

/**
 * useSettingsMetadata - 元数据管理
 * 负责：
 * - requiresRestart（需要重启标志）
 */
export function useSettingsMetadata(): UseSettingsMetadataResult {
  const [requiresRestart, setRequiresRestart] = useState(false);
  const [isLoading] = useState(false);

  const acknowledgeRestart = useCallback(() => {
    setRequiresRestart(false);
  }, []);

  return {
    requiresRestart,
    isLoading,
    acknowledgeRestart,
    setRequiresRestart,
  };
}

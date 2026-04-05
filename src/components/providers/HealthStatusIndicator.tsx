import React from "react";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/lib/api/model-test";
import { useTranslation } from "react-i18next";

interface HealthStatusIndicatorProps {
  status: HealthStatus;
  responseTimeMs?: number;
  className?: string;
}

const statusConfig = {
  operational: {
    color: "bg-[hsl(var(--success))]",
    labelKey: "health.operational",
    labelFallback: "正常",
    textColor: "theme-success-text",
  },
  degraded: {
    color: "bg-[hsl(var(--warning))]",
    labelKey: "health.degraded",
    labelFallback: "降级",
    textColor: "theme-warning-text",
  },
  failed: {
    color: "bg-red-500",
    labelKey: "health.failed",
    labelFallback: "失败",
    textColor: "text-red-600 dark:text-red-400",
  },
};

export const HealthStatusIndicator: React.FC<HealthStatusIndicatorProps> = ({
  status,
  responseTimeMs,
  className,
}) => {
  const { t } = useTranslation();
  const config = statusConfig[status];
  const label = t(config.labelKey, { defaultValue: config.labelFallback });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      <span className={cn("text-xs font-medium", config.textColor)}>
        {label}
        {responseTimeMs !== undefined && ` (${responseTimeMs}ms)`}
      </span>
    </div>
  );
};

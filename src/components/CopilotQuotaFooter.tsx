import React from "react";
import { RefreshCw, AlertCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ProviderMeta } from "@/types";
import { useCopilotQuota } from "@/lib/query/copilot";
import { resolveManagedAccountId } from "@/lib/authBinding";
import { PROVIDER_TYPES } from "@/config/constants";
import {
  TierBadge,
  utilizationColor,
} from "@/components/SubscriptionQuotaFooter";

interface CopilotQuotaFooterProps {
  meta?: ProviderMeta;
  inline?: boolean;
  isCurrent?: boolean;
}

function formatRelativeTime(
  timestamp: number,
  now: number,
  t: (key: string, options?: { count?: number }) => string,
): string {
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return t("usage.justNow");
  if (diff < 3600) {
    return t("usage.minutesAgo", { count: Math.floor(diff / 60) });
  }
  if (diff < 86400) {
    return t("usage.hoursAgo", { count: Math.floor(diff / 3600) });
  }
  return t("usage.daysAgo", { count: Math.floor(diff / 86400) });
}

const CopilotQuotaFooter: React.FC<CopilotQuotaFooterProps> = ({
  meta,
  inline = false,
  isCurrent = false,
}) => {
  const { t } = useTranslation();
  const accountId = resolveManagedAccountId(
    meta,
    PROVIDER_TYPES.GITHUB_COPILOT,
  );

  const {
    data: quota,
    isFetching: loading,
    refetch,
  } = useCopilotQuota(accountId, { enabled: true, autoQuery: isCurrent });

  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    if (!quota?.queriedAt) return;
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, [quota?.queriedAt]);

  if (!quota) return null;

  if (!quota.success) {
    if (inline) {
      return (
        <div className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-card px-3 py-2 text-xs shadow-sm">
          <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
            <AlertCircle size={12} />
            <span>{quota.error || t("subscription.queryFailed")}</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex-shrink-0 rounded p-1 transition-colors hover:bg-muted disabled:opacity-50"
            title={t("subscription.refresh")}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      );
    }

    return null;
  }

  const tiers = quota.tiers;
  if (tiers.length === 0) return null;

  if (inline) {
    return (
      <div className="flex flex-shrink-0 flex-col items-end gap-1 whitespace-nowrap text-xs">
        <div className="flex items-center justify-end gap-2">
          {quota.plan && (
            <span className="text-[10px] text-muted-foreground/70">
              {quota.plan}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <Clock size={10} />
            {quota.queriedAt
              ? formatRelativeTime(quota.queriedAt, now, t)
              : t("usage.never", { defaultValue: "Never" })}
          </span>
          <button
            onClick={(event) => {
              event.stopPropagation();
              refetch();
            }}
            disabled={loading}
            className="flex-shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            title={t("subscription.refresh")}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {tiers.map((tier) => (
            <TierBadge key={tier.name} tier={tier} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-border-default bg-card px-4 py-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {quota.plan || t("subscription.title")}
        </span>
        <div className="flex items-center gap-2">
          {quota.queriedAt && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Clock size={10} />
              {formatRelativeTime(quota.queriedAt, now, t)}
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="rounded p-1 transition-colors hover:bg-muted disabled:opacity-50"
            title={t("subscription.refresh")}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tiers.map((tier) => {
          const label = t("subscription.copilotPremium", {
            defaultValue: "Premium",
          });

          return (
            <div key={tier.name} className="flex items-center gap-3 text-xs">
              <span
                className="min-w-0 font-medium text-gray-500 dark:text-gray-400"
                style={{ width: "25%" }}
              >
                {label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    tier.utilization >= 90
                      ? "bg-red-500"
                      : tier.utilization >= 70
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(tier.utilization, 100)}%` }}
                />
              </div>
              <span
                className={`font-semibold tabular-nums ${utilizationColor(tier.utilization)}`}
              >
                {Math.round(tier.utilization)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CopilotQuotaFooter;

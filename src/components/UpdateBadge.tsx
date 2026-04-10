import { ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdate } from "@/contexts/UpdateContext";
import { useTranslation } from "react-i18next";

interface UpdateBadgeProps {
  className?: string;
  onClick?: () => void;
}

export function UpdateBadge({ className = "", onClick }: UpdateBadgeProps) {
  const { hasUpdate, updateInfo } = useUpdate();
  const { t } = useTranslation();
  const isActive = hasUpdate && updateInfo;
  const title = isActive
    ? t("settings.updateAvailable", {
        version: updateInfo?.latestVersion ?? "",
      })
    : t("settings.updateBadge");

  if (!isActive) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`
        relative h-8 w-8 rounded-full text-emerald-600 hover:bg-emerald-50/80
        dark:text-emerald-400 dark:hover:bg-emerald-500/10
        ${className}
      `}
    >
      <ArrowUpCircle className="h-5 w-5" />
    </Button>
  );
}

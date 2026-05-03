import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authChangeKey, clearAuthToken } from "@/lib/runtime/client/web";

export function SecurityTab() {
  const { t } = useTranslation();
  const [oldKey, setOldKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeKey = async () => {
    setError("");
    if (newKey.length < 6) {
      setError(t("auth.keyMinLength"));
      return;
    }
    if (newKey !== confirmKey) {
      setError(t("auth.keyMismatch"));
      return;
    }
    setLoading(true);
    try {
      await authChangeKey(oldKey, newKey);
      toast.success(t("auth.changeSuccess"));
      setOldKey("");
      setNewKey("");
      setConfirmKey("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Wrong") || msg.includes("Unauthorized")) {
        setError(t("auth.wrongKey"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-border-default p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("auth.security")}</h3>
            <p className="text-sm text-muted-foreground">{t("auth.changeKey")}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("auth.oldKey")}</label>
            <input
              type="password"
              value={oldKey}
              onChange={(e) => setOldKey(e.target.value)}
              placeholder={t("auth.keyPlaceholder")}
              autoComplete="current-password"
              className="w-full rounded-lg border border-border-default bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("auth.newKey")}</label>
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder={t("auth.keyPlaceholder")}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border-default bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("auth.confirmKey")}</label>
            <input
              type="password"
              value={confirmKey}
              onChange={(e) => setConfirmKey(e.target.value)}
              placeholder={t("auth.keyPlaceholder")}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border-default bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={handleChangeKey} disabled={loading}>
            {loading ? t("common.loading") : t("auth.changeKey")}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            {t("auth.login")}
          </Button>
        </div>
      </div>
    </div>
  );
}

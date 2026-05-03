import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyRound, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authHasKey, authSetupKey, authLogin, setAuthToken } from "@/lib/runtime/client/web";

interface LoginPageProps {
  onAuthSuccess: () => void;
}

export function LoginPage({ onAuthSuccess }: LoginPageProps) {
  const { t } = useTranslation();
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [key, setKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authHasKey()
      .then((res) => setHasKey(res.hasKey))
      .catch(() => setHasKey(false));
  }, []);

  const handleSetup = async () => {
    if (key.length < 6) {
      setError(t("auth.keyMinLength"));
      return;
    }
    if (key !== confirmKey) {
      setError(t("auth.keyMismatch"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authSetupKey(key);
      setAuthToken(res.token);
      onAuthSuccess();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already set")) {
        setError(t("auth.wrongKey"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!key) return;
    if (key.length < 6) {
      setError(t("auth.keyMinLength"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authLogin(key);
      setAuthToken(res.token);
      onAuthSuccess();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Unauthorized") || msg.includes("Wrong")) {
        setError(t("auth.wrongKey"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isSetup = hasKey === false;

  if (hasKey === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            {isSetup ? (
              <Shield className="h-7 w-7 text-primary" />
            ) : (
              <KeyRound className="h-7 w-7 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSetup ? t("auth.setupTitle") : t("auth.loginTitle")}
          </h1>
        </div>

        <form
          className="glass-card rounded-2xl border border-border-default p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            isSetup ? handleSetup() : handleLogin();
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("auth.accessKey")}
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t("auth.keyPlaceholder")}
              autoComplete={isSetup ? "new-password" : "current-password"}
              className="w-full rounded-lg border border-border-default bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {isSetup && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("auth.confirmKey")}
              </label>
              <input
                type="password"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                placeholder={t("auth.keyPlaceholder")}
                autoComplete="new-password"
                className="w-full rounded-lg border border-border-default bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            onClick={isSetup ? handleSetup : handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading
              ? t("common.loading")
              : isSetup
                ? t("auth.setupKey")
                : t("auth.login")}
          </Button>
        </form>
      </div>
    </div>
  );
}

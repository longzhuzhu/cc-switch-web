import { useMemo, useState } from "react";
import type { ComponentType, MouseEvent, ReactNode } from "react";
import { ChevronRight, Monitor, Moon, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { THEME_SCHEMES } from "@/config/themeSchemes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ThemeSettings() {
  const { t } = useTranslation();
  const { theme, setTheme, scheme, setScheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const currentScheme = useMemo(
    () => THEME_SCHEMES.find((item) => item.id === scheme) ?? THEME_SCHEMES[0],
    [scheme],
  );

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 theme-primary-text" />
          <h3 className="text-sm font-medium">{t("settings.theme")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{t("settings.themeHint")}</p>
      </header>

      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("settings.themeMode")}
          </h4>
          <div className="inline-flex gap-1 rounded-2xl border border-border-default bg-background/80 p-1 shadow-sm">
            <ThemeModeButton
              active={theme === "light"}
              onClick={(e) => setTheme("light", e)}
              icon={Sun}
            >
              {t("settings.themeLight")}
            </ThemeModeButton>
            <ThemeModeButton
              active={theme === "dark"}
              onClick={(e) => setTheme("dark", e)}
              icon={Moon}
            >
              {t("settings.themeDark")}
            </ThemeModeButton>
            <ThemeModeButton
              active={theme === "system"}
              onClick={(e) => setTheme("system", e)}
              icon={Monitor}
            >
              {t("settings.themeSystem")}
            </ThemeModeButton>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("settings.themePalette")}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t("settings.themePaletteHint")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="glass-card flex w-full items-center justify-between gap-4 rounded-[28px] border border-border-default p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center gap-2">
              {currentScheme.swatches.map((color) => (
                <span
                  key={`${currentScheme.id}-${color}`}
                  className="h-8 w-8 rounded-full border border-black/5 shadow-sm dark:border-white/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-semibold text-foreground">
                  {t(currentScheme.labelKey)}
                </span>
                <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold theme-primary-text shadow-sm">
                  {t("settings.themeCurrent")}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {t(currentScheme.descriptionKey)}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium theme-primary-text">
            <span>{t("settings.themePaletteAction")}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </div>

      <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <DialogContent className="max-w-5xl border-border-default bg-background/95 p-0">
          <DialogHeader className="space-y-2 border-b border-border-default bg-transparent px-6 py-5">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 theme-primary-text" />
              {t("settings.themePaletteDialogTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("settings.themePaletteDialogHint")}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {THEME_SCHEMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={scheme === item.id}
                  onClick={(e) => {
                    setScheme(item.id, e);
                    setPaletteOpen(false);
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-200",
                    "glass-card hover:-translate-y-0.5 hover:shadow-2xl",
                    scheme === item.id
                      ? "border-border-active shadow-xl"
                      : "border-border-default",
                  )}
                >
                  <div className="absolute inset-0 opacity-90">
                    <div
                      className="absolute -left-10 top-0 h-28 w-28 rounded-full blur-3xl"
                      style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}
                    />
                    <div
                      className="absolute bottom-0 right-0 h-24 w-24 rounded-full blur-3xl"
                      style={{ backgroundColor: "hsl(var(--tertiary) / 0.08)" }}
                    />
                  </div>
                  <div className="relative flex h-full flex-col gap-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {item.swatches.map((color) => (
                          <span
                            key={`${item.id}-${color}`}
                            className="h-8 w-8 rounded-full border border-black/5 shadow-sm dark:border-white/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {scheme === item.id ? (
                        <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold theme-primary-text shadow-sm">
                          {t("settings.themeCurrent")}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-semibold tracking-tight text-foreground">
                        {t(item.labelKey)}
                      </div>
                      <p className="text-base text-muted-foreground">
                        {t(item.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface ThemeModeButtonProps {
  active: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}

function ThemeModeButton({
  active,
  onClick,
  icon: Icon,
  children,
}: ThemeModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-w-[112px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "theme-primary-solid shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

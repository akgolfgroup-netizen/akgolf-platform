"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StripeHealth {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  stripe: {
    configured: boolean;
    mode: "live" | "test" | "unknown";
    apiVersion: string;
    responseTimeMs: number;
    products?: number;
    error?: string;
    warnings?: string[];
  };
}

export function WebhookHealthCard() {
  const [health, setHealth] = useState<StripeHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health/stripe", { cache: "no-store" });
      const data = (await res.json()) as StripeHealth;
      setHealth(data);
      setLastCheck(new Date());
    } catch {
      setHealth({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        stripe: {
          configured: false,
          mode: "unknown",
          apiVersion: "unknown",
          responseTimeMs: 0,
          error: "Kan ikke nå health-endepunktet",
        },
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh hvert 5. minutt
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      label: "Operativ",
      dot: "bg-success",
      text: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    },
    degraded: {
      icon: AlertCircle,
      label: "Advarsler",
      dot: "bg-warning",
      text: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    unhealthy: {
      icon: XCircle,
      label: "Feil",
      dot: "bg-error",
      text: "text-error",
      bg: "bg-error/10",
      border: "border-error/20",
    },
  };

  const current = health ? statusConfig[health.status] : statusConfig.unhealthy;
  const Icon = current.icon;

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Stripe-systemhelse
          </h3>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="p-1.5 rounded-md text-[var(--color-muted)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50"
          title="Oppdater"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </button>
      </div>

      {loading && !health ? (
        <div className="space-y-3">
          <div className="h-8 bg-[var(--color-grey-100)] rounded animate-pulse" />
          <div className="h-4 bg-[var(--color-grey-100)] rounded animate-pulse w-3/4" />
        </div>
      ) : health ? (
        <div className="space-y-3">
          {/* Hovedstatus */}
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border",
              current.bg,
              current.border
            )}
          >
            <Icon className={cn("w-5 h-5 shrink-0", current.text)} />
            <div>
              <p className={cn("text-sm font-medium", current.text)}>
                {current.label}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {health.stripe.mode === "live" ? "Live-modus" : "Test-modus"}
                {health.stripe.responseTimeMs > 0 &&
                  ` · ${health.stripe.responseTimeMs}ms`}
              </p>
            </div>
          </div>

          {/* Detaljer */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[var(--color-grey-50)]">
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wide">
                API-versjon
              </p>
              <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                {health.stripe.apiVersion}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--color-grey-50)]">
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wide">
                Webhook
              </p>
              <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                {health.stripe.warnings?.some((w) => w.includes("WEBHOOK_SECRET"))
                  ? "Mangler secret"
                  : "Konfigurert"}
              </p>
            </div>
          </div>

          {/* Advarsler */}
          {health.stripe.warnings && health.stripe.warnings.length > 0 && (
            <div className="space-y-1.5">
              {health.stripe.warnings.map((warning) => (
                <div
                  key={warning}
                  className="flex items-start gap-2 text-xs text-[var(--color-warning)]"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Feil */}
          {health.stripe.error && (
            <div className="flex items-start gap-2 text-xs text-[var(--color-error)]">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{health.stripe.error}</span>
            </div>
          )}

          {/* Siste sjekk */}
          {lastCheck && (
            <p className="text-[10px] text-[var(--color-muted)] text-right">
              Sist sjekket: {lastCheck.toLocaleTimeString("nb-NO")}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { cn } from "@/lib/portal/utils/cn";
import { AlertTriangle, X, Info, CheckCircle, AlertCircle, LucideIcon } from "lucide-react";
import { useState } from "react";

interface AlertItem {
  id: string;
  message: string;
  variant: "success" | "warning" | "error" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface HGAlertBannerProps {
  alerts: AlertItem[];
  className?: string;
  onDismiss?: (id: string) => void;
}

const alertConfig: Record<string, { icon: LucideIcon; style: string }> = {
  success: {
    icon: CheckCircle,
    style: "hg-alert-success",
  },
  warning: {
    icon: AlertTriangle,
    style: "hg-alert-warning",
  },
  error: {
    icon: AlertCircle,
    style: "hg-alert-error",
  },
  info: {
    icon: Info,
    style: "hg-alert-info",
  },
};

export function HGAlertBanner({ alerts, className, onDismiss }: HGAlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    onDismiss?.(id);
  };

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {visibleAlerts.map((alert) => {
        const config = alertConfig[alert.variant];
        const Icon = config.icon;
        
        return (
          <div key={alert.id} className={cn("hg-alert", config.style)}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{alert.message}</span>
            {alert.action && (
              <button
                onClick={alert.action.onClick}
                className="px-3 py-1 text-xs font-medium bg-black/10 rounded hover:bg-black/20 transition-colors"
              >
                {alert.action.label}
              </button>
            )}
            <button
              onClick={() => handleDismiss(alert.id)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Single alert version
interface HGAlertProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
  onDismiss?: () => void;
}

export function HGAlert({ children, variant = "info", className, onDismiss }: HGAlertProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("hg-alert", config.style, className)}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-black/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

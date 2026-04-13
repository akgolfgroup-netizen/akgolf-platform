"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

export type AdminToastVariant = "success" | "error" | "warning" | "info";

export interface AdminToast {
  id: string;
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (toast: Omit<AdminToast, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const iconMap: Record<
  AdminToastVariant,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<AdminToastVariant, string> = {
  success: "#1A4D36",
  error: "#EF4444",
  warning: "#C48A32",
  info: "#0A1F18",
};

export function AdminToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<AdminToast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: Omit<AdminToast, "id">) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: AdminToast = {
        id,
        variant: "info",
        duration: 4000,
        ...input,
      };
      setToasts((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => {
          const Icon = iconMap[t.variant ?? "info"];
          const color = colorMap[t.variant ?? "info"];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto min-w-[280px] max-w-sm flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl bg-white border border-[#D5DFDB]"
              style={{
                borderLeft: `3px solid ${color}`,
                animation: "admin-toast-in 220ms ease",
              }}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0A1F18]">
                  {t.title}
                </div>
                {t.description && (
                  <div className="text-xs mt-0.5 text-[#7A8C85]">
                    {t.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 rounded hover:bg-black/5"
                aria-label="Lukk varsel"
              >
                <X className="w-4 h-4 text-[#7A8C85]" />
              </button>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes admin-toast-in {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast må brukes innenfor AdminToastProvider");
  }
  return context;
}

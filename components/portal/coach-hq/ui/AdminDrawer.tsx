"use client";


import { Icon } from "@/components/ui/icon";
import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  side?: "right" | "left";
}

const widthClass: Record<NonNullable<AdminDrawerProps["width"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function AdminDrawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
  side = "right",
}: AdminDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-0 bottom-0 w-full flex flex-col shadow-2xl bg-surface-container-lowest",
          side === "right" ? "right-0 border-l border-outline-variant/30" : "left-0 border-r border-outline-variant/30",
          widthClass[width],
        )}
        style={{
          animation: `admin-drawer-${side} 240ms ease`,
        }}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-outline-variant/30">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-on-surface">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm mt-0.5 text-on-surface-variant">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-ghost"
              aria-label="Lukk"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant/30">
            {footer}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes admin-drawer-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes admin-drawer-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

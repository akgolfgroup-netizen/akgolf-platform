"use client";


import { Icon } from "@/components/ui/icon";
import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
}

const sizeClass: Record<NonNullable<AdminDialogProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showClose = true,
}: AdminDialogProps) {
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
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "admin-dialog-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden shadow-2xl bg-white border border-grey-200",
          sizeClass[size],
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-grey-200">
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="admin-dialog-title"
                  className="text-lg font-semibold text-black"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm mt-0.5 text-grey-400">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="admin-btn admin-btn-ghost"
                aria-label="Lukk"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {children && <div className="px-6 py-4">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-grey-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

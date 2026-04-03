"use client";

import { createContext, useContext, useState, useCallback, useEffect, useId, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmDialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null);

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
}

interface DialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    resolve: null,
  });

  const titleId = useId();
  const descriptionId = useId();

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    dialog.resolve?.(true);
    setDialog((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [dialog.resolve]);

  const handleCancel = useCallback(() => {
    dialog.resolve?.(false);
    setDialog((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [dialog.resolve]);

  // Escape key handler
  useEffect(() => {
    if (!dialog.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dialog.isOpen, handleCancel]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {dialog.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={handleCancel}
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={dialog.description ? descriptionId : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white p-6 shadow-xl overscroll-contain">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={cn(
                      "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      dialog.variant === "danger" && "bg-red-500/20",
                      dialog.variant === "warning" && "bg-amber-500/20",
                      (!dialog.variant || dialog.variant === "default") && "bg-[var(--color-grey-900)]/20"
                    )}
                  >
                    <AlertTriangle
                      aria-hidden="true"
                      className={cn(
                        "w-5 h-5",
                        dialog.variant === "danger" && "text-red-400",
                        dialog.variant === "warning" && "text-amber-400",
                        (!dialog.variant || dialog.variant === "default") && "text-[var(--color-grey-900)]"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 id={titleId} className="font-semibold text-[var(--color-grey-900)] text-lg">
                      {dialog.title}
                    </h2>
                    {dialog.description && (
                      <p id={descriptionId} className="text-sm text-[var(--color-grey-400)] mt-1">
                        {dialog.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCancel}
                    aria-label="Lukk dialog"
                    className="shrink-0 p-1.5 rounded-lg hover:bg-[var(--color-grey-200)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grey-400)] focus-visible:ring-offset-2"
                  >
                    <X aria-hidden="true" className="w-5 h-5 text-[var(--color-grey-400)]" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grey-400)] focus-visible:ring-offset-2"
                  >
                    {dialog.cancelText || "Avbryt"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    autoFocus
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      dialog.variant === "danger" &&
                        "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
                      dialog.variant === "warning" &&
                        "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400",
                      (!dialog.variant || dialog.variant === "default") &&
                        "bg-[var(--color-grey-900)] text-white hover:opacity-90 focus-visible:ring-[var(--color-grey-400)]"
                    )}
                  >
                    {dialog.confirmText || "Bekreft"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConfirmDialogContext.Provider>
  );
}

"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
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
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="rounded-2xl border border-[var(--color-grey-200)] bg-[white] p-6 shadow-xl">
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
                      className={cn(
                        "w-5 h-5",
                        dialog.variant === "danger" && "text-red-400",
                        dialog.variant === "warning" && "text-amber-400",
                        (!dialog.variant || dialog.variant === "default") && "text-[var(--color-grey-900)]"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-grey-900)] text-lg">
                      {dialog.title}
                    </h3>
                    {dialog.description && (
                      <p className="text-sm text-[var(--color-grey-400)] mt-1">
                        {dialog.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCancel}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-[var(--color-grey-200)] transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-grey-400)]" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)] transition-colors"
                  >
                    {dialog.cancelText || "Avbryt"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      dialog.variant === "danger" &&
                        "bg-red-500 text-white hover:bg-red-600",
                      dialog.variant === "warning" &&
                        "bg-amber-500 text-white hover:bg-amber-600",
                      (!dialog.variant || dialog.variant === "default") &&
                        "bg-[var(--color-grey-900)] text-[var(--color-grey-900)] hover:opacity-90"
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

"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Bekreft",
  cancelLabel = "Avbryt",
  onConfirm,
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-[20px] border-[#E5E3DD] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-inter-tight)] text-lg font-bold text-[#0A1F18]">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-[#5E5C57]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-2 gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#E5E3DD] bg-transparent px-4 text-sm font-medium text-[#5E5C57] transition-colors hover:bg-[#FAFAF7] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-[12px] px-4 text-sm font-semibold text-white transition-colors disabled:opacity-50",
              variant === "danger"
                ? "bg-[#A32D2D] hover:bg-[#8B2626]"
                : "bg-[#005840] hover:bg-[#00472f]"
            )}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

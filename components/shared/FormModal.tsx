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

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: () => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: "max-w-[400px]", md: "max-w-[500px]", lg: "max-w-[640px]" } as const;

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Lagre",
  cancelLabel = "Avbryt",
  loading = false,
  size = "md",
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[85vh] flex-col rounded-[20px] border-[#E5E3DD] bg-white p-0",
          SIZE_MAP[size]
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-[family-name:var(--font-inter-tight)] text-lg font-bold text-[#0A1F18]">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-[#5E5C57]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        <DialogFooter className="border-t border-[#EFEDE6] px-6 py-4 gap-2 sm:gap-2">
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
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-[12px] bg-[#005840] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#00472f] disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
            {submitLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

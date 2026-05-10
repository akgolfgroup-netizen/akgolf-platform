import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorRetryProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ErrorRetry({
  title = "Noe gikk galt",
  description = "Kunne ikke laste innholdet. Prov igjen.",
  onRetry,
  retryLabel = "Prov igjen",
  icon,
  className,
}: ErrorRetryProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}>
      {icon ?? <AlertTriangle size={40} strokeWidth={1.75} className="text-[#B8852A]" />}
      <h3 className="font-[family-name:var(--font-inter-tight)] text-base font-semibold text-[#0A1F18]">
        {title}
      </h3>
      <p className="max-w-xs text-[13px] text-[#5E5C57]">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-[12px] border border-[#E5E3DD] bg-white px-4 py-2 text-[13px] font-medium text-[#005840] transition-colors hover:bg-[#FAFAF7]"
        >
          <RotateCcw size={14} strokeWidth={1.75} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

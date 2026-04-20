"use client";




import { Icon } from "@/components/ui/icon";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-error)]/10 mb-4">
          <Icon name="error" className="w-6 h-6 text-[var(--color-error)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">
          Noe gikk galt
        </h2>
        <p className="text-sm text-[var(--color-grey-500)] mb-4">
          {error.message || "En uventet feil oppstod"}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-black)] text-surface rounded-[980px] text-sm font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
        >
          <Icon name="refresh" className="w-4 h-4" />
          Prøv igjen
        </button>
      </div>
    </div>
  );
}

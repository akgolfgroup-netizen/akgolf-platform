"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <h2 className="text-lg font-bold text-[var(--color-snow)] mb-2">
        Noe gikk galt
      </h2>
      <p className="text-sm text-[var(--color-gold-muted)] mb-6 max-w-sm">
        {error.message || "En uventet feil oppstod. Prøv igjen."}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors"
      >
        Prøv igjen
      </button>
    </div>
  );
}

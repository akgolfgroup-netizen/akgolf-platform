"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { PeriodKey } from "@/app/portal/(dashboard)/statistikk/actions";

interface PeriodTabsProps {
  current: PeriodKey;
}

const OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "30d", label: "30 dager" },
  { key: "90d", label: "90 dager" },
  { key: "season", label: "Sesong" },
  { key: "1y", label: "1 år" },
];

/**
 * Periodevelger pill-gruppe (Brand Guide V2.0).
 * Skifter `?period=`-query og rerendrer server-componenten.
 */
export function PeriodTabs({ current }: PeriodTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = useCallback(
    (key: PeriodKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", key);
      router.push(`/portal/statistikk?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div
      className="inline-flex gap-1 rounded-full p-1"
      style={{ background: "rgba(10, 31, 24, 0.05)" }}
      role="tablist"
      aria-label="Periodevelger"
    >
      {OPTIONS.map((opt) => {
        const isActive = opt.key === current;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.key)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: isActive ? "#0A1F18" : "transparent",
              color: isActive ? "#FFFFFF" : "var(--color-ink-muted, #5C6B62)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

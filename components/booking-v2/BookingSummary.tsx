"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SummaryItem {
  label: string;
  value: string;
  small?: string;
}

interface BookingSummaryProps {
  items: SummaryItem[];
  backHref?: string;
  nextHref?: string;
  nextDisabled?: boolean;
  nextLabel?: string;
  total?: { label: string; value: string };
}

export function BookingSummary({
  items,
  backHref,
  nextHref,
  nextDisabled = false,
  nextLabel = "Neste",
  total,
}: BookingSummaryProps) {
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-line)",
        boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <h4
        className="mb-1 text-base font-semibold"
        style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
      >
        Din booking
      </h4>
      <p
        className="mb-5 text-[11px] font-medium uppercase tracking-wider"
        style={{ color: "var(--color-ink-subtle)", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Oppsummering
      </p>

      <dl className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between gap-4 border-b pb-3 text-sm last:border-b-0 last:pb-0"
            style={{ borderColor: "var(--color-line-soft)" }}
          >
            <dt style={{ color: "var(--color-ink-muted)" }}>{item.label}</dt>
            <dd className="text-right">
              <div className="font-medium" style={{ color: "var(--color-ink)" }}>
                {item.value}
              </div>
              {item.small && (
                <div className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                  {item.small}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {total && (
        <div
          className="mt-5 flex items-center justify-between border-t pt-4"
          style={{ borderColor: "var(--color-line)" }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--color-ink-muted)" }}>
            {total.label}
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            {total.value}
          </span>
        </div>
      )}

      {(backHref || nextHref) && (
        <div className="mt-6 flex flex-col gap-3">
          {nextHref && !nextDisabled && (
            <Link
              href={nextHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
              style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
            >
              {nextLabel}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          )}
          {nextDisabled && (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold opacity-50 cursor-not-allowed"
              style={{ background: "var(--color-line)", color: "var(--color-ink-muted)" }}
            >
              {nextLabel}
            </button>
          )}
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface-soft)]"
              style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              Tilbake
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

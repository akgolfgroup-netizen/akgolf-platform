"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface BookingCardProps {
  href: string;
  title: string;
  description?: string;
  meta?: string[];
  badge?: string;
  icon?: ReactNode;
}

export function BookingCard({ href, title, description, meta, badge, icon }: BookingCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 md:items-center md:gap-6 md:p-7"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-line)",
        boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      {icon && (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl md:h-14 md:w-14"
          style={{ background: "var(--color-primary-soft)" }}
        >
          <span style={{ color: "var(--color-primary)" }}>{icon}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className="text-lg font-semibold tracking-tight md:text-xl"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            {title}
          </h3>
          {badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-deep)" }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
            {description}
          </p>
        )}
        {meta && meta.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {meta.map((m, i) => (
              <span
                key={i}
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--color-ink-subtle)", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] md:h-10 md:w-10"
        style={{ borderColor: "var(--color-line)" }}
      >
        <ArrowRight
          className="h-3.5 w-3.5 transition-colors group-hover:text-white"
          style={{ color: "var(--color-ink-muted)" }}
        />
      </div>
    </Link>
  );
}
